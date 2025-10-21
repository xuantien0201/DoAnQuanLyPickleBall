import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/AdminOrders.css';
import { Sidebar } from '../../components/Sidebar';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // State cho tìm kiếm và phân trang
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => { fetchOrders(); }, [currentPage, searchTerm]);

  const fetchOrders = async () => {
    try {
      const params = {
        page: currentPage,
        limit: ordersPerPage,
        search: searchTerm,
      };
      const response = await axios.get('/api/admin/orders', { params });
      setOrders(response.data.orders);
      setTotalOrders(response.data.totalCount);
    } catch (error) {
      console.error('Lỗi khi tải đơn hàng:', error);
    }
  };

  const viewOrderDetails = async (orderCode) => {
    try {
      // API này đã được tạo ở các bước trước
      const response = await axios.get(`/api/customers/orders/${orderCode}`);
      setSelectedOrder(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Lỗi khi tải chi tiết đơn hàng:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
      const data = response.data;

      // ✅ Hiển thị thông báo thành công
      alert(data.message || 'Cập nhật trạng thái đơn hàng thành công!');

      // ✅ Hiển thị các thông báo tồn kho chi tiết nếu có
      if (data.stockMessages && data.stockMessages.length > 0) {
        const fullMessage = data.stockMessages.join('\n');
        alert('Thông tin kho:\n' + fullMessage);
      }

      // ✅ Làm mới danh sách đơn hàng
      fetchOrders();

      // ✅ Cập nhật trong modal nếu đang mở
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }

    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      alert(error.response?.data?.error || 'Cập nhật trạng thái thất bại.');
    }
  };

  const getStatusInfo = (status) => {
    const statuses = {
      cho_xac_nhan: { color: 'warning', text: 'Chờ xác nhận' },
      dang_xu_ly: { color: 'info', text: 'Đang xử lý' },
      dang_giao: { color: 'primary', text: 'Đang giao hàng' },
      da_giao: { color: 'success', text: 'Đã giao hàng' },
      da_huy: { color: 'danger', text: 'Đã hủy' },
      giao_that_bai: { color: 'danger', text: 'Giao thất bại' },
    };
    return statuses[status] || { color: 'secondary', text: status };
  };


  const formatDate = (d) => new Date(d).toLocaleString('vi-VN');


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
  const getNextStatusOptions = (current) => {
    switch (current) {
      case 'cho_xac_nhan':
        return ['dang_xu_ly', 'da_huy'];
      case 'dang_xu_ly':
        return ['dang_giao', 'da_huy'];
      case 'dang_giao':
        return ['da_giao', 'giao_that_bai'];
      default:
        return [];
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(totalOrders / ordersPerPage);

  return (
    <div className="admin-orders-page">
      <Sidebar />
      <div className="admin-content">
        <div className="admin-orders-header">
          <h2>Quản lý Đơn hàng</h2>
        </div>

        <input
          type="text"
          placeholder="Tìm kiếm theo mã ĐH, tên, SĐT khách hàng..."
          className="admin-search-bar"
          value={searchTerm}
          onChange={handleSearchChange}
        />

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
                      <div className="phone">{order.customer_phone}</div>
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
                      <option value={order.status}>{getStatusInfo(order.status).text}</option>
                      {getNextStatusOptions(order.status).map((next) => (
                        <option key={next} value={next}>
                          {getStatusInfo(next).text}
                        </option>
                      ))}
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

        {totalPages > 1 && (
          <div className="pagination">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}

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
