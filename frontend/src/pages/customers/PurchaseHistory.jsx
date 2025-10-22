import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../css/AdminOrders.css'; // Tái sử dụng CSS của trang Admin
import '../../css/PurchaseHistory.css'; // CSS riêng nếu cần ghi đè

const PurchaseHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Gọi API mới để lấy lịch sử đơn hàng của người dùng
                const response = await axios.get('/api/client/orders/history');
                setOrders(response.data);
            } catch (error) {
                console.error('Lỗi khi tải lịch sử mua hàng:', error);
                // Xử lý trường hợp chưa đăng nhập hoặc lỗi khác
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const viewOrderDetails = async (orderCode) => {
        try {
            const response = await axios.get(`/api/client/orders/${orderCode}`);
            setSelectedOrder(response.data);
            setShowModal(true);
        } catch (error) {
            console.error('Lỗi khi tải chi tiết đơn hàng:', error);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    const getStatusInfo = (status) => {
        const statuses = {
            cho_xac_nhan: { color: 'warning', text: 'Chờ xác nhận' },
            dang_xu_ly: { color: 'info', text: 'Đang xử lý' },
            dang_giao: { color: 'primary', text: 'Đang giao hàng' },
            da_nhan: { color: 'success', text: 'Đã nhận hàng' },
            da_huy: { color: 'danger', text: 'Đã hủy' },
            giao_that_bai: { color: 'danger', text: 'Giao thất bại' },
        };
        return statuses[status] || { color: 'secondary', text: status };
    };

    const formatDate = (d) => new Date(d).toLocaleString('vi-VN');

    if (loading) {
        return <div className="loading">Đang tải lịch sử mua hàng...</div>;
    }

    return (
        <div className="purchase-history-page">
            <div className="container">
                <h1 className="page-title">Lịch sử mua hàng</h1>

                {orders.length === 0 ? (
                    <div className="no-orders-message">
                        <p>Bạn chưa có đơn hàng nào.</p>
                        <Link to="/shop" className="btn btn-primary">Bắt đầu mua sắm</Link>
                    </div>
                ) : (
                    <div className="orders-table-container">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Mã HĐ</th>
                                    <th>Ngày đặt</th>
                                    <th>Tổng tiền</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td><strong>{order.order_code}</strong></td>
                                        <td>{formatDate(order.created_at)}</td>
                                        <td><strong>{order.total_amount.toLocaleString('vi-VN')}₫</strong></td>
                                        <td>
                                            <span className={`status-badge status-${getStatusInfo(order.status).color}`}>
                                                {getStatusInfo(order.status).text}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn-view"
                                                onClick={() => viewOrderDetails(order.order_code)}
                                            >
                                                Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && selectedOrder && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content order-details-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Chi tiết Đơn hàng - {selectedOrder.order_code}</h3>
                            <button className="modal-close" onClick={closeModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-section">
                                <h4>Thông tin khách hàng</h4>
                                <p><strong>Tên:</strong> {selectedOrder.customer_name}</p>
                                <p><strong>Giới tính:</strong> {selectedOrder.customer_gender || 'Chưa cập nhật'}</p>
                                <p><strong>Email:</strong> {selectedOrder.customer_email || 'Không có'}</p>
                                <p><strong>SĐT:</strong> {selectedOrder.customer_phone}</p>
                            </div>
                            <div className="detail-section">
                                <h4>Địa chỉ giao hàng</h4>
                                <p>{selectedOrder.shipping_address}, {selectedOrder.shipping_city}</p>
                            </div>
                            {selectedOrder.notes && (
                                <div className="detail-section">
                                    <h4>Ghi chú đơn hàng</h4>
                                    <p className="order-notes">{selectedOrder.notes}</p>
                                </div>
                            )}
                            <div className="detail-section">
                                <h4>Sản phẩm</h4>
                                <table className="items-table">
                                    <thead>
                                        <tr><th>Sản phẩm</th><th>Số lượng</th><th>Giá</th><th>Tổng</th></tr>
                                    </thead>
                                    <tbody>
                                        {selectedOrder.items && selectedOrder.items.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.name}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.price.toLocaleString('vi-VN')}₫</td>
                                                <td>{(item.price * item.quantity).toLocaleString('vi-VN')}₫</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="detail-section summary-section">
                                <h4>Tổng cộng: <span>{selectedOrder.total_amount.toLocaleString('vi-VN')}₫</span></h4>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PurchaseHistory;