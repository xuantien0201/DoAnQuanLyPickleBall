import express from 'express';
import { db } from '../config/db.js';

const router = express.Router();

// Get cart items for a session
router.get('/:sessionId', async (req, res) => {
  try {
    const [cartItems] = await db.query(
      `SELECT c.*, p.name, p.price, p.image_url, p.stock, p.colors as product_colors
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.session_id = ?`,
      [req.params.sessionId]
    );
    res.json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});

// Add item to cart
router.post('/', async (req, res) => {
  await db.beginTransaction(); // Bắt đầu giao dịch
  try {
    const { sessionId, productId, quantity, color } = req.body;

    // Lấy thông tin sản phẩm và khóa hàng để tránh race condition
    const [[product]] = await db.query('SELECT stock FROM products WHERE id = ? FOR UPDATE', [productId]);

    if (!product) {
      await db.rollback();
      return res.status(404).json({ error: 'Sản phẩm không tồn tại.' });
    }

    if (product.stock < quantity) {
      await db.rollback();
      return res.status(400).json({ error: `Không đủ hàng tồn kho cho sản phẩm này. Chỉ còn ${product.stock} sản phẩm.` });
    }

    // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
    const [existing] = await db.query(
      'SELECT id, quantity FROM cart_items WHERE session_id = ? AND product_id = ? AND color = ? FOR UPDATE',
      [sessionId, productId, color]
    );

    if (existing.length > 0) {
      const newQuantity = existing[0].quantity + quantity;
      if (product.stock < newQuantity) {
        await db.rollback();
        return res.status(400).json({ error: `Không thể thêm. Tổng số lượng vượt quá tồn kho (${product.stock}).` });
      }
      // Cập nhật số lượng
      await db.query(
        'UPDATE cart_items SET quantity = ? WHERE id = ?',
        [newQuantity, existing[0].id]
      );
    } else {
      // Thêm sản phẩm mới
      await db.query(
        'INSERT INTO cart_items (session_id, product_id, quantity, color) VALUES (?, ?, ?, ?)',
        [sessionId, productId, quantity, color]
      );
    }

    await db.commit(); // Hoàn tất giao dịch
    res.json({ message: 'Item added to cart' });
  } catch (error) {
    await db.rollback(); // Hoàn tác nếu có lỗi
    console.error(error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Update cart item quantity
router.put('/:id', async (req, res) => {
  await db.beginTransaction(); // Bắt đầu giao dịch
  try {
    const { quantity: newQuantity } = req.body;
    const cartItemId = req.params.id;

    // Lấy thông tin sản phẩm và khóa hàng để tránh race condition
    const [[cartItem]] = await db.query(
      'SELECT ci.product_id, p.stock FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.id = ? FOR UPDATE',
      [cartItemId]
    );

    if (!cartItem) {
      await db.rollback();
      return res.status(404).json({ error: 'Sản phẩm trong giỏ hàng không tồn tại.' });
    }

    if (newQuantity <= 0) {
      await db.query('DELETE FROM cart_items WHERE id = ?', [cartItemId]);
    } else {
      if (cartItem.stock < newQuantity) {
        await db.rollback();
        return res.status(400).json({ error: `Không đủ hàng tồn kho. Chỉ còn ${cartItem.stock} sản phẩm.` });
      }
      await db.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQuantity, cartItemId]);
    }

    await db.commit(); // Hoàn tất giao dịch
    res.json({ message: 'Cart updated' });
  } catch (error) {
    await db.rollback(); // Hoàn tác nếu có lỗi
    console.error(error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Remove item from cart
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM cart_items WHERE id = ?', [req.params.id]);
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

// Clear cart
router.delete('/session/:sessionId', async (req, res) => {
  try {
    await db.query('DELETE FROM cart_items WHERE session_id = ?', [req.params.sessionId]);
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

export default router;
