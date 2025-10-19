import { useState, useEffect, useRef } from "react";
import { Sidebar } from "../../components/Sidebar";
import "../../css/XacNhanDatSan.css";

export function XacNhanDatSan() {
  const [danhSachSan, setDanhSachSan] = useState([]);
  const [tenKhach, setTenKhach] = useState("");
  const [sdt, setSdt] = useState("");
  const [selectedKhachHangId, setSelectedKhachHangId] = useState(""); // <-- Lưu MaKH
  const [searchTen, setSearchTen] = useState([]);
  const [searchSdt, setSearchSdt] = useState([]);
  const [hienThiMaGiamGia, setHienThiMaGiamGia] = useState(false);
  const [dichVuList, setDichVuList] = useState([]);
  const [khachHangData, setKhachHangData] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const API_BASE = "http://localhost:3000/api/khachhang";
  const typingTimeout = useRef(null);

  const openingHour = 5;
  const courts = [
    "Sân 1",
    "Sân 2",
    "Sân 3",
    "Sân 4",
    "Sân 5",
    "Sân 6",
    "Sân 7",
    "Sân 8",
    "Sân 9",
    "Sân 10",
    "Sân 11",
    "Sân 12",
    "Sân 13",
    "Sân 14",
    "Sân 15",
    "Sân TT",
  ];

  const getSlotPrice = (courtName, slotIndex) => {
    const hour = openingHour + slotIndex;
    const isAfter16h = hour >= 16;
    if (courtName === "Sân TT") return isAfter16h ? 200000 : 150000;
    return isAfter16h ? 160000 : 100000;
  };

  // 🧩 Lấy dữ liệu đặt sân từ localStorage
  useEffect(() => {
    const data = localStorage.getItem("bookingData");
    if (!data) {
      alert("Không có dữ liệu đặt sân. Vui lòng quay lại chọn sân!");
      window.location.href = "/datsan";
      return;
    }
    const parsed = JSON.parse(data);
    const grouped = {};

    parsed.selectedSlots.forEach((s) => {
      const courtName = courts[s.courtIndex];
      const hour = openingHour + s.slotIndex;
      const date = parsed.date || new Date().toLocaleDateString("vi-VN");
      if (!grouped[courtName]) grouped[courtName] = {};
      if (!grouped[courtName][date]) grouped[courtName][date] = [];
      grouped[courtName][date].push(hour);
    });

    const merged = [];
    Object.keys(grouped).forEach((courtName) => {
      Object.keys(grouped[courtName]).forEach((date) => {
        const hours = grouped[courtName][date].sort((a, b) => a - b);
        let start = hours[0],
          end = hours[0];
        for (let i = 1; i <= hours.length; i++) {
          if (hours[i] === end + 1) {
            end = hours[i];
          } else {
            const baseSlot = start - openingHour;
            const gia = getSlotPrice(courtName, baseSlot);
            merged.push({
              ten: courtName,
              loai: "Sân tiêu chuẩn",
              ngay: date,
              batDau: `${String(start).padStart(2, "0")}:00`,
              ketThuc: `${String(end + 1).padStart(2, "0")}:00`,
              gia,
              soGio: end - start + 1,
            });
            start = hours[i];
            end = hours[i];
          }
        }
      });
    });
    setDanhSachSan(merged);
  }, []);

  const tinhSoGio = (bd, kt) => {
    const [h1, m1] = bd.split(":").map(Number);
    const [h2, m2] = kt.split(":").map(Number);
    return h2 + m2 / 60 - (h1 + m1 / 60);
  };

  const tongTien = danhSachSan.reduce(
    (sum, san) => sum + san.gia * tinhSoGio(san.batDau, san.ketThuc),
    0
  );

  // 🔹 API tìm kiếm khách hàng
  const timKiemKhachHang = async (tuKhoa, type) => {
    if (!tuKhoa.trim())
      return type === "ten" ? setSearchTen([]) : setSearchSdt([]);
    try {
      const res = await fetch(
        `${API_BASE}/search?q=${encodeURIComponent(tuKhoa)}`
      );
      if (!res.ok) throw new Error("Lỗi khi gọi API tìm kiếm");
      const data = await res.json();
      type === "ten" ? setSearchTen(data) : setSearchSdt(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(
      () => timKiemKhachHang(tenKhach, "ten"),
      400
    );
  }, [tenKhach]);
  useEffect(() => {
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => timKiemKhachHang(sdt, "sdt"), 400);
  }, [sdt]);

  const chonKhach = (ten, sdt, id) => {
    setTenKhach(ten);
    setSdt(sdt);
    setSelectedKhachHangId(id); // <-- Lưu MaKH
    setSearchTen([]);
    setSearchSdt([]);
    setHienThiMaGiamGia(true);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setSdt(value);
    if (value && !/^\d{10}$/.test(value)) {
      setErrorMsg("⚠️ Số điện thoại không hợp lệ (phải đủ 10 số)");
    } else {
      setErrorMsg("");
    }
  };

  const themKhachHang = async () => {
    if (!tenKhach.trim() || !sdt.trim()) {
      alert("Vui lòng nhập đầy đủ họ tên và số điện thoại!");
      return;
    }
    if (!/^\d{10}$/.test(sdt)) {
      alert("Số điện thoại không hợp lệ (10 số)!");
      return;
    }
    try {
      const randomNum = Math.floor(Math.random() * 900000 + 100000);
      const idKh = `KH${randomNum}`;
      const res = await fetch(`${API_BASE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: idKh,
          TenKh: tenKhach,
          GioiTinh: "",
          SDT: sdt,
          DiaChi: "",
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Lỗi thêm khách hàng!");
      alert(result.message || "✅ Thêm khách hàng thành công!");
      setKhachHangData([...khachHangData, result]);
      setSelectedKhachHangId(result.id); // <-- Lưu MaKH
    } catch (err) {
      console.error(err);
      alert(err.message || "❌ Lỗi khi thêm khách hàng!");
    }
  };

  const xacNhanDatSan = async () => {
    const data = localStorage.getItem("bookingData");
    if (!data) {
      alert("Không có dữ liệu đặt sân!");
      window.location.href = "/datsan";
      return;
    }

    const parsed = JSON.parse(data);

    if (!tenKhach.trim() || !sdt.trim()) {
      alert("Vui lòng nhập đầy đủ họ tên và số điện thoại!");
      return;
    }
    if (!/^\d{10}$/.test(sdt)) {
      alert("Số điện thoại không hợp lệ (10 số)!");
      return;
    }

    if (!selectedKhachHangId) {
      alert("⚠️ Vui lòng chọn khách hàng!");
      return;
    }

    try {
      const grouped = {};
      parsed.selectedSlots.forEach((s) => {
        const courtName = courts[s.courtIndex];
        const date = parsed.date
          ? new Date(parsed.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0]; // ✅ format YYYY-MM-DD
        const hour = openingHour + s.slotIndex;
        if (!grouped[courtName]) grouped[courtName] = {};
        if (!grouped[courtName][date]) grouped[courtName][date] = [];
        grouped[courtName][date].push(hour);
      });

      const requests = [];
      Object.keys(grouped).forEach((courtName) => {
        Object.keys(grouped[courtName]).forEach((date) => {
          const hours = grouped[courtName][date].sort((a, b) => a - b);
          let start = hours[0],
            end = hours[0];
          for (let i = 1; i <= hours.length; i++) {
            if (hours[i] === end + 1) {
              end = hours[i];
            } else {
              const soGio = end - start + 1;
              const gia = getSlotPrice(courtName, start - openingHour);
              requests.push({
                MaSan: `S${courts.indexOf(courtName) + 1}`,
                MaKH: selectedKhachHangId,
                MaNV: "NV001",
                GioVao: `${String(start).padStart(2, "0")}:00:00`,
                GioRa: `${String(end + 1).padStart(2, "0")}:00:00`,
                TongGio: soGio,
                TongTien: gia * soGio,
                GiamGia: 0,
                TongTienThuc: gia * soGio,
                GhiChu: "",
                LoaiDat: parsed.bookingType || "Đặt sân ngày",
                NgayLap: date, // ✅ đã chuẩn hóa định dạng
              });
              start = hours[i];
              end = hours[i];
            }
          }
        });
      });

      for (let reqBody of requests) {
        const res = await fetch("http://localhost:3000/api/san/book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reqBody),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Lỗi khi đặt sân!");
      }

      alert("✅ Đặt sân thành công!");
      localStorage.removeItem("bookingData");

      // ✅ Chuyển về trang chủ sau khi đặt thành công
      window.location.href = "/";

    } catch (err) {
      console.error("❌ Lỗi đặt sân:", err);

      // ✅ Giữ lại dữ liệu khi bị lỗi để người dùng quay lại Xác nhận
      alert(err.message || "❌ Lỗi đặt sân! Vui lòng kiểm tra lại thông tin.");

      // Giữ nguyên dữ liệu vừa nhập (không xóa localStorage)
      // Quay lại trang xác nhận đặt sân
      window.location.href = "/xacnhandatsan";
    }
  };


  // ==== RENDER ====
  return (
    <div className="xac-nhan-wrapper">
      <Sidebar />
      <div className="confirm-container">
        <h1>Xác nhận đặt sân</h1>
        {/* Bảng sân */}
        <div className="info-group">
          <h2>Danh sách sân khách đặt</h2>
          <table>
            <thead>
              <tr>
                <th>Tên sân</th>
                <th>Loại sân</th>
                <th>Ngày</th>
                <th>Giờ bắt đầu</th>
                <th>Giờ kết thúc</th>
                <th>Giá / giờ</th>
                <th>Tổng</th>
              </tr>
            </thead>
            <tbody>
              {danhSachSan.map((san, index) => {
                const gio = tinhSoGio(san.batDau, san.ketThuc);
                const tong = san.gia * gio;
                return (
                  <tr key={index}>
                    <td>{san.ten}</td>
                    <td>{san.loai}</td>
                    <td>{san.ngay}</td>
                    <td>{san.batDau}</td>
                    <td>{san.ketThuc}</td>
                    <td>{san.gia.toLocaleString()}đ</td>
                    <td className="tongTien">{tong.toLocaleString()}đ</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="total">Tổng cộng: {tongTien.toLocaleString()}đ</div>
        </div>

        {/* Thông tin khách */}
        <div className="info-group">
          <h2>Thông tin khách hàng</h2>
          <div className="flex-row">
            <div className="flex-col" style={{ position: "relative" }}>
              <label>Họ và tên:</label>
              <input
                type="text"
                value={tenKhach}
                onChange={(e) => setTenKhach(e.target.value)}
                placeholder="Nhập họ tên..."
                autoComplete="off"
              />
              {searchTen.length > 0 && (
                <div
                  className="search-results-table"
                  style={{ position: "relative" }}
                >
                  <table className="suggest-table">
                    <thead>
                      <tr>
                        <th>Họ & tên</th>
                        <th>SĐT</th>
                        <th>Mã</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchTen
                        .filter((kh) =>
                          kh?.TenKh?.toLowerCase().includes(
                            tenKhach.toLowerCase()
                          )
                        )
                        .slice(0, 5)
                        .map((kh, i) => (
                          <tr
                            key={i}
                            onClick={() =>
                              chonKhach(kh.TenKh, kh.SDT, kh.id ?? kh.ID)
                            }
                            style={{ cursor: "pointer" }}
                          >
                            <td>{kh.TenKh}</td>
                            <td>{kh.SDT}</td>
                            <td>{kh.id ?? kh.ID ?? ""}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex-col" style={{ position: "relative" }}>
              <label>Số điện thoại:</label>
              <input
                type="tel"
                value={sdt}
                onChange={handlePhoneChange}
                placeholder="Nhập SĐT..."
                maxLength={10}
                autoComplete="off"
              />
              {errorMsg && <p className="error-text">{errorMsg}</p>}
              {searchSdt.length > 0 && (
                <div
                  className="search-results-table"
                  style={{ position: "relative" }}
                >
                  <table className="suggest-table">
                    <thead>
                      <tr>
                        <th>SĐT</th>
                        <th>Họ & tên</th>
                        <th>Mã</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchSdt
                        .filter((kh) => String(kh?.SDT || "").includes(sdt))
                        .slice(0, 5)
                        .map((kh, i) => (
                          <tr
                            key={i}
                            onClick={() =>
                              chonKhach(kh.TenKh, kh.SDT, kh.id ?? kh.ID)
                            }
                            style={{ cursor: "pointer" }}
                          >
                            <td>{kh.SDT}</td>
                            <td>{kh.TenKh}</td>
                            <td>{kh.id ?? kh.ID ?? ""}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="actions-customer">
            <button className="btn-add-customer" onClick={themKhachHang}>
              + Thêm khách hàng mới
            </button>
            {hienThiMaGiamGia && (
              <div>
                <label htmlFor="maGiamGia">Mã giảm giá:</label>
                <select id="maGiamGia">
                  <option value="">-- Chọn mã giảm giá --</option>
                  <option value="KM10">Giảm 10%</option>
                  <option value="KM50">Giảm 50.000đ</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Dịch vụ thêm */}
        <div className="info-group">
          <h2>Dịch vụ thêm</h2>
          <button
            className="btn-add-service"
            onClick={() => setDichVuList([...dichVuList, { ten: "", gia: "" }])}
          >
            + Thêm dịch vụ
          </button>
          <div className="dichvu-list">
            {dichVuList.map((dv, index) => (
              <div key={index} className="dich-vu-item">
                <input
                  type="text"
                  className="input-ten-dv"
                  placeholder="Tên dịch vụ"
                  value={dv.ten}
                  onChange={(e) => {
                    const updated = [...dichVuList];
                    updated[index].ten = e.target.value;
                    setDichVuList(updated);
                  }}
                />
                <input
                  type="number"
                  className="input-gia-dv"
                  placeholder="Giá (đ)"
                  value={dv.gia}
                  onChange={(e) => {
                    const updated = [...dichVuList];
                    updated[index].gia = e.target.value;
                    setDichVuList(updated);
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="confirm-buttons">
          <button className="btn-back" onClick={() => history.back()}>
            Quay lại
          </button>
          <button className="btn-confirm" onClick={xacNhanDatSan}>
            Xác nhận đặt sân
          </button>
        </div>
      </div>
    </div>
  );
}
