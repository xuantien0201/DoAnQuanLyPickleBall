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
          <Link className="slink" to="/">
            <span className="ic">🗓️</span>
            <span>Trang chủ</span>
          </Link>
          <Link className="slink" to="/dat-san">
            <span className="ic">🗓️</span>
            <span>Đặt sân ngày</span>
          </Link>
          <Link className="slink" to="/santhang">
            <span className="ic">🗓️</span>
            <span>Đặt sân tháng</span>
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
          
          <Link className="slink" to="/pos">
            <span className="ic">💵</span>
            <span>Bán hàng tại quầy</span>
          </Link>
          <Link className="slink active" to="/nhanvien">
            <span className="ic">👥</span>
            <span>Nhân viên</span>
          </Link>
          <Link className="slink" to="/nhacungcap">
            <span className="ic">📇</span>
            <span>Nhà cung cấp</span>
          </Link>
          <Link className="slink" to="/nhaphang">
            <span className="ic">🎟️</span>
            <span>Nhập hàng</span>
          </Link>
        </nav>

        <div className="divider"></div>

        <nav className="bottom" aria-label="Hỗ trợ">
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
