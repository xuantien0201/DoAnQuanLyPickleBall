import express from 'express';
import { db } from '../../../config/db.js'; // Adjusted path

const router = express.Router();

// Get single product by ID
router.get('/:id', async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);

        if (products.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Get reviews for the product
        const [reviews] = await db.query('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC', [req.params.id]);

        const product = products[0];
        product.reviews = reviews;

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

export default router;