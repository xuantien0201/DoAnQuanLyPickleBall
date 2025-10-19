import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import '../../css/Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('cod'); // cod: cash on delivery, qr: qr code
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: ''
  });

  const total = getCartTotal();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const orderData = {
        ...formData,
        paymentMethod,
        items: cartItems.map(item => ({
          product_id: item.product_id, // Đã sửa: Sử dụng item.product_id thay vì item.id
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          color: item.color
        })),
        total
      };

      const response = await axios.post('/api/orders', orderData);

      if (response.data.orderCode) {
        await clearCart();
        navigate(`/order-complete/${response.data.orderCode}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Không thể tạo đơn hàng. Vui lòng thử lại.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="container">
          <h2>Giỏ hàng của bạn đang trống</h2>
          <p>Hãy thêm sản phẩm vào giỏ trước khi thanh toán!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Thanh toán</h1>

        <div className="checkout-steps">
          <div className="step completed">
            <span className="step-number">✓</span>
            <span className="step-label">Giỏ hàng</span>
          </div>
          <div className="step active">
            <span className="step-number">2</span>
            <span className="step-label">Chi tiết thanh toán</span>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <span className="step-label">Hoàn tất</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="checkout-layout">
          <div className="checkout-form">
            <div className="form-section">
              <h2>Thông tin liên hệ</h2>
              <div className="form-group">
                <label>HỌ VÀ TÊN *</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Nhập họ và tên"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>EMAIL *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Nhập email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>SỐ ĐIỆN THOẠI *</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Nhập số điện thoại"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Địa chỉ giao hàng</h2>
              <div className="form-group">
                <label>ĐỊA CHỈ *</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Số nhà, tên đường, phường/xã..."
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>TỈNH / THÀNH PHỐ *</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Tỉnh / Thành phố"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>GHI CHÚ (TÙY CHỌN)</label>
                <textarea
                  name="notes"
                  placeholder="Ghi chú về đơn hàng, ví dụ: thời gian giao hàng..."
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
              </div>
            </div>

            <button type="submit" className="btn btn-primary place-order-btn">
              Đặt hàng
            </button>
          </div>

          <div className="order-summary">
            <h2>Tóm tắt đơn hàng</h2>

            <div className="order-items">
              {cartItems.map((item) => (
                <div key={item.id} className="order-item">
                  <img src={item.image_url || '/images/placeholder.jpg'} alt={item.name} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    {item.color && <p>Màu: {item.color}</p>}
                    <p className="quantity">x {item.quantity}</p>
                  </div>
                  <span className="item-price">{(item.price * item.quantity).toLocaleString('vi-VN')}₫</span>
                </div>
              ))}
            </div>

            <div className="coupon-input">
              <input type="text" placeholder="Mã khuyến mãi" />
              <button type="button" className="btn btn-outline">Áp dụng</button>
            </div>

            <div className="form-section">
              <h2>Phương thức thanh toán</h2>
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Thanh toán khi nhận hàng (COD)</span>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="qr"
                    checked={paymentMethod === 'qr'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Chuyển khoản qua mã QR</span>
                </label>
              </div>
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Tạm tính</span>
                <span>{total.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="summary-total">
                <span>Tổng cộng</span>
                <span>{total.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
