import express from 'express';
import { db } from '../../../config/db.js'; // Adjusted path

const router = express.Router();

// Get order by order code
router.get('/:orderCode', async (req, res) => {
    try {
        const [orders] = await db.query('SELECT * FROM orders WHERE order_code = ?', [req.params.orderCode]);
        if (orders.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
        const order = orders[0];

        const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);

        res.json({ ...order, items });
    } catch (error) {
        console.error('Lỗi khi lấy đơn hàng theo mã:', error);
        res.status(500).json({ error: 'Không thể lấy thông tin đơn hàng' });
    }
});

export default router;