import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../components/ProductCard';
import '../../css/Home.css';

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [onSaleProducts, setOnSaleProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchNewArrivals();
    fetchOnSaleProducts();
    fetchCategories();
  }, []);

  const fetchNewArrivals = async () => {
    try {
      const response = await axios.get('/api/client/products/featured/new-arrivals');
      setNewArrivals(response.data);
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm mới:', error);
    }
  };

  const fetchOnSaleProducts = async () => {
    try {
      const response = await axios.get('/api/client/products/featured/on-sale');
      setOnSaleProducts(response.data);
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm giảm giá:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/client/categories');
      setCategories(response.data.slice(0, 5));
    } catch (error) {
      console.error('Lỗi khi tải danh mục:', error);
    }
  };

  return (
    <div className="home">
      {/* Phần giới thiệu (Hero Section) */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              <span>Đơn giản – Khác biệt</span><br />
              Chơi hay hơn, với vợt tốt hơn
            </h1>
            <p>
              Khám phá bộ sưu tập vợt pickleball cao cấp được thiết kế dành cho mọi cấp độ người chơi —
              từ người mới bắt đầu đến vận động viên chuyên nghiệp.
              Chất lượng vượt trội, hiệu suất đỉnh cao cho từng cú đánh.
            </p>
            <Link to="/shop" className="btn hero-btn">
              Mua Ngay
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="http://localhost:3000/uploads/categories/Huong-dan-cach-chon-vot-Pickleball-phu-hop-va-chuan-nhat-Hoc-Vien-VNTA-8.webp"
            alt="Dụng cụ Pickleball cao cấp"
          />
        </div>
      </section>


      {/* Phần danh mục sản phẩm */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Mua sắm theo danh mục</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/shop?category=${category.slug}`}
                className={`category-card category-${index + 1}`}
              >
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="category-bg"
                />
                <div className="category-overlay"></div>
                <div className="category-content">
                  <h3>{category.name}</h3>
                  <span className="shop-now">
                    Xem ngay →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Phần sản phẩm mới */}
      <section className="new-arrivals-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Sản phẩm mới</h2>
            <Link to="/shop?status=new" className="view-all">
              Xem thêm sản phẩm →
            </Link>
          </div>
          <div className="products-grid">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Phần sản phẩm giảm giá */}
      <section className="on-sale-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Đang giảm giá</h2>
            <Link to="/shop?status=sale" className="view-all">
              Xem tất cả ưu đãi →
            </Link>
          </div>
          <div className="products-grid">
            {onSaleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="features-grid">

            <div className="feature">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l4 4-4 4-4-4z" />
                  <path d="M4 13h16v8H4z" />
                </svg>
              </div>
              <h3>Sản phẩm chính hãng</h3>
              <p>Cam kết chất lượng, nguồn gốc rõ ràng</p>
            </div>

            <div className="feature">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20z" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h3>Giao hàng nhanh chóng</h3>
              <p>Nhận hàng tận nơi, uy tín và đúng hẹn</p>
            </div>

            <div className="feature">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16v16H4z" />
                  <path d="M9 9h6v6H9z" />
                </svg>
              </div>
              <h3>Thanh toán khi nhận hàng</h3>
              <p>COD toàn quốc, an tâm mua sắm</p>
            </div>

            <div className="feature">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3>Hỗ trợ nhanh chóng</h3>
              <p>Liên hệ qua hotline hoặc fanpage 24/7</p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
