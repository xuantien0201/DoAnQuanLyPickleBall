import "../../css/TTXeVe.css";
import { Sidebar } from "../../components/Sidebar";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import mbBank from "../../images/mb-bank.jpg";

export function TTXeVe() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [method, setMethod] = useState("tt-qr");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Lấy dữ liệu truyền từ trang trước
  const bookingData = state?.bookingData;

  if (!bookingData) {
    return (
      <div className="app">
        <Sidebar />
        <div className="tt-container">
          <header className="tt-header">Xác nhận thanh toán</header>
          <p style={{ padding: "20px", textAlign: "center" }}>
            ⚠️ Không có dữ liệu đặt vé. Vui lòng quay lại trang trước.
          </p>
          <div style={{ textAlign: "center" }}>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/qlyxeve")}
            >
              ← Quay lại
            </button>
          </div>
        </div>
      </div>

    );
  }

  // Lấy dữ liệu
  const {
    ten,
    sdt,
    soVe,
    tenSuKien,
    ngayToChuc,
    danhSachSan,
    thoiGianBatDau,
    thoiGianKetThuc,
    maXeVe,
  } = bookingData;

  // Format ngày và giờ
  const ngayToChucDisplay = ngayToChuc
    ? new Date(ngayToChuc).toLocaleDateString()
    : "";
  const gioBatDauDisplay = thoiGianBatDau ? thoiGianBatDau.slice(0, 5) : "";
  const gioKetThucDisplay = thoiGianKetThuc ? thoiGianKetThuc.slice(0, 5) : "";

  console.log("📦 Dữ liệu nhận tại TTXeVe:", bookingData);

  // ✅ Đường dẫn API chuẩn REST
  const API_BASE = "http://localhost:3000/api";
  const API_KHACHHANG = `${API_BASE}/khachhang`;
  const API_DATVE = `${API_BASE}/xeve/datve`;

  // ✅ Xử lý xác nhận thanh toán
  const handleConfirmPayment = async () => {
    if (isLoading) return;

    try {
      // Validate dữ liệu
      if (!ten?.trim() || !sdt?.trim() || !soVe) {
        alert("⚠️ Vui lòng nhập đầy đủ họ tên, số điện thoại và số vé!");
        return;
      }
      if (!/^\d{10}$/.test(sdt)) {
        alert("❌ Số điện thoại không hợp lệ (10 số)!");
        return;
      }

      setIsLoading(true);

      // 1️⃣ Thêm khách hàng
      const resKh = await fetch(API_KHACHHANG, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          TenKh: ten,
          SDT: sdt,
          DiaChi: "",
          Email: ""
        }),
      });

      const dataKh = await resKh.json();
      if (!resKh.ok) {
        throw new Error(dataKh.message || "Lỗi thêm khách hàng!");
      }

      const maKH = dataKh.insertedId; // ID khách hàng từ backend
      console.log("✅ Thêm khách hàng thành công, MaKH:", maKH);

      // 2️⃣ Thêm đặt vé
      const payload = {
        MaXeVe: parseInt(maXeVe, 10),
        MaKH: maKH,
        NguoiLap: "NV001",
        SoLuongSlot: parseInt(soVe, 10),
        GhiChu: `Thanh toán bằng ${method}`,
        ThoiGianDangKy: new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
      };

      const resDatVe = await fetch(API_DATVE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const dataDatVe = await resDatVe.json();
      if (!resDatVe.ok || !dataDatVe.success) {
        throw new Error(dataDatVe.message || "Lỗi khi thêm đặt vé!");
      }

      alert("🎉 Thanh toán & đặt vé thành công!");
      console.log("✅ Kết quả đặt vé:", dataDatVe);

      navigate("/qlyxeve");
    } catch (err) {
      console.error("❌ Lỗi khi xác nhận thanh toán:", err);
      alert(err.message || "Đã xảy ra lỗi, vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tt-xeve-wrapper">
      <Sidebar />

      <div className="tt-container">
        <header className="tt-header">Xác nhận thanh toán</header>

        <div className="tt-content">
          {/* Thông tin đặt vé */}
          <div className="tt-info-box">
            <h3>Thông tin đặt vé</h3>
            <div className="tt-info-item">
              👤 <span>Tên khách: <b>{ten}</b></span>
            </div>
            <div className="tt-info-item">
              📞 <span>SĐT: <b>{sdt}</b></span>
            </div>
            <div className="tt-info-item">
              🎉 <span>Sự kiện: <b>{tenSuKien}</b></span>
            </div>
            <div className="tt-info-item">
              📅 <span>Ngày tổ chức: <b>{ngayToChucDisplay}</b></span>
            </div>
            <div className="tt-info-item">
              🏟️ <span>Sân: <b>{danhSachSan}</b></span>
            </div>
            <div className="tt-info-item">
              🕒 <span>Giờ: <b>{gioBatDauDisplay} - {gioKetThucDisplay}</b></span>
            </div>
            <div className="tt-info-item">
              🎫 <span>Số vé: <b>{soVe}</b></span>
            </div>
            <div className="tt-info-item">
              💰 <span>Tổng tiền: <b>{Number(soVe) * 100000} ₫</b></span>
            </div>
          </div>

          {/* Thanh toán */}
          <div className="tt-payment-box">
            <h3>Chọn phương thức thanh toán</h3>

            <div className="tt-payment-methods">
              {["tt-qr", "tt-vnpay", "tt-zalopay", "tt-cash"].map((m) => (
                <button
                  key={m}
                  className={`tt-method-btn ${method === m ? "active" : ""}`}
                  onClick={() => setMethod(m)}
                >
                  {m === "tt-qr"
                    ? "QR Pay"
                    : m === "tt-vnpay"
                      ? "VNPay"
                      : m === "tt-zalopay"
                        ? "ZaloPay"
                        : "Tiền mặt"}
                </button>
              ))}
            </div>

            {method === "tt-qr" && (
              <div className="tt-payment-detail active">
                <div className="tt-qr-section">
                  <img src={mbBank} alt="QR Code" />
                  <div className="tt-bank-info">
                    <p><b>Tên tài khoản:</b> Nguyen Trung Nguyen</p>
                    <p><b>Số tài khoản:</b> 0345137842</p>
                    <p><b>Ngân hàng:</b> MB Bank</p>
                  </div>
                  <div className="tt-note">
                    Vui lòng chuyển khoản <b>{Number(soVe) * 100000} ₫</b> và gửi ảnh xác nhận sau khi thanh toán.
                    <br />
                    Hệ thống sẽ giữ vé của bạn trong <b>5 phút</b>.
                  </div>
                  <div className="tt-confirm-box">
                    <button
                      className="tt-confirm-btn"
                      onClick={handleConfirmPayment}
                      disabled={isLoading}
                    >
                      {isLoading ? "Đang xử lý..." : "Xác nhận thanh toán"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
