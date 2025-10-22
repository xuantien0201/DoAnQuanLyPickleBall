import express from 'express';
import { db } from '../../../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', startDate, endDate, salesType, statusFilter } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const searchPattern = `%${search}%`;

        let whereClause = 'WHERE 1=1';
        const queryParams = [];
        const countParams = [];

        if (search) {
            whereClause += ' AND (o.order_code LIKE ? OR kh.TenKh LIKE ? OR kh.SDT LIKE ?)';
            queryParams.push(searchPattern, searchPattern, searchPattern);
            countParams.push(searchPattern, searchPattern, searchPattern);
        }

        if (startDate) {
            whereClause += ' AND o.created_at >= ?';
            queryParams.push(startDate);
            countParams.push(startDate);
        }
        if (endDate) {
            whereClause += ' AND o.created_at <= ?';
            queryParams.push(endDate + ' 23:59:59'); // Bao gồm cả ngày kết thúc
            countParams.push(endDate + ' 23:59:59');
        }
        if (salesType && salesType !== 'all') {
            whereClause += ' AND o.order_type = ?';
            queryParams.push(salesType);
            countParams.push(salesType);
        }
        if (statusFilter && statusFilter !== 'all') {
            whereClause += ' AND o.status = ?';
            queryParams.push(statusFilter);
            countParams.push(statusFilter);
        }

        // 1. Lấy tổng số đơn hàng
        const [totalCountResult] = await db.query(
            `SELECT COUNT(o.id) AS totalCount
             FROM orders o
             LEFT JOIN tbl_khachhang kh ON o.customer_id = kh.id
             ${whereClause}`,
            countParams
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

        // 3. Lấy dữ liệu cho Dashboard Mini
        const [allTimeStats] = await db.query(`
            SELECT
                COUNT(id) AS totalOrdersAllTime,
                SUM(CASE WHEN status = 'da_nhan' THEN total_amount ELSE 0 END) AS totalRevenueAllTime
            FROM orders
        `);

        const [todayStats] = await db.query(`
            SELECT
                COUNT(id) AS totalOrdersToday,
                SUM(CASE WHEN status = 'da_nhan' THEN total_amount ELSE 0 END) AS totalRevenueToday
            FROM orders
            WHERE DATE(created_at) = CURDATE()
        `);

        const [statusCounts] = await db.query(`
            SELECT
                SUM(CASE WHEN status = 'dang_xu_ly' THEN 1 ELSE 0 END) AS processingOrders,
                SUM(CASE WHEN status = 'giao_that_bai' THEN 1 ELSE 0 END) AS failedOrders,
                SUM(CASE WHEN status = 'da_nhan' THEN 1 ELSE 0 END) AS successfulOrders
            FROM orders
        `);

        res.json({
            orders,
            totalCount,
            dashboardStats: {
                totalOrdersAllTime: allTimeStats[0].totalOrdersAllTime || 0,
                totalRevenueAllTime: allTimeStats[0].totalRevenueAllTime || 0,
                totalOrdersToday: todayStats[0].totalOrdersToday || 0,
                totalRevenueToday: todayStats[0].totalRevenueToday || 0,
                processingOrders: statusCounts[0].processingOrders || 0,
                failedOrders: statusCounts[0].failedOrders || 0,
                successfulOrders: statusCounts[0].successfulOrders || 0,
            }
        });

    } catch (error) {
        console.error('Lỗi khi tải đơn hàng:', error);
        res.status(500).json({ error: 'Không thể tải danh sách đơn hàng.' });
    }
});

export default router;