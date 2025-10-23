import express from 'express';
import { db } from '../../../config/db.js';

const router = express.Router();

router.put('/hangloat/status', async (req, res) => {
    const { orderIds, status: newStatus } = req.body;

    if (!Array.isArray(orderIds) || orderIds.length === 0)
        return res.status(400).json({ error: 'Danh sách đơn hàng không hợp lệ.' });

    if (!newStatus)
        return res.status(400).json({ error: 'Trạng thái mới là bắt buộc.' });

    // Sửa lỗi: Bắt đầu transaction trực tiếp trên đối tượng 'db'
    // vì nó là một kết nối đơn lẻ, không phải là một pool.
    await db.beginTransaction();

    try {
        const allowedTransitions = {
            cho_xac_nhan: ['da_xac_nhan', 'da_huy'],
            da_xac_nhan: ['dang_giao', 'huy_sau_xac_nhan'],
            dang_giao: ['da_nhan', 'giao_that_bai'],
            da_nhan: ['doi_hang', 'tra_hang'],
            doi_hang: ['da_nhan', 'tra_hang'],
            tra_hang: ['hoan_tien'],
            hoan_tien: [], 
            da_huy: [],
            huy_sau_xac_nhan: [],
            giao_that_bai: [],
        };


        // 1. Lấy tất cả các đơn hàng được chọn để kiểm tra
        // Sử dụng 'db.query' thay vì 'connection.query'
        const [allSelectedOrders] = await db.query(
            'SELECT id, status, order_code FROM orders WHERE id IN (?) FOR UPDATE',
            [orderIds]
        );

        // 2. Lọc ra những đơn hàng hợp lệ và không hợp lệ
        const validOrders = [];
        const invalidOrders = [];

        for (const order of allSelectedOrders) {
            const allowedNext = allowedTransitions[order.status] || [];
            if (allowedNext.includes(newStatus)) {
                validOrders.push(order);
            } else {
                invalidOrders.push({
                    order_code: order.order_code,
                    reason: `Không thể chuyển từ "${order.status}" sang "${newStatus}".`
                });
            }
        }

        // Nếu không có đơn hàng nào hợp lệ để cập nhật
        if (validOrders.length === 0) {
            await db.rollback(); // Không cần transaction nữa
            return res.status(400).json({
                error: 'Không có đơn hàng nào hợp lệ để cập nhật.',
                invalidOrders,
            });
        }

        const validOrderIds = validOrders.map(o => o.id);

        // 3. Tiếp tục xử lý logic kho hàng CHỈ với các đơn hàng hợp lệ
        const [orderItems] = await db.query(
            `SELECT oi.order_id, oi.product_id, oi.quantity, p.name
             FROM order_items oi
             JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id IN (?)`,
            [validOrderIds]
        );

        const productIds = [...new Set(orderItems.map(item => item.product_id))];
        const [products] = productIds.length > 0 ? await db.query(
            'SELECT id, name, stock FROM products WHERE id IN (?) FOR UPDATE',
            [productIds]
        ) : [[]];

        const productMap = new Map(products.map(p => [p.id, p]));
        const stockUpdates = new Map();

        for (const order of validOrders) {
            const oldStatus = order.status;
            const itemsForThisOrder = orderItems.filter(item => item.order_id === order.id);

            const stockDeductedStatuses = ['da_xac_nhan', 'dang_giao', 'da_nhan'];
            const oldDeducted = stockDeductedStatuses.includes(oldStatus);
            const newDeducted = stockDeductedStatuses.includes(newStatus);

            if (oldDeducted === newDeducted) continue;

            for (const item of itemsForThisOrder) {
                const currentStock = productMap.get(item.product_id)?.stock || 0;
                const stockChange = stockUpdates.get(item.product_id) || 0;

                if (!oldDeducted && newDeducted) { // Trừ kho
                    if (currentStock + stockChange < item.quantity) {
                        throw new Error(`Không đủ hàng tồn kho cho "${item.name}". Chỉ còn ${currentStock}.`);
                    }
                    stockUpdates.set(item.product_id, stockChange - item.quantity);
                } else { // Hoàn kho
                    stockUpdates.set(item.product_id, stockChange + item.quantity);
                }
            }
        }

        // 4. Thực hiện cập nhật hàng loạt vào DB
        for (const [productId, change] of stockUpdates.entries()) {
            if (change === 0) continue;
            await db.query(
                'UPDATE products SET stock = stock + ? WHERE id = ?',
                [change, productId]
            );
        }

        await db.query(
            'UPDATE orders SET status = ? WHERE id IN (?)',
            [newStatus, validOrderIds]
        );

        await db.commit();
        res.json({
            message: `✅ Cập nhật ${validOrders.length} đơn hàng thành công.`,
            skippedCount: invalidOrders.length,
            invalidOrders, // Gửi kèm danh sách đơn bị bỏ qua để frontend hiển thị
        });

    } catch (error) {
        await db.rollback();
        console.error('Lỗi khi cập nhật hangloat status:', error);
        res.status(400).json({ error: error.message });
    }
    // Không cần 'finally' và 'connection.release()' nữa
});

export default router;
