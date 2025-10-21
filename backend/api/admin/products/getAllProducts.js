import express from 'express';
import { db } from '../../../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const searchPattern = `%${search}%`;

        const countParams = [];
        let countQuery = 'SELECT COUNT(*) as totalCount FROM products WHERE 1=1';
        if (search) {
            countQuery += ' AND (name LIKE ? OR description LIKE ?)';
            countParams.push(searchPattern, searchPattern);
        }

        const [totalResult] = await db.query(countQuery, countParams);
        const totalCount = totalResult[0].totalCount;

        const params = [];
        let query = 'SELECT * FROM products WHERE 1=1';
        if (search) {
            query += ' AND (name LIKE ? OR description LIKE ?)';
            params.push(searchPattern, searchPattern);
        }
        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const [products] = await db.query(query, params);
        res.json({ products, totalCount });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm (Admin):', error);
        res.status(500).json({ error: 'Không thể lấy danh sách sản phẩm' });
    }
});

export default router;