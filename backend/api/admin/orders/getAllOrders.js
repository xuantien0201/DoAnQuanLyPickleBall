import express from 'express';
import { db } from '../../../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const searchPattern = `%${search}%`;

        const countParams = [];
        let countQuery = 'SELECT COUNT(*) as totalCount FROM orders WHERE 1=1';
        if (search) {
            countQuery += ' AND (order_code LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ?)';
            countParams.push(searchPattern, searchPattern, searchPattern);
        }

        const [totalResult] = await db.query(countQuery, countParams);
        const totalCount = totalResult[0].totalCount;

        const params = [];
        let query = 'SELECT id, order_code, customer_name, customer_email, customer_phone, created_at, total_amount, payment_method, status FROM orders WHERE 1=1';
        if (search) {
            query += ' AND (order_code LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ?)';
            params.push(searchPattern, searchPattern, searchPattern);
        }
        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const [orders] = await db.query(query, params);
        res.json({ orders, totalCount });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách đơn hàng (Admin):', error);
        res.status(500).json({ error: 'Không thể lấy danh sách đơn hàng' });
    }
});

export default router;