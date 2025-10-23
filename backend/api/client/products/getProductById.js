import express from 'express';
import { db } from '../../../config/db.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        const [products] = await db.query(`
            SELECT 
                p.*, 
                COALESCE(SUM(oi.quantity), 0) AS total_sold
            FROM products p
            LEFT JOIN order_items oi ON p.id = oi.product_id
            LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 'da_nhan'
            WHERE p.id = ?
            GROUP BY p.id
        `, [req.params.id]);

        if (products.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        res.json(products[0]);
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
        res.status(500).json({ error: 'Không thể lấy thông tin sản phẩm' });
    }
});

export default router;