import express from 'express';
import { db } from "../config/db.js";

import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// --- Cấu hình Multer cho tải lên ảnh ---

// Đảm bảo thư mục 'uploads' tồn tại
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Cấu hình lưu trữ cho ảnh sản phẩm
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

// Cấu hình lưu trữ cho ảnh danh mục
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
const upload = multer({ storage: categoryStorage }); // 'upload' được dùng cho categories

// Get all products (admin)
router.get('/products', async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(products);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách sản phẩm' });
  }
});

// Create product
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

    res.json({ message: 'Tạo sản phẩm thành công', productId: result.insertId });
  } catch (error) {
    console.error("Lỗi khi tạo sản phẩm:", error);
    res.status(500).json({ error: 'Lỗi khi tạo sản phẩm' });
  }
});

// Update product
router.put('/products/:id', productUpload.single('image'), async (req, res) => {
  try {
    const { name, description, price, original_price, category, colors, stock, is_new, discount_percent } = req.body;
    let imageUrl = req.body.image_url; // Mặc định là URL cũ

    // Nếu có file mới được tải lên
    if (req.file) {
      // Xóa file ảnh cũ nếu có
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
      // Cập nhật URL ảnh mới
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

    res.json({ message: 'Cập nhật sản phẩm thành công' });
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    res.status(500).json({ error: 'Lỗi khi cập nhật sản phẩm' });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    res.status(500).json({ error: 'Lỗi khi xóa sản phẩm' });
  }
});

// Get all orders
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

// Update order status
router.put('/orders/:id/status', async (req, res) => {
  await db.beginTransaction(); // Bắt đầu transaction
  try {
    const { status: newStatus } = req.body;
    const { id: orderId } = req.params;

    if (!newStatus) {
      await db.rollback();
      return res.status(400).json({ error: 'Trạng thái mới là bắt buộc' });
    }

    // Lấy trạng thái hiện tại của đơn hàng
    const [[currentOrder]] = await db.query('SELECT status FROM orders WHERE id = ? FOR UPDATE', [orderId]);
    if (!currentOrder) {
      await db.rollback();
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng.' });
    }
    const oldStatus = currentOrder.status;

    // Lấy các sản phẩm trong đơn hàng
    const [orderItems] = await db.query('SELECT product_id, quantity FROM order_items WHERE order_id = ?', [orderId]);

    // Hàm trợ giúp để điều chỉnh tồn kho
    const adjustStock = async (items, operation) => { // operation: 'reduce' hoặc 'return'
      for (const item of items) {
        console.log(`[Điều chỉnh kho] Xử lý: ID Sản phẩm = ${item.product_id}, Số lượng = ${item.quantity}, Hoạt động = ${operation}`);

        const productIdToQuery = parseInt(item.product_id, 10);
        if (isNaN(productIdToQuery)) {
          console.error(`[Điều chỉnh kho] ID sản phẩm không hợp lệ: ${item.product_id}. Bỏ qua mục này.`);
          continue; // Bỏ qua nếu ID không hợp lệ
        }

        if (operation === 'reduce') {
          console.log(`[Điều chỉnh kho] Thử giảm tồn kho cho ID sản phẩm: ${productIdToQuery}`);
          const [[product]] = await db.query('SELECT stock FROM products WHERE id = ? FOR UPDATE', [productIdToQuery]);
          
          console.log(`[Điều chỉnh kho] ID sản phẩm ${productIdToQuery}: Tồn kho hiện tại = ${product ? product.stock : 'Không tìm thấy'}`);

          if (!product || product.stock < item.quantity) {
            console.error(`[Điều chỉnh kho] Kiểm tra tồn kho thất bại cho ID ${productIdToQuery}. Tồn kho: ${product ? product.stock : 0}, Yêu cầu: ${item.quantity}`);
            throw new Error(`Không đủ hàng tồn kho cho sản phẩm (ID: ${productIdToQuery}). Chỉ còn ${product ? product.stock : 0} sản phẩm.`);
          }
          await db.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, productIdToQuery]);
          console.log(`[Điều chỉnh kho] Đã giảm thành công tồn kho cho ID ${productIdToQuery} đi ${item.quantity} sản phẩm.`);
        } else if (operation === 'return') {
          await db.query('UPDATE products SET stock = stock + ? WHERE id = ?', [item.quantity, productIdToQuery]);
          console.log(`[Điều chỉnh kho] Đã hoàn trả thành công tồn kho cho ID ${productIdToQuery} thêm ${item.quantity} sản phẩm.`);
        }
      }
    };

    // Xác định các trạng thái đã trừ kho
    const stockDeductedStatuses = ['Delivered', 'Completed'];
    const oldStatusDeductedStock = stockDeductedStatuses.includes(oldStatus);
    const newStatusDeductedStock = stockDeductedStatuses.includes(newStatus);

    if (oldStatusDeductedStock && !newStatusDeductedStock) {
      // Hoàn trả lại hàng vào kho
      await adjustStock(orderItems, 'hoàn trả vào kho');
    } else if (!oldStatusDeductedStock && newStatusDeductedStock) {
      // Trừ hàng khỏi kho
      await adjustStock(orderItems, 'Trừ khỏi kho');
    }

    // Cập nhật trạng thái đơn hàng
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [newStatus, orderId]);

    await db.commit(); // Hoàn tất transaction
    res.json({ message: 'Cập nhật trạng thái đơn hàng thành công' });
  } catch (error) {
    await db.rollback(); // Hoàn tác transaction nếu có lỗi
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    if (error.message.includes('Không đủ hàng tồn kho')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Không thể cập nhật trạng thái' });
  }
});

// Get all categories (admin)
router.get('/categories', async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories ORDER BY name');
    res.json(categories);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh mục:", error);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách danh mục' });
  }
});

// Route để liệt kê các file đã upload (cho mục đích chọn ảnh)
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
    console.error('Lỗi khi đọc thư mục uploads:', error);
    res.status(500).json({ error: 'Lỗi khi liệt kê các tệp đã tải lên' });
  }
});

// Create category
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

    res.json({ message: 'Tạo danh mục thành công', categoryId: result.insertId });
  } catch (error) {
    console.error("Lỗi khi tạo danh mục:", error);
    res.status(500).json({ error: 'Lỗi khi tạo danh mục' });
  }
});

// Update category
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
          fs.unlinkSync(oldImagePath);
        }
      }
      imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, "/")}`;
    }

    await db.query(
      'UPDATE categories SET name = ?, slug = ?, image_url = ? WHERE id = ?',
      [name, slug, imageUrl, id]
    );

    res.json({ message: 'Cập nhật danh mục thành công' });
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error);
    res.status(500).json({ error: 'Lỗi khi cập nhật danh mục' });
  }
});

// Delete category
router.delete('/categories/:id', async (req, res) => {
  try {
    const [category] = await db.query('SELECT image_url FROM categories WHERE id = ?', [req.params.id]);
    if (category.length > 0 && category[0].image_url) {
      const imageName = category[0].image_url.split('/').pop();
      const imagePath = path.join('uploads', 'categories', imageName);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ message: 'Xóa danh mục thành công' });
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error);
    res.status(500).json({ error: 'Lỗi khi xóa danh mục' });
  }
});

export default router;