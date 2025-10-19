import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/AdminOrders.css';
import { Sidebar } from '../../components/Sidebar';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/admin/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Lỗi khi tải đơn hàng:', error);
    }
  };

  const viewOrderDetails = async (orderCode) => {
    try {
      // API này đã được tạo ở các bước trước
      const response = await axios.get(`/api/orders/${orderCode}`);
      setSelectedOrder(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Lỗi khi tải chi tiết đơn hàng:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
      alert('Cập nhật trạng thái thành công!');
      fetchOrders(); // Tải lại danh sách đơn hàng
      // Cập nhật trạng thái trong modal nếu đang mở
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      alert('Cập nhật trạng thái thất bại.');
    }
  };

  const getStatusInfo = (status) => {
    const statuses = {
      Pending: { color: 'warning', text: 'Chờ xử lý' },
      Processing: { color: 'info', text: 'Đang xử lý' },
      Shipped: { color: 'primary', text: 'Đã gửi' },
      Delivered: { color: 'success', text: 'Hoàn thành' },
      Cancelled: { color: 'danger', text: 'Đã hủy' }
    };
    return statuses[status] || { color: 'secondary', text: status };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const renderPaymentMethod = (method) => {
    switch (method) {
      case 'cod':
        return '💰 Thanh toán khi nhận hàng';
      case 'qr':
        return '📱 Chuyển khoản QR';
      case 'Tiền mặt':
        return '💰 Tiền mặt';
      case 'Chuyển khoản':
        return '📱 Chuyển khoản';
      default:
        return method; 
    }
  };

  return (
    <div className="admin-orders-page">
      <Sidebar />
      <div className="admin-content">
        <div className="admin-orders-header">
          <h2>Quản lý Đơn hàng</h2>
        </div>

        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Mã ĐH</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Thanh toán</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td><strong>{order.order_code}</strong></td>
                  <td>
                    <div className="customer-info">
                      <div>{order.customer_name}</div>
                      <div className="email">{order.customer_email}</div>
                    </div>
                  </td>
                  <td>{formatDate(order.created_at)}</td>
                  <td><strong>{order.total_amount.toLocaleString('vi-VN')}₫</strong></td>
                  <td>
                    <span className="payment-method">
                      {renderPaymentMethod(order.payment_method)}
                    </span>
                  </td>
                  <td>
                    <select
                      className={`status-select status-${getStatusInfo(order.status).color}`}
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    >
                      <option value="Pending">Chờ xử lý</option>
                      <option value="Processing">Đang xử lý</option>
                      <option value="Shipped">Đã gửi</option>
                      <option value="Delivered">Hoàn thành</option>
                      <option value="Cancelled">Đã hủy</option>
                    </select>
                  </td>
                  <td>
                    <button className="btn-view" onClick={() => viewOrderDetails(order.order_code)}>
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <div className="no-orders"><p>Không có đơn hàng nào.</p></div>}
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
                  <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                  <p><strong>SĐT:</strong> {selectedOrder.customer_phone}</p>
                </div>
                <div className="detail-section">
                  <h4>Địa chỉ giao hàng</h4>
                  <p>{selectedOrder.shipping_address}, {selectedOrder.shipping_city}</p>
                </div>
                <div className="detail-section">
                  <h4>Sản phẩm</h4>
                  <table className="items-table">
                    <thead>
                      <tr><th>Sản phẩm</th><th>Số lượng</th><th>Giá</th><th>Tổng</th></tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items && selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td>{item.product_name}</td>
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
    </div>
  );
};

export default AdminOrders;
