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
              <Link to="/products">Quản lý</Link>
              <Link to="/pos">Bán hàng tại quầy</Link>
            </nav>

            <div className="header-actions">
              {/* Icon tài khoản */}
              <Link to="/profile" className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>

              {/* Giỏ hàng */}
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
