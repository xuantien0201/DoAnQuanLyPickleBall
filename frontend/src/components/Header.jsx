import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const { getCartCount } = useCart();
  const [userName, setUserName] = useState(null);
  const [role, setRole] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUserName(null);
    setRole(null);
    window.location.href = "/";
  };

  const checkLoginStatus = () => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user.TenKh) {
          setUserName(user.TenKh);
          setRole("customer");
          return;
        } else if (user.role) {
          setUserName(user.userName);
          setRole(user.role); // "Nhân viên" hoặc "Quản lý"
          return;
        }
      } catch (e) {
        console.error("Lỗi khi phân tích user:", e);
      }
    }
    setUserName(null);
    setRole(null);
  };

  useEffect(() => {
    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  return (
    <header className="header">
      <div className="header-main">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <h3>Pickleball Bồ đề</h3>
            </Link>

            <nav className="nav">
              <Link to="/">Trang chủ</Link>
              <Link to="/shop">Shop</Link>
              {/* Chỉ hiện menu Quản lý/Bán hàng cho Nhân viên hoặc Quản lý */}
              {(role === "Nhân viên") && (
                <>
                  <Link to="/pos">Bán hàng tại quầy</Link>
                <Link to="/calam">Đăng ký ca làm</Link>
                </>
              )}
               {( role === "Quản lý") && (
                <>
                  <Link to="/dat-san">Quản lý</Link>
                  <Link to="/pos">Bán hàng tại quầy</Link>
                </>
              )}
            </nav>

            <div className="header-actions">
              {userName ? (
                <>
                  <Link to="/profile" className="action-icon login-icon">
                    <span>
                      Xin chào, {userName.length > 20 ? userName.slice(0, 20) + "..." : userName}
                    </span>
                  </Link>
                  <div className="action-icon logout-icon" onClick={handleLogout} title="Đăng xuất">
                    <span>Đăng xuất</span>
                  </div>
                </>
              ) : (
                <Link to="/login" className="action-icon login-icon">
                  <span>Đăng nhập</span>
                </Link>
              )}

              <Link to="/cart" className="cart-icon-wrapper">
                <div className="cart-icon">
                  {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
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