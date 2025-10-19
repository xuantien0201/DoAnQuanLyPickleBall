import './Sidebar.css'
import { Link } from 'react-router';

export function Sidebar() {
  return (
    <>
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">🏸</div>
          <div className="title">
            Pickleball Bồ Đề
            <br />
            <small>Trang quản trị</small>
          </div>
        </div>

        <nav className="snav" aria-label="Chính">
          <Link className="slink" to="/trangchu">
            <span className="ic">🗓️</span>
            <span>Trang chủ</span>
          </Link>
          <Link className="slink" to="/dat-san">
            <span className="ic">🗓️</span>
            <span>Đặt sân</span>
          </Link>
          <Link className="slink" to="/xeve">
            <span className="ic">🗓️</span>
            <span>Xé vé</span>
          </Link>
          <Link className="slink" to="/products">
            <span className="ic">🏷️</span>
            <span>Sản phẩm</span>
          </Link>
          <Link className="slink active" to="/categories">
            <span className="ic">📁</span>
            <span>Danh mục</span>
          </Link>
          <Link className="slink" to="/orders">
            <span className="ic">🧾</span>
            <span>Hóa đơn</span>
          </Link>
          <Link className="slink" to="/shop">
            <span className="ic">🏠</span>
            <span>Xem trang bán hàng</span>
          </Link>
          
          <Link className="slink" to="/pos">
            <span className="ic">💵</span>
            <span>Bán hàng tại quầy</span>
          </Link>
          <Link className="slink" to="/">
            <span className="ic">🗓️</span>
            <span>Trở về Trang chủ</span>
          </Link>
          <Link className="slink" to="#">
            <span className="ic">🎟️</span>
            <span>Khuyến mãi</span>
          </Link>
          <Link className="slink active" to="/nhanvien">
            <span className="ic">👥</span>
            <span>Nhân viên</span>
          </Link>
          <Link className="slink" to="#">
            <span className="ic">📇</span>
            <span>Khách hàng</span>
          </Link>
          <Link className="slink" to="#">
            <span className="ic">🎟️</span>
            <span>Khuyến mãi</span>
          </Link>
        </nav>

        <div className="divider"></div>

        <nav className="bottom" aria-label="Hỗ trợ">
          <Link className="slink" to="#">
            <span className="ic">⚙️</span>
            <span>Cài đặt</span>
          </Link>
          <Link className="slink" to="#">
            <span className="ic">❓</span>
            <span>Trung tâm trợ giúp</span>
          </Link>
        </nav>

        <div className="user">
          <div className="avatar"></div>
          <div>
            <div style={{ fontWeight: 700 }}>Nguyễn Văn A</div>
            <small>Quản lý cơ sở</small>
          </div>
        </div>
      </aside>
    </>
  );
}
