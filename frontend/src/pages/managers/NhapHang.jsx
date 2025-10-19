import { Sidebar } from '../../components/Sidebar';
import '../../css/NhapHang.css'
import { Link } from 'react-router';

export function NhapHang() {
  return (
    <>
      <title>Suno.vn – Nhập hàng (mock)</title>

      <div className="app">
        <Sidebar />

        <header className="topbar">
          <div className="search">
            🔍
            <input placeholder="Nhập mã phiếu nhập để tìm" />
          </div>
          <div className="daterange">
            <span>30 ngày gần đây</span> | <strong>02/09/2019 – 01/10/2019</strong> 📅
          </div>
          <button className="btn-primary">NHẬP HÀNG</button>
        </header>


        <main className="content">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Phiếu nhập <span className="muted">(30 ngày gần đây)</span></div>
              <div className="muted">Cửa hàng: <strong>Tất cả</strong></div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style={{width: '40px'}}><input type="checkbox" /></th>
                  <th>Mã phiếu</th>
                  <th>Ngày nhập</th>
                  <th>Người nhập</th>
                  <th>Nhà cung cấp</th>
                  <th>Trạng thái</th>
                  <th className="amount">Tổng tiền</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><input type="checkbox" /></td>
                  <td><Link className="link" to="#">PN000023</Link></td>
                  <td>27/09/2019</td>
                  <td>Nguyễn Thị Thanh Thảo</td>
                  <td className="muted"><em>(không nhập)</em></td>
                  <td><span className="chip">Hoàn thành</span></td>
                  <td className="amount">800,000</td>
                  <td className="ellipsis">⋯</td>
                </tr>

                <tr>
                  <td><input type="checkbox" /></td>
                  <td><a className="link" href="#">PN000022</a></td>
                  <td>27/09/2019</td>
                  <td>Nguyễn Thị Thanh Thảo</td>
                  <td className="muted"><em>(không nhập)</em></td>
                  <td><span className="chip">Hoàn thành</span></td>
                  <td className="amount">200,000</td>
                  <td className="ellipsis">⋯</td>
                </tr>

                <tr>
                  <td><input type="checkbox" /></td>
                  <td><a className="link" href="#">PN000021</a></td>
                  <td>27/09/2019</td>
                  <td>Nguyễn Thị Thanh Thảo</td>
                  <td className="muted"><em>(không nhập)</em></td>
                  <td><span className="chip">Hoàn thành</span></td>
                  <td className="amount">500,000</td>
                  <td className="ellipsis">⋯</td>
                </tr>

                <tr>
                  <td><input type="checkbox" /></td>
                  <td><a className="link" href="#">TN2019927114526</a></td>
                  <td>27/09/2019</td>
                  <td>Nguyễn Thị Thanh Thảo</td>
                  <td><a className="link" href="#">Anh Thư</a></td>
                  <td><span className="chip gray">Lưu tạm</span></td>
                  <td className="amount">1,000,000</td>
                  <td className="ellipsis">⋯</td>
                </tr>

                <tr>
                  <td><input type="checkbox" /></td>
                  <td><a className="link" href="#">PN000020</a></td>
                  <td>27/09/2019</td>
                  <td>Nguyễn Thị Thanh Thảo</td>
                  <td><a className="link" href="#">THT12</a></td>
                  <td><span className="chip">Hoàn thành</span></td>
                  <td className="amount">4,000,000</td>
                  <td className="ellipsis">⋯</td>
                </tr>

                <tr>
                  <td><input type="checkbox" /></td>
                  <td><a className="link" href="#">PN000019</a></td>
                  <td>27/09/2019</td>
                  <td>Nguyễn Thị Thanh Thảo</td>
                  <td><a className="link" href="#">Anh Thư</a></td>
                  <td><span className="chip">Hoàn thành</span></td>
                  <td className="amount">24,150,000</td>
                  <td className="ellipsis">⋯</td>
                </tr>

                <tr>
                  <td><input type="checkbox" /></td>
                  <td><a className="link" href="#">PN000018</a></td>
                  <td>27/09/2019</td>
                  <td>Nguyễn Thị Thanh Thảo</td>
                  <td><a className="link" href="#">May</a></td>
                  <td><span className="chip">Hoàn thành</span></td>
                  <td className="amount">19,200,000</td>
                  <td className="ellipsis">⋯</td>
                </tr>

                <tr>
                  <td><input type="checkbox" /></td>
                  <td><a className="link" href="#">PN000016</a></td>
                  <td>26/09/2019</td>
                  <td>Nguyễn Thị Thanh Thảo</td>
                  <td className="muted"><em>(không nhập)</em></td>
                  <td><span className="chip">Hoàn thành</span></td>
                  <td className="amount">10,950,000</td>
                  <td className="ellipsis">⋯</td>
                </tr>

                <tr>
                  <td><input type="checkbox" /></td>
                  <td><a className="link" href="#">PN000015</a></td>
                  <td>23/09/2019</td>
                  <td>Nguyễn Thị Thanh Thảo</td>
                  <td className="muted"><em>(không nhập)</em></td>
                  <td><span className="chip">Hoàn thành</span></td>
                  <td className="amount">1,790,000</td>
                  <td className="ellipsis">⋯</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
}