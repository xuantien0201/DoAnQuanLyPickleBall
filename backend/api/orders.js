import express from 'express';
import { db } from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Create a new order
router.post('/', async (req, res) => {
  try {
    await db.beginTransaction();

    const {
      // Fields for regular checkout
      fullName, email, phone, address, city,
      // Fields for POS
      customer, 
      notes, paymentMethod, items, total, status
    } = req.body;

   

    const orderCode = uuidv4().split('-')[0].toUpperCase();
    let orderData;
    let customerPhone = phone;
    let initialStatus; // Để lưu trạng thái ban đầu được xác định

    // Phân biệt giữa đơn hàng POS và đơn hàng checkout thông thường
    if (customer && customer.name && customer.phone) {
      // Đây là đơn hàng POS
      if (!paymentMethod || !items || items.length === 0) {
        await db.rollback(); // Rollback trước khi trả về
        return res.status(400).json({ error: 'Dữ liệu đơn hàng POS không hợp lệ.' });
      }
      customerPhone = customer.phone;
      initialStatus = status || 'Delivered'; // Đơn hàng POS được hoàn thành ngay lập tức
      orderData = [
        orderCode,
        customer.name,
        null, // email
        customer.phone,
        null, // address
        null, // city
        notes,
        paymentMethod,
        total,
        initialStatus
      ];
    } else {
      // Đây là đơn hàng checkout thông thường
      if (!fullName || !email || !phone || !address || !city || !paymentMethod || !items || items.length === 0) {
        await db.rollback(); 
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin bắt buộc.' });
      }
      initialStatus = status || 'Pending'; // Đơn hàng thông thường ở trạng thái chờ xử lý
      orderData = [
        orderCode,
        fullName,
        email,
        phone,
        address,
        city,
        notes,
        paymentMethod,
        total,
        initialStatus
      ];
    }

    // Insert into orders table
    const [orderResult] = await db.query(
      `INSERT INTO orders (order_code, customer_name, customer_email, customer_phone, shipping_address, shipping_city, notes, payment_method, total_amount, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      orderData
    );

    const orderId = orderResult.insertId;

    // Insert into order_items table and potentially reduce stock
    const itemPromises = items.map(async (item) => {
      let productId;

      if (customer && customer.name && customer.phone) {
        productId = item.id; // Đây là đơn hàng POS, item.id chính là product_id
      } else {
        productId = item.product_id;
      }

      if (!productId) { // <--- Đây là dòng 84, nơi lỗi xảy ra
        throw new Error(`Thiếu product_id cho sản phẩm ${item.name || 'không tên'}.`);
      }

      if (initialStatus === 'Delivered') {
        const [[productStock]] = await db.query('SELECT stock FROM products WHERE id = ? FOR UPDATE', [productId]);
        if (!productStock || productStock.stock < item.quantity) {
          throw new Error(`Không đủ hàng tồn kho cho sản phẩm ${item.name}. Chỉ còn ${productStock ? productStock.stock : 0} sản phẩm.`);
        }
        await db.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, productId]);
      }

      return db.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, price, color)
                 VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, productId, item.name, item.quantity, item.price, item.color || null]
      );
    });

    await Promise.all(itemPromises);

    await db.commit();

    res.status(201).json({ message: 'Tạo đơn hàng thành công', orderCode: orderCode });

  } catch (error) {
    await db.rollback();
    console.error('Lỗi khi tạo đơn hàng:', error);
    if (error.message.includes('Không đủ hàng tồn kho') || error.message.includes('Thiếu product_id')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Không thể tạo đơn hàng' });
  }
});

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
    console.error('Lỗi khi lấy đơn hàng:', error);
    res.status(500).json({ error: 'Không thể lấy thông tin đơn hàng' });
  }
});

export default router;
