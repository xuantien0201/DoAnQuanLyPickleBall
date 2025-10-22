import express from 'express';
import { db } from '../../../config/db.js';

const router = express.Router();

// GET order history for development (returns all orders)
// TODO: Add authentication middleware before production
router.get('/history', async (req, res) => {
    // const userId = req.user?.id;

    // if (!userId) {
    //     return res.status(401).json({ error: 'Yêu cầu xác thực người dùng.' });
    // }

    try {
        // Tạm thời lấy tất cả đơn hàng để phát triển.
        // Cần thay thế bằng: 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC'
        const [orders] = await db.query(
            'SELECT * FROM orders ORDER BY created_at DESC'
            // [userId]
        );
        res.json(orders);
    } catch (error) {
        console.error('Lỗi khi lấy lịch sử đơn hàng:', error);
        res.status(500).json({ error: 'Không thể lấy lịch sử đơn hàng.' });
    }
});

export default router;