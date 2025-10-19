import '../../css/NhanVien.css'
import { Link } from 'react-router';
import { Sidebar } from '../../components/Sidebar';

export function NhanVien() {
  return (
    <>
      <div className="app">
        <Sidebar />

        <main className="main">
          <div className="topbar">
            <div className="hello">
              Xin chào, Quản lý <span>👋🏼</span>
            </div>
            <div className="search">
              <span>🔍</span>
              <input placeholder="Tìm kiếm nhân viên..." />
            </div>
          </div>

          <section className="section">
            <div className="hd">
              <div>
                <div className="title">Danh sách nhân viên</div>
                <small style={{color: '#16a34a',fontWeight: 700}}>
                  Tất cả nhân viên đang làm việc
                </small>
              </div>
              <div className="tools">
                <div className="input">
                  <span>🔍</span>
                  <input placeholder="Tìm theo tên hoặc chức vụ" />
                </div>
                <div className="sort">
                  Sắp xếp theo: <strong>Mới nhất ▾</strong>
                </div>
              </div>
            </div>

            <div className="bd">
              <table>
                <thead>
                  <tr>
                    <th>Họ và tên</th>
                    <th>Chức vụ</th>
                    <th>Số điện thoại</th>
                    <th>Email</th>
                    <th>Địa chỉ</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Nguyễn Văn Minh</td>
                    <td>Quản lý sân</td>
                    <td>0902 345 678</td>
                    <td>minh.nguyen@pickleball.vn</td>
                    <td>45 Nguyễn Văn Cừ, P.Bồ Đề, Q.Long Biên, Hà Nội</td>
                    <td>
                      <span className="status active">Đang làm việc</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Trần Thị Hạnh</td>
                    <td>Lễ tân</td>
                    <td>0911 223 344</td>
                    <td>hanh.tran@pickleball.vn</td>
                    <td>22 Hoàng Như Tiếp, P.Bồ Đề, Q.Long Biên, Hà Nội</td>
                    <td>
                      <span className="status active">Đang làm việc</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Lê Quang Huy</td>
                    <td>Nhân viên kỹ thuật</td>
                    <td>0978 654 321</td>
                    <td>huy.le@pickleball.vn</td>
                    <td>18 Ngọc Lâm, P.Ngọc Lâm, Q.Long Biên, Hà Nội</td>
                    <td>
                      <span className="status inactive">Tạm nghỉ</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Phạm Thị Lan</td>
                    <td>Kế toán</td>
                    <td>0904 556 789</td>
                    <td>lan.pham@pickleball.vn</td>
                    <td>12 Lâm Hạ, P.Bồ Đề, Q.Long Biên, Hà Nội</td>
                    <td>
                      <span className="status active">Đang làm việc</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Đỗ Văn Tuấn</td>
                    <td>Bảo vệ</td>
                    <td>0983 223 456</td>
                    <td>tuan.do@pickleball.vn</td>
                    <td>89 Nguyễn Sơn, P.Gia Thụy, Q.Long Biên, Hà Nội</td>
                    <td>
                      <span className="status active">Đang làm việc</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Ngô Thị Mai</td>
                    <td>Nhân viên dọn vệ sinh</td>
                    <td>0918 888 234</td>
                    <td>mai.ngo@pickleball.vn</td>
                    <td>34 Ái Mộ, P.Bồ Đề, Q.Long Biên, Hà Nội</td>
                    <td>
                      <span className="status inactive">Tạm nghỉ</span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="pagination">
                <div className="page">‹</div>
                <div className="page active">1</div>
                <div className="page">2</div>
                <div className="page">3</div>
                <div className="page">›</div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
