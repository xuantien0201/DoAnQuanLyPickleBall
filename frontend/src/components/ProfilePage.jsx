import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PurchaseHistory from '../pages/customers/PurchaseHistory'; // Import PurchaseHistory
import './ProfilePage.css';

const ProfilePage = () => {
  const [customerInfo, setCustomerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      const userString = localStorage.getItem('user');
      let customerId = null;

      try {
        if (userString) {
          const user = JSON.parse(userString);
          customerId = user.id; // Lấy id từ tbl_taikhoankhachhang

          // Nếu user.role tồn tại, không phải khách hàng
          if (user.role && user.role !== null) {
            setError("Bạn đã đăng nhập, nhưng không phải là Khách hàng.");
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        setError("Lỗi dữ liệu đăng nhập. Vui lòng đăng nhập lại.");
        setLoading(false);
        return;
      }

      if (!customerId) {
        setError("Bạn chưa đăng nhập.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/api/taikhoan/customer/profile?id=${customerId}`);
        if (response.data.success) {
          setCustomerInfo(response.data.customer);
        } else {
          setError(response.data.message || "Lỗi khi tải thông tin khách hàng");
        }
      } catch (err) {
        setError("Lỗi khi kết nối server");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="profile-container">Đang tải thông tin...</div>;
  if (error) return <div className="profile-container error-message">{error}</div>;

  const customer = customerInfo || {};

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2 className="profile-title">Thông tin Cá nhân Khách hàng</h2>
        <div className="profile-details-grid">
          <div className="profile-item">
            <span className="profile-label">Mã khách hàng:</span>
            <span className="profile-value">{customer.id || "N/A"}</span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Họ và tên:</span>
            <span className="profile-value">{customer.TenKh || "N/A"}</span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Số điện thoại:</span>
            <span className="profile-value">{customer.SDT || "N/A"}</span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Email:</span>
            <span className="profile-value">{customer.email || "N/A"}</span>
          </div>
          <div className="profile-item full-width">
            <span className="profile-label">Địa chỉ:</span>
            <span className="profile-value">{customer.DiaChi || "N/A"}</span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Giới tính:</span>
            <span className="profile-value">{customer.GioiTinh || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Thêm phần lịch sử mua hàng */}
      <div className="purchase-history-section">
        <PurchaseHistory />
      </div>
    </div>
  );
};

export default ProfilePage;
