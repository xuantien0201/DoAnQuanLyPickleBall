import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };


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
              <Link to="/">Home</Link>
              <Link to="/shop">Shop</Link>
              <Link to="/products">Quản lý</Link>
              <Link to="/pos">POS</Link>
            </nav>

            <div className="header-actions">
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </button>
              </form>

              <Link to="/cart" className="cart-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {getCartCount() > 0 && (
                  <span className="cart-badge">{getCartCount()}</span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
