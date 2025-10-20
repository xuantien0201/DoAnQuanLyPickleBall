import express from 'express';
import { db } from '../config/db.js';

const router = express.Router();

// Get all products with optional filters and sorting
router.get('/', async (req, res) => {
  try {
    const { category, sort, search, minPrice, maxPrice, status, page, limit } = req.query;

    const currentPage = parseInt(page) || 1;
    const productsPerPage = parseInt(limit) || 12; // Mặc định 12 sản phẩm mỗi trang
    const offset = (currentPage - 1) * productsPerPage;

    // Build the base query for counting total products
    // Thay đổi INNER JOIN thành LEFT JOIN ở đây
    let countQuery = 'SELECT COUNT(p.id) AS totalCount FROM products p LEFT JOIN categories c ON p.category = c.name WHERE 1=1';
    const countParams = [];

    // Apply filters to count query
    if (category) {
      countQuery += ' AND c.slug = ?';
      countParams.push(category);
    }
    if (search) {
      countQuery += ' AND (p.name LIKE ? OR p.description LIKE ?)';

      countParams.push(`%${search}%`, `%${search}%`);
    }
    if (minPrice) {
      countQuery += ' AND p.price >= ?';
      countParams.push(minPrice);
    }
    if (maxPrice) {
      countQuery += ' AND p.price <= ?';
      countParams.push(maxPrice);
    }
    if (status === 'new') {
      countQuery += ' AND p.is_new = true';
    } else if (status === 'sale') {
      countQuery += ' AND p.original_price IS NOT NULL AND p.price < p.original_price';
    }

    const [totalCountResult] = await db.query(countQuery, countParams);
    const totalCount = totalCountResult[0].totalCount;

    // Join with categories table to filter by category slug
    // Thay đổi INNER JOIN thành LEFT JOIN ở đây
    let query = 'SELECT p.* FROM products p LEFT JOIN categories c ON p.category = c.name WHERE 1=1';
    const params = [];

    if (category) {
      // Filter by category slug from the categories table
      query += ' AND c.slug = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (minPrice) {
      query += ' AND p.price >= ?';
      params.push(minPrice);
    }

    if (maxPrice) {
      query += ' AND p.price <= ?';
      params.push(maxPrice);
    }

    // Lọc theo trạng thái sản phẩm
    if (status === 'new') {
      query += ' AND p.is_new = true';
    } else if (status === 'sale') {
      // Giả sử sản phẩm giảm giá có original_price > price
      query += ' AND p.original_price IS NOT NULL AND p.price < p.original_price';
    }

    // Sorting
    if (sort === 'price_asc') {
      query += ' ORDER BY p.price ASC';
    } else if (sort === 'price_desc') {
      query += ' ORDER BY p.price DESC';
    } else if (sort === 'name_asc') {
      query += ' ORDER BY p.name ASC';
    } else if (sort === 'name_desc') {
      query += ' ORDER BY p.name DESC';
    } else if (sort === 'newest') {
      query += ' ORDER BY p.created_at DESC';
    } else {
      // Thay đổi thứ tự sắp xếp mặc định để hiển thị đa dạng hơn
      query += ' ORDER BY c.name ASC, p.name ASC'; // Sắp xếp theo tên danh mục, sau đó theo tên sản phẩm
    }

    // Add LIMIT and OFFSET for pagination
    query += ' LIMIT ? OFFSET ?';
    params.push(productsPerPage, offset);

    const [products] = await db.query(query, params);
    res.json({ products, totalCount }); // Trả về cả sản phẩm và tổng số lượng
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

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

// Get new arrivals
router.get('/featured/new-arrivals', async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products WHERE is_new = true ORDER BY created_at DESC LIMIT 8');
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch new arrivals' });
  }
});

// Endpoint mới để lấy sản phẩm giảm giá nổi bật
router.get('/featured/on-sale', async (req, res) => {
  try {
    const [products] = await db.query(
      'SELECT * FROM products WHERE original_price IS NOT NULL AND price < original_price ORDER BY (original_price - price) DESC LIMIT 8'
    );
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch on-sale products' });
  }
});

// Add product review
router.post('/:id/reviews', async (req, res) => {
  try {
    const { rating, comment, author_name } = req.body;
    const productId = req.params.id;

    await db.query(
      'INSERT INTO reviews (product_id, rating, comment, author_name) VALUES (?, ?, ?, ?)',
      [productId, rating, comment, author_name]
    );

    // Update product rating and review count
    const [reviews] = await db.query('SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE product_id = ?', [productId]);

    await db.query(
      'UPDATE products SET rating = ?, reviews_count = ? WHERE id = ?',
      [reviews[0].avg_rating, reviews[0].count, productId]
    );

    res.json({ message: 'Review added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add review' });
  }
});

export default router;
