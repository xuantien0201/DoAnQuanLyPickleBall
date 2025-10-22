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
            // Fields for regular checkout
            fullName, email, phone, address, city, sex,
            // Fields for POS
            customer,
            notes, paymentMethod, items, total, status
        } = req.body;

        const orderCode = uuidv4().split('-')[0].toUpperCase();
        let orderData;
        let customerId; // ID từ bảng tbl_khachhang
        let initialStatus; // Để lưu trạng thái ban đầu được xác định
        let orderType; // Thêm biến để lưu kiểu bán hàng

        // Phân biệt giữa đơn hàng POS và đơn hàng checkout thông thường
        if (customer && customer.name && customer.phone) {
            // Đây là đơn hàng POS
            if (!paymentMethod || !items || items.length === 0) {
                await db.rollback();
                return res.status(400).json({ error: 'Dữ liệu đơn hàng POS không hợp lệ.' });
            }

            // Tìm hoặc tạo khách hàng mới dựa trên SĐT
            const [existingCustomers] = await db.query('SELECT id FROM tbl_khachhang WHERE SDT = ?', [customer.phone]);
            if (existingCustomers.length > 0) {
                customerId = existingCustomers[0].id;
            } else {
                const newCustomerId = await generateNewCustomerId();
                await db.query(
                    'INSERT INTO tbl_khachhang (id, TenKh, SDT, GioiTinh) VALUES (?, ?, ?, ?)', // <-- Thêm GioiTinh
                    [newCustomerId, customer.name, customer.phone, customer.sex || null] // <-- Thêm customer.sex
                );
                customerId = newCustomerId;
            }

            initialStatus = status || 'da_nhan'; // Đơn hàng POS được hoàn thành ngay lập tức
            orderType = 'pos'; // Đặt kiểu bán là 'pos'
            orderData = [
                orderCode,
                customerId,
                customer.name,
                null, // email
                customer.phone,
                null, // address
                null, // city
                notes,
                paymentMethod,
                total,
                initialStatus,
                orderType // Thêm orderType vào đây
            ];
        } else {
            // Đây là đơn hàng checkout thông thường
            if (!fullName || !phone || !address || !city || !paymentMethod || !items || items.length === 0) { // <-- Đã xóa !email
                await db.rollback();
                return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin bắt buộc.' });
            }

            // Tìm hoặc tạo khách hàng mới dựa trên SĐT
            const [existingCustomers] = await db.query('SELECT id FROM tbl_khachhang WHERE SDT = ?', [phone]);
            if (existingCustomers.length > 0) {
                customerId = existingCustomers[0].id;
            } else {
                const newCustomerId = await generateNewCustomerId();
                const fullAddress = `${address}, ${city}`;
                await db.query(
                    'INSERT INTO tbl_khachhang (id, TenKh, SDT, DiaChi, email, GioiTinh) VALUES (?, ?, ?, ?, ?, ?)', // <-- Thêm GioiTinh
                    [newCustomerId, fullName, phone, fullAddress, email, sex || null] // <-- Thêm sex
                );
                customerId = newCustomerId;
            }

            initialStatus = status || 'cho_xac_nhan'; // Đơn hàng thông thường ở trạng thái chờ xử lý
            orderType = 'online'; // Đặt kiểu bán là 'online'
            orderData = [
                orderCode,
                customerId,
                fullName,
                email,
                phone,
                address,
                city,
                notes,
                paymentMethod,
                total,
                initialStatus,
                orderType // Thêm orderType vào đây
            ];
        }

        // Insert into orders table
        // Cập nhật câu lệnh INSERT để bao gồm cột order_type
        const [orderResult] = await db.query(
            `INSERT INTO orders (order_code, customer_id, customer_name, customer_email, customer_phone, shipping_address, shipping_city, notes, payment_method, total_amount, status, order_type)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

            if (!productId) {
                throw new Error(`Thiếu product_id cho sản phẩm ${item.name || 'không tên'}.`);
            }

            if (initialStatus === 'da_nhan') {
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
        if (error.message.includes('Không đủ hàng tồn kho') || error.message.includes('Thiếu product_id') || error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Không thể tạo đơn hàng' });
    }
});

export default router;
