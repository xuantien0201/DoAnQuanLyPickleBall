import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const { getCartCount } = useCart();
  const [userName, setUserName] = useState(null);

  // Hàm xử lý Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('user'); // Xóa thông tin người dùng
    setUserName(null); // Cập nhật state để Header hiển thị lại nút "Đăng nhập"
    // Tùy chọn: Chuyển hướng về trang chủ
    window.location.href = "/";
  };

  // Hàm kiểm tra trạng thái đăng nhập (giữ nguyên)
  const checkLoginStatus = () => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        // Chú ý: Đảm bảo tên trường ở đây khớp với Backend (TenKH hoặc TenKh)
        // Dựa trên code cũ của bạn: tôi sửa thành TenKh
        if (user.TenKh) { 
          setUserName(user.TenKh);
          return;
        }
      } catch (e) {
        console.error("Lỗi khi phân tích user từ localStorage:", e);
      }
    }
    setUserName(null);
  };

  useEffect(() => {
    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus); 
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-main">
        <div className="container">
          <div className="header-content">
            {/* ... (Logo) ... */}
            <Link to="/" className="logo">
              <h3>Pickleball Bồ đề</h3>
              <p className="header-description">
                Đại lý ủy quyền pickleball số 1 Việt Nam. Uy tín tạo niềm tin.
              </p>
            </Link>

            {/* ... (Navigation) ... */}
            <nav className="nav">
              <Link to="/">Trang chủ</Link>
              <Link to="/shop">Shop</Link>
              <Link to="/dat-san">Quản lý</Link>
              <Link to="/pos">Bán hàng tại quầy</Link>
            </nav>

            <div className="header-actions">
              {/* Nút Đăng nhập / Tên Khách hàng */}
              {userName ? (
                // Đã đăng nhập
                <>
                  <Link to="/profile" className="action-icon login-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                      <path d="M4 20v-1c0-2.21 3.58-4 8-4s8 1.79 8 4v1" />
                    </svg>
<span title={userName}>
  Xin chào, {userName.length > 15 ? userName.slice(0, 15) + "..." : userName}
</span>                  </Link>

                  {/* 💡 THÊM NÚT ĐĂNG XUẤT */}
                  <div 
                    className="action-icon logout-icon" 
                    onClick={handleLogout}
                    title="Đăng xuất"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    <span className="logout-text">Đăng xuất</span>
                  </div>
                </>
              ) : (
                // Chưa đăng nhập
                <Link to="/login" className="action-icon login-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                    <path d="M4 20v-1c0-2.21 3.58-4 8-4s8 1.79 8 4v1" />
                  </svg>
                  <span>Đăng nhập</span>
                </Link>
              )}
              
              {/* Giỏ hàng (giữ nguyên) */}

              <Link to="/cart" className="cart-icon-wrapper">
                <div className="cart-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  {getCartCount() > 0 && (
                    <span className="cart-badge">{getCartCount()}</span>
                  )}
                </div>
                <span className="cart-text">Giỏ hàng</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;