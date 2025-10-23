import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = () => {
  const { getCartCount } = useCart();

  return (
    <header className="header">
      <div className="header-main">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <h3>Pickleball Bồ đề</h3>
              <p className="header-description">
                Đại lý ủy quyền pickleball số 1 Việt Nam. Uy tín tạo niềm tin.
              </p>
            </Link>

            <nav className="nav">
              <Link to="/">Trang chủ</Link>
              <Link to="/shop">Shop</Link>
              <Link to="/dat-san">Quản lý</Link>
              <Link to="/pos">Bán hàng tại quầy</Link>
            </nav>

            <div className="header-actions">
              <Link to="/login" className="action-icon login-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                  <path d="M4 20v-1c0-2.21 3.58-4 8-4s8 1.79 8 4v1" />
                </svg>
                <span>Đăng nhập</span>
              </Link>
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
