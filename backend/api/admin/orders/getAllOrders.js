import express from 'express';
import { db } from '../../../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 5, search = '', startDate, endDate, salesType, statusFilter } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const searchPattern = `%${search}%`;

        let whereClause = 'WHERE 1=1';
        const queryParams = []; // Dùng cho cả orders, totalCount và dashboardStats

        if (search) {
            whereClause += ' AND (o.order_code LIKE ? OR kh.TenKh LIKE ? OR kh.SDT LIKE ?)';
            queryParams.push(searchPattern, searchPattern, searchPattern);
        }

        if (startDate) {
            whereClause += ' AND o.created_at >= ?';
            queryParams.push(startDate);
        }
        if (endDate) {
            whereClause += ' AND o.created_at <= ?';
            queryParams.push(endDate + ' 23:59:59'); // Bao gồm cả ngày kết thúc
        }
        if (salesType && salesType !== 'all') {
            whereClause += ' AND o.order_type = ?';
            queryParams.push(salesType);
        }
        if (statusFilter && statusFilter !== 'all') {
            whereClause += ' AND o.status = ?';
            queryParams.push(statusFilter);
        }

        // 1. Lấy tổng số đơn hàng (áp dụng bộ lọc)
        const [totalCountResult] = await db.query(
            `SELECT COUNT(o.id) AS totalCount
             FROM orders o
             LEFT JOIN tbl_khachhang kh ON o.customer_id = kh.id
             ${whereClause}`,
            queryParams
        );
        const totalCount = totalCountResult[0].totalCount;

        // 2. Lấy danh sách đơn hàng có phân trang và lọc
        const [orders] = await db.query(
            `SELECT o.*, kh.TenKh AS customer_name, kh.SDT AS customer_phone, kh.email AS customer_email, kh.GioiTinh AS customer_gender
             FROM orders o
             LEFT JOIN tbl_khachhang kh ON o.customer_id = kh.id
             ${whereClause}
             ORDER BY o.created_at DESC
             LIMIT ? OFFSET ?`,
            [...queryParams, parseInt(limit), offset]
        );

        // 3. Lấy dữ liệu cho Dashboard Mini (áp dụng cùng bộ lọc)
        const [dashboardStatsResult] = await db.query(`
            SELECT
                COUNT(o.id) AS totalOrdersFiltered,
                SUM(CASE WHEN o.status = 'da_nhan' THEN o.total_amount ELSE 0 END) AS totalRevenueFiltered,
                SUM(CASE WHEN o.status = 'dang_xu_ly' THEN 1 ELSE 0 END) AS processingOrders,
                SUM(CASE WHEN o.status IN ('da_huy', 'giao_that_bai', 'huy_sau_xac_nhan') THEN 1 ELSE 0 END) AS failedOrders,
                SUM(CASE WHEN o.status = 'da_nhan' THEN 1 ELSE 0 END) AS successfulOrders
            FROM orders o
            LEFT JOIN tbl_khachhang kh ON o.customer_id = kh.id
            ${whereClause}
        `, queryParams);

        // Lấy tổng số lượng sản phẩm đã bán và top sản phẩm (chỉ từ đơn hàng thành công)
        const successfulOrdersWhereClause = whereClause + " AND o.status = 'da_nhan'";

        const [totalItemsSoldResult] = await db.query(`
            SELECT SUM(oi.quantity) AS totalItemsSold
            FROM orders o
            LEFT JOIN tbl_khachhang kh ON o.customer_id = kh.id
            JOIN order_items oi ON o.id = oi.order_id
            ${successfulOrdersWhereClause}
        `, queryParams);

        const [topSellingProducts] = await db.query(`
            SELECT oi.product_name, SUM(oi.quantity) as total_sold
            FROM orders o
            LEFT JOIN tbl_khachhang kh ON o.customer_id = kh.id
            JOIN order_items oi ON o.id = oi.order_id
            ${successfulOrdersWhereClause}
            GROUP BY oi.product_name
            ORDER BY total_sold DESC
            LIMIT 3
        `, queryParams);

        const stats = dashboardStatsResult[0];
        const totalItemsSold = totalItemsSoldResult[0].totalItemsSold || 0;

        res.json({
            orders,
            totalCount,
            dashboardStats: {
                totalOrdersFiltered: stats.totalOrdersFiltered || 0,
                totalRevenueFiltered: stats.totalRevenueFiltered || 0,
                processingOrders: stats.processingOrders || 0,
                failedOrders: stats.failedOrders || 0,
                successfulOrders: stats.successfulOrders || 0,
                totalItemsSold: totalItemsSold,
                topSellingProducts: topSellingProducts || [],
            }
        });

    } catch (error) {
        console.error('Lỗi khi tải đơn hàng:', error);
        res.status(500).json({ error: 'Không thể tải danh sách đơn hàng.' });
    }
});

export default router;