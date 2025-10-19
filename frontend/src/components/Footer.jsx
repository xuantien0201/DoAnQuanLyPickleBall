import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-column">
              <h3>Pickleball Bồ đề</h3>
              <p className="footer-tagline">Premium Pickleball Equipment & Accessories</p>
              <p className="footer-description">
                Đại lý ủy quyền pickleball số 1 Việt Nam. Uy tín tạo niềm tin.
              </p>
            </div>

            <div className="footer-column">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/shop">Shop</Link></li>
                <li><Link to="/shop?category=Paddles">Paddles</Link></li>
                <li><Link to="/shop?category=Balls">Balls</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Customer Service</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Use</a></li>
                <li><a href="#">Shipping Info</a></li>
                <li><a href="#">Returns</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Contact Us</h4>
              <ul>
                <li>Email: info@pickleballstore.com</li>
                <li>Phone: (555) 123-4567</li>
                <li>Hours: Mon-Fri 9AM-6PM</li>
              </ul>
             
            </div>
          </div>
        </div>
      </div>

      
    </footer>
  );
};

export default Footer;
