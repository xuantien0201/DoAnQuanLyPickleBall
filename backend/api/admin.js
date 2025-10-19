import express from 'express';
import { db } from "../config/db.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const uploadsDir = 'uploads';

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/products';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `product-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/categories';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },

  filename: (req, file, cb) => {
    cb(null, `category-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const productUpload = multer({ storage: productStorage });
const upload = multer({ storage: categoryStorage });

router.get('/products', async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(products);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    res.status(500).json({ error: 'Không thể lấy danh sách sản phẩm' });
  }
});

router.post('/products', productUpload.single('image'), async (req, res) => {
  try {
    const { name, description, price, original_price, category, colors, stock, is_new, discount_percent } = req.body;

    const imageUrl = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`
      : (req.body.image_url || null);

    const productData = {
      name,
      description,
      price,
      original_price: original_price || null,
      category,
      image_url: imageUrl,
      colors: colors || '[]',
      stock,
      is_new: is_new === 'true' || is_new === true ? 1 : 0,
      discount_percent: discount_percent || null
    };

    const [result] = await db.query('INSERT INTO products SET ?', [productData]);

    res.json({ message: 'Sản phẩm đã được tạo thành công', productId: result.insertId });
  } catch (error) {
    console.error('Lỗi khi tạo sản phẩm:', error);
    res.status(500).json({ error: 'Không thể tạo sản phẩm' });
  }
});

router.put('/products/:id', productUpload.single('image'), async (req, res) => {
  try {
    const { name, description, price, original_price, category, colors, stock, is_new, discount_percent } = req.body;
    let imageUrl = req.body.image_url;

    if (req.file) {
      const [oldProduct] = await db.query('SELECT image_url FROM products WHERE id = ?', [req.params.id]);
      if (oldProduct.length > 0 && oldProduct[0].image_url) {
        try {
          const oldImageName = oldProduct[0].image_url.split('/').pop();
          const oldImagePath = path.join('uploads', 'products', oldImageName);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (e) {
          console.error("Lỗi khi xóa ảnh sản phẩm cũ:", e);
        }
      }
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`;
    }

    const productData = {
      name,
      description,
      price,
      original_price: original_price || null,
      category,
      image_url: imageUrl,
      colors: colors || '[]',
      stock,
      is_new: is_new === 'true' || is_new === true ? 1 : 0,
      discount_percent: discount_percent || null
    };

    await db.query(
      'UPDATE products SET ? WHERE id = ?',
      [productData, req.params.id]
    );

    res.json({ message: 'Sản phẩm đã được cập nhật thành công' });
  } catch (error) {
    console.error('Lỗi khi cập nhật sản phẩm:', error);
    res.status(500).json({ error: 'Không thể cập nhật sản phẩm' });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Sản phẩm đã được xóa thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm:', error);
    res.status(500).json({ error: 'Không thể xóa sản phẩm' });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT id, order_code, customer_name, customer_email, customer_phone, created_at, total_amount, payment_method, status FROM orders ORDER BY created_at DESC'
    );
    res.json(orders);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    res.status(500).json({ error: 'Không thể lấy danh sách đơn hàng' });
  }
});

router.put('/orders/:id/status', async (req, res) => {
  await db.beginTransaction();
  try {
    const { status: newStatus } = req.body;
    const { id: orderId } = req.params;

    if (!newStatus) {
      await db.rollback();
      return res.status(400).json({ error: 'Trạng thái mới là bắt buộc' });
    }

    const [[currentOrder]] = await db.query('SELECT status FROM orders WHERE id = ? FOR UPDATE', [orderId]);
    if (!currentOrder) {
      await db.rollback();
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng.' });
    }
    const oldStatus = currentOrder.status;

    const [orderItems] = await db.query('SELECT product_id, quantity FROM order_items WHERE order_id = ?', [orderId]);

    const adjustStock = async (items, operation) => {
      for (const item of items) {
        console.log(`[adjustStock] Xử lý item: Product ID = ${item.product_id}, Số lượng = ${item.quantity}, Hoạt động = ${operation}`);

        const productIdToQuery = parseInt(item.product_id, 10);
        if (isNaN(productIdToQuery)) {
          console.error(`[adjustStock] ID sản phẩm không hợp lệ: ${item.product_id}. Bỏ qua item.`);
          continue;
        }

        if (operation === 'reduce') {
          // Thực hiện truy vấn và lấy kết quả thô
          const [rows] = await db.query('SELECT stock FROM products WHERE id = ? FOR UPDATE', [productIdToQuery]);
          const product = rows && rows.length > 0 ? rows[0] : undefined; // Lấy hàng đầu tiên nếu có
          if (!product || product.stock < item.quantity) {
            console.error(`[adjustStock] Kiểm tra tồn kho thất bại cho Product ID ${productIdToQuery}. Tồn kho hiện tại: ${product ? product.stock : 0}, Yêu cầu: ${item.quantity}`);
            throw new Error(`Không đủ hàng tồn kho cho sản phẩm (ID: ${productIdToQuery}). Chỉ còn ${product ? product.stock : 0} sản phẩm.`);
          }
          await db.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, productIdToQuery]);
          console.log(`[adjustStock] Đã giảm tồn kho thành công cho Product ID ${productIdToQuery} với số lượng ${item.quantity}`);
        } else if (operation === 'return') {
          await db.query('UPDATE products SET stock = stock + ? WHERE id = ?', [item.quantity, productIdToQuery]);
          console.log(`[adjustStock] Đã hoàn trả tồn kho thành công cho Product ID ${productIdToQuery} với số lượng ${item.quantity}`);
        }
      }
    };

    const stockDeductedStatuses = ['Delivered', 'Completed'];

    const oldStatusDeductedStock = stockDeductedStatuses.includes(oldStatus);
    const newStatusDeductedStock = stockDeductedStatuses.includes(newStatus);

    if (oldStatusDeductedStock && !newStatusDeductedStock) {
      await adjustStock(orderItems, 'return');
    } else if (!oldStatusDeductedStock && newStatusDeductedStock) {
      await adjustStock(orderItems, 'reduce');
    }
    // Update the order status in the database
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [newStatus, orderId]);
    await db.commit(); // Commit transaction
    res.json({ message: 'Cập nhật trạng thái đơn hàng thành công' });
  } catch (error) {
    await db.rollback(); // Rollback transaction if any error occurs
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    if (error.message.includes('Không đủ hàng tồn kho')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Không thể cập nhật trạng thái' });
  }
});
router.get('/categories', async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories ORDER BY name');
    res.json(categories);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách danh mục:', error);
    res.status(500).json({ error: 'Không thể lấy danh sách danh mục' });
  }
});
router.get('/uploads/categories', async (req, res) => {
  try {
    const dir = path.join(process.cwd(), 'uploads', 'categories');
    if (!fs.existsSync(dir)) return res.json([]);
    const files = fs.readdirSync(dir).filter(f => !f.startsWith('.'));
    const list = files.map(filename => ({
      filename,
      url: `${req.protocol}://${req.get('host')}/uploads/categories/${encodeURIComponent(filename)}`
    }));
    res.json(list);
  } catch (error) {
    console.error('Lỗi khi đọc danh sách tải lên:', error);
    res.status(500).json({ error: 'Không thể liệt kê các file đã tải lên' });
  }
});
router.post('/categories', upload.single('image'), async (req, res) => {
  try {
    const { name, slug } = req.body;
    const imageUrl = req.file
      ? `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, "/")}`
      : (req.body.image_url || null);

    const [result] = await db.query(
      'INSERT INTO categories (name, slug, image_url) VALUES (?, ?, ?)',
      [name, slug, imageUrl]
    );

    res.json({ message: 'Danh mục đã được tạo thành công', categoryId: result.insertId });
  } catch (error) {
    console.error('Lỗi khi tạo danh mục:', error);
    res.status(500).json({ error: 'Không thể tạo danh mục' });
  }
});

router.put('/categories/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, slug } = req.body;
    const { id } = req.params;
    let imageUrl = req.body.image_url;

    if (req.file) {
      const [oldCategory] = await db.query('SELECT image_url FROM categories WHERE id = ?', [id]);
      if (oldCategory.length > 0 && oldCategory[0].image_url) {
        const oldImageName = oldCategory[0].image_url.split('/').pop();
        const oldImagePath = path.join('uploads', 'categories', oldImageName);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Xóa file ảnh cũ
        }
      }

      imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, "/")}`;
    }

    await db.query(
      'UPDATE categories SET name = ?, slug = ?, image_url = ? WHERE id = ?',
      [name, slug, imageUrl, id]
    );

    res.json({ message: 'Danh mục đã được cập nhật thành công' });
  } catch (error) {
    console.error('Lỗi khi cập nhật danh mục:', error);
    res.status(500).json({ error: 'Không thể cập nhật danh mục' });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    const [category] = await db.query('SELECT image_url FROM categories WHERE id = ?', [req.params.id]);
    if (category.length > 0 && category[0].image_url) {
      const imageName = category[0].image_url.split('/').pop();
      const imagePath = path.join('uploads', 'categories', imageName);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Xóa file ảnh
      }
    }

    await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ message: 'Danh mục đã được xóa thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa danh mục:', error);
    res.status(500).json({ error: 'Không thể xóa danh mục' });
  }
});

export default router;