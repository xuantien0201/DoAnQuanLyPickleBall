import express from 'express';
import { db } from '../../../config/db.js'; // Adjusted path
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Helper function to generate a new customer ID
async function generateNewCustomerId() {
    const [lastCustomer] = await db.query(
        // Sắp xếp ID khách hàng bằng cách chuyển phần số sang dạng số để tìm ID lớn nhất
        "SELECT id FROM tbl_khachhang ORDER BY CAST(SUBSTRING(id, 3) AS UNSIGNED) DESC LIMIT 1"
    );

    if (lastCustomer.length > 0) {
        const lastId = lastCustomer[0].id;
        // Lấy phần số từ ID cuối cùng (ví dụ: 'KH0022' -> 22)
        const lastNumber = parseInt(lastId.substring(2), 10);
        // Tạo ID mới bằng cách tăng số lên 1 và định dạng lại (ví dụ: 23 -> 'KH0023')
        return 'KH' + String(lastNumber + 1).padStart(4, '0');
    } else {
        // Nếu chưa có khách hàng nào, bắt đầu từ KH0001
        return 'KH0001';
    }
}

// Create a new order
router.post('/', async (req, res) => {
    try {
        await db.beginTransaction();

        const {
            fullName, email, phone, address, city, sex,
            customer, 
            notes, paymentMethod, items, total, status
        } = req.body;

        const orderCode = uuidv4().split('-')[0].toUpperCase();
        let orderData;
        let customerId; 
        let initialStatus; 
        let orderType; 

        if (customer && customer.id) { 
            customerId = customer.id;
            orderType = 'online'; 
            await db.query(
                `UPDATE tbl_khachhang SET TenKh = ?, SDT = ?, email = ?, DiaChi = ?, GioiTinh = ? WHERE id = ?`,
                [fullName, phone, email, address, sex, customerId]
            );
        } else {
            orderType = 'online';
            const [existingCustomers] = await db.query(
                "SELECT id FROM tbl_khachhang WHERE email = ? OR SDT = ?",
                [email, phone]
            );

            if (existingCustomers.length > 0) {
                customerId = existingCustomers[0].id;
                await db.query(
                    `UPDATE tbl_khachhang SET TenKh = ?, SDT = ?, email = ?, DiaChi = ?, GioiTinh = ? WHERE id = ?`,
                    [fullName, phone, email, address, sex, customerId]
                );
            } else {
                // Tạo khách hàng mới trong tbl_khachhang
                customerId = await generateNewCustomerId(); // Hàm này tạo ID dạng KHxxxx
                await db.query(
                    `INSERT INTO tbl_khachhang (id, TenKh, SDT, email, DiaChi, GioiTinh) VALUES (?, ?, ?, ?, ?, ?)`,
                    [customerId, fullName, phone, email, address, sex]
                );
            }
        }

        // Xác định trạng thái ban đầu
        initialStatus = 'cho_xac_nhan'; // Mặc định cho đơn hàng mới

        orderData = [
            orderCode, customerId, fullName, email, phone, address, city,
            notes, paymentMethod, total, initialStatus, orderType
        ];

        // Insert into orders table
        const [orderResult] = await db.query(
            `INSERT INTO orders (order_code, customer_id, customer_name, customer_email, customer_phone, shipping_address, shipping_city, notes, payment_method, total_amount, status, order_type)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            orderData
        );

        const orderId = orderResult.insertId;

        // Insert order items
        for (const item of items) {
            // Thêm kiểm tra để đảm bảo product_id không phải là NULL
            if (!item.product_id) {
                await db.rollback(); // Rollback giao dịch nếu có lỗi
                console.error('Lỗi: product_id bị thiếu cho sản phẩm:', item.name);
                return res.status(400).json({ error: `Thiếu ID sản phẩm cho '${item.name}'. Vui lòng kiểm tra lại giỏ hàng.` });
            }

            await db.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price, color, product_name)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [orderId, item.product_id, item.quantity, item.price, item.color, item.name]
            );
        }

        await db.commit();
        res.status(201).json({ success: true, message: 'Đặt hàng thành công!', orderCode: orderCode });

    } catch (error) {
        await db.rollback();
        console.error('Lỗi khi tạo đơn hàng:', error);
        res.status(500).json({ error: 'Không thể tạo đơn hàng.' });
    }
});

export default router;
