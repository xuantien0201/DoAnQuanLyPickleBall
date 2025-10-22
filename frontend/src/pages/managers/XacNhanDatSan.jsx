import { useState, useEffect, useRef } from "react";
import { Sidebar } from "../../components/Sidebar";
import "../../css/XacNhanDatSan.css";
import mbBank from "../../images/mb-bank.jpg";

export function XacNhanDatSan() {
  const [danhSachSan, setDanhSachSan] = useState([]);
  const [tenKhach, setTenKhach] = useState("");
  const [sdt, setSdt] = useState("");
  const [selectedKhachHangId, setSelectedKhachHangId] = useState("");
  const [searchTen, setSearchTen] = useState([]);
  const [searchSdt, setSearchSdt] = useState([]);
  const [hienThiMaGiamGia, setHienThiMaGiamGia] = useState(false);
  const [dichVuList, setDichVuList] = useState([]);
  const [khachHangData, setKhachHangData] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  // 🆕 cho đặt sân tháng
  const [isDatSanThang, setIsDatSanThang] = useState(false);
  const [thongTinThang, setThongTinThang] = useState({});
  const [loaiThanhToan, setLoaiThanhToan] = useState("100%");

  // const [tongTienSan, setTongTienSan] = useState(0);

  const [tongTienSan, setTongTienSan] = useState(0);
  const [giamGia, setGiamGia] = useState(0);
  const [tongTienThuc, setTongTienThuc] = useState(0);
  const [soTienThanhToan, setSoTienThanhToan] = useState(0);

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

  useEffect(() => {
    if (!thongTinThang?.MaSan || !thongTinThang?.NgayDat) return;

    let tongTien = 0;

    thongTinThang.MaSan.forEach((maSan) => {
      thongTinThang.NgayDat.forEach((ngay) => {
        const gioVao = thongTinThang.GioVao;
        const gioRa = thongTinThang.GioRa;
        const normalizedCourtName =
          maSan === "TT" || maSan === "STT" ? "Sân TT" : maSan;

        const tien =
          Number(tinhTienTheoGio(normalizedCourtName, gioVao, gioRa)) || 0;
        tongTien += tien;
      });
    });

    // --- Tính toán các giá trị ---
    let giam = 0;
    let tongSauGiam = tongTien;
    let soTienThanhToan = tongTien;

    if (loaiThanhToan === "100%") {
      giam = tongTien * 0.1;
      tongSauGiam = tongTien - giam; // ✅ Tổng sau giảm 10%
      soTienThanhToan = tongSauGiam; // ✅ Thanh toán toàn bộ
    } else if (loaiThanhToan === "50%") {
      tongSauGiam = tongTien; // ✅ Không giảm
      soTienThanhToan = tongTien * 0.5; // ✅ Cọc 50%
    }

    // --- Gán giá trị chính xác ---
    setTongTienSan(tongTien);
    setGiamGia(giam);
    setTongTienThuc(tongSauGiam); // ✅ Tổng tiền thực chính là tongSauGiam
    setSoTienThanhToan(soTienThanhToan);

    console.log("💰 Tổng tiền:", tongTien);
    console.log("💸 Giảm giá:", giam);
    console.log("✅ Tổng thực tế sau giảm:", tongSauGiam); // ✅ tongTienThuc thực tế
    console.log("💵 Cần thanh toán:", soTienThanhToan);
  }, [thongTinThang, loaiThanhToan]);

  // // 🆕 Tính tổng tiền thực khi đặt sân tháng
  // useEffect(() => {
  //   if (!isDatSanThang) return;
  //   let total = thongTinThang?.TongTien || 0;
  //   if (loaiThanhToan === "50%") total = total * 0.5;
  //   else if (loaiThanhToan === "100%") total = total * 0.9; // chiết khấu 10%
  //   setTongTienThuc(total);
  //   console.log("💰 Tổng tiền thực tính:", total);
  // }, [loaiThanhToan, thongTinThang, isDatSanThang]);
  // ===================== HÀM TÍNH GIÁ =====================

  const getSlotPriceByHour = (courtName, hour) => {
    // hour: số nguyên 0-23
    const isAfter16h = hour >= 16;
    if (courtName === "Sân TT") return isAfter16h ? 200000 : 150000;
    return isAfter16h ? 160000 : 100000;
  };

  const tinhTienTheoGio = (courtName, gioVao, gioRa) => {
    const [h1, m1] = gioVao.split(":").map(Number);
    const [h2, m2] = gioRa.split(":").map(Number);
    let total = 0;
    let currentH = h1;
    while (currentH < h2 || (currentH === h2 && m2 > 0)) {
      total += getSlotPriceByHour(courtName, currentH);
      currentH += 1;
    }
    return total;
  };

  // 🧩 Load dữ liệu đặt sân
  useEffect(() => {
    const data = localStorage.getItem("bookingData");
    if (!data) {
      alert("Không có dữ liệu đặt sân. Vui lòng quay lại chọn sân!");
      window.location.href = "/datsan";
      return;
    }

    const parsed = JSON.parse(data);
    console.log("📦 Dữ liệu đọc từ localStorage:", parsed);

    // ✅ Ưu tiên nhận diện Đặt sân tháng
    const isThang =
      parsed?.LoaiDat === "Đặt sân tháng" ||
      parsed?.bookingType === "Đặt sân tháng" ||
      parsed?.type === "Đặt sân tháng" ||
      (Array.isArray(parsed?.NgayDat) && parsed?.Thang && parsed?.Nam);

    if (isThang) {
      console.log("✅ Phát hiện loại đặt sân tháng!");
      setIsDatSanThang(true);
      setThongTinThang(parsed);
      return;
    }

    // ⚠️ Nếu không phải sân tháng → xử lý sân ngày như cũ
    console.log("⚠️ Không phát hiện đặt sân tháng, xử lý như sân ngày");

    const grouped = {};
    parsed.selectedSlots?.forEach((s) => {
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
            const gioVaoStr = `${String(start).padStart(2, "0")}:00`;
            const gioRaStr = `${String(end + 1).padStart(2, "0")}:00`;
            const normalizedCourtName =
              courtName === "TT" || courtName === "STT" ? "Sân TT" : courtName;
            // const gia = tinhTienTheoGio(
            //   normalizedCourtName,
            //   gioVaoStr,
            //   gioRaStr
            // );
            // merged.push({
            //   ten: normalizedCourtName,
            //   loai: "Sân tiêu chuẩn",
            //   ngay: date,
            //   batDau: gioVaoStr,
            //   ketThuc: gioRaStr,
            //   gia,
            //   soGio: tinhSoGio(gioVaoStr, gioRaStr),
            // });
            merged.push({
              ten: normalizedCourtName,
              loai:
                normalizedCourtName === "Sân TT"
                  ? "Sân đặc biệt"
                  : "Sân tiêu chuẩn",
              ngay: date,
              batDau: gioVaoStr,
              ketThuc: gioRaStr,
              gia: tinhTienTheoGio(normalizedCourtName, gioVaoStr, gioRaStr),
              soGio: tinhSoGio(gioVaoStr, gioRaStr),
            });
            start = hours[i];
            end = hours[i];
          }
        }
      });
    });

    console.log("📋 Danh sách sân lẻ được xử lý:", merged);
    setDanhSachSan(merged);
  }, []);

  // 🧭 Theo dõi trạng thái
  useEffect(() => {
    console.log("🔍 Trạng thái isDatSanThang:", isDatSanThang);
    console.log("🔍 Thông tin tháng:", thongTinThang);
  }, [isDatSanThang, thongTinThang]);

  const tinhSoGio = (bd, kt) => {
    const [h1, m1] = bd.split(":").map(Number);
    const [h2, m2] = kt.split(":").map(Number);
    return h2 + m2 / 60 - (h1 + m1 / 60);
  };

  const tongTien = danhSachSan.reduce(
    (sum, san) => sum + Number(san.gia || 0),
    0
  );

  // ===================== API KHÁCH HÀNG =====================
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
    setSelectedKhachHangId(id);
    setSearchTen([]);
    setSearchSdt([]);
    setHienThiMaGiamGia(true);
    console.log("👤 Chọn khách:", { ten, sdt, id });
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
      alert("✅ Thêm khách hàng thành công!");
      setSelectedKhachHangId(result.id);
      console.log("✅ Đã thêm KH mới:", result);
    } catch (err) {
      console.error(err);
      alert(err.message || "❌ Lỗi khi thêm khách hàng!");
    }
  };

  // ===================== XÁC NHẬN ĐẶT SÂN =====================
  const xacNhanDatSan = async (loaiDat) => {
    const data = localStorage.getItem("bookingData");
    if (!data) {
      alert("Không có dữ liệu đặt sân!");
      return;
    }

    const parsed = JSON.parse(data);
    console.log("🚀 Dữ liệu xác nhận đặt sân:", parsed);

    // ===============================
    // 🌟 Xử lý đặt sân tháng (CÓ ĐỦ DỮ LIỆU TIỀN)
    // ===============================
    if (loaiDat === "thang") {
      const tenKHThang = parsed.TenKH;
      const sdtThang = parsed.SDT;

      if (!tenKHThang?.trim() || !sdtThang?.trim()) {
        alert("Vui lòng nhập đầy đủ họ tên và SĐT cho sân tháng!");
        return;
      }

      try {
        // 🧾 Lấy tổng tiền gốc từ dữ liệu
        const tongTien = Number(tongTienSan) || 0;

        // 💰 Xử lý giảm giá và tổng tiền thực
        let giamGia = "0";
        let tongTienThuc = tongTien;

        if (loaiThanhToan === "100%") {
          giamGia = "10%"; // ✅ Ghi rõ là 10%
          tongTienThuc = tongTien * 0.9; // ✅ Trừ 10% ra
        } else if (loaiThanhToan === "50%") {
          giamGia = "0"; // ❌ Không giảm
          tongTienThuc = tongTien; // ✅ Giữ nguyên
        }

        // 💵 Số tiền khách thanh toán (tùy loại)
        const soTienThanhToan =
          loaiThanhToan === "50%" ? tongTienThuc / 2 : tongTienThuc;

        // 🧩 Tạo dữ liệu gửi API
        const reqBody = {
          MaSan: parsed.MaSan,
          MaKH: parsed.MaKH,
          MaNV: parsed.MaNV || "NV001",
          Thang: parsed.Thang,
          Nam: parsed.Nam,
          TongTien: tongTien, // Tổng gốc
          GiamGia: giamGia, // ✅ Chuỗi "10%" hoặc "0"
          TongTienThuc: tongTienThuc, // ✅ Tổng sau giảm giá
          SoTienThanhToan: soTienThanhToan,
          LoaiThanhToan: loaiThanhToan,
          LoaiDat: "Đặt sân tháng",
          TenKH: tenKHThang,
          SDT: sdtThang,
          NgayDat: parsed.NgayDat,
          GioVao: parsed.GioVao,
          GioRa: parsed.GioRa,
          GhiChu: parsed.GhiChu || tenKHThang,
          TongGio: parsed.TongGio,
        };

        console.log("✅ Dữ liệu gửi API đặt sân tháng:", reqBody);

        // 🚀 Gửi API
        const res = await fetch("http://localhost:3000/api/santhang/book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reqBody),
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Lỗi đặt sân tháng!");

        alert("✅ Đặt sân tháng thành công!");
        localStorage.removeItem("bookingData");
        window.location.href = "/";
      } catch (err) {
        console.error("❌ Lỗi đặt sân tháng:", err);
        alert(err.message);
      }
    }

    // ===============================
    // 🌟 Xử lý đặt sân ngày
    // ===============================
    else {
      try {
        if (!tenKhach?.trim() || !sdt?.trim()) {
          alert("Vui lòng nhập đầy đủ họ tên và SĐT cho sân ngày!");
          return;
        }

        const grouped = {};
        parsed.selectedSlots?.forEach((s) => {
          let courtName = courts[s.courtIndex];
          if (courtName === "TT") courtName = "Sân TT";
          const hour = openingHour + s.slotIndex;
          const date = parsed.date || new Date().toLocaleDateString("vi-VN");
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
                const gioVaoStr = `${String(start).padStart(2, "0")}:00`;
                const gioRaStr = `${String(end + 1).padStart(2, "0")}:00`;
                const tongTienSan = tinhTienTheoGio(
                  courtName,
                  gioVaoStr,
                  gioRaStr
                );
                requests.push({
                  MaSan: `S${courts.indexOf(courtName) + 1}`,
                  MaKH: selectedKhachHangId,
                  MaNV: "NV001",
                  GioVao: `${gioVaoStr}:00`,
                  GioRa: `${gioRaStr}:00`,
                  TongGio: soGio,
                  TongTien: tongTienSan,
                  GiamGia: 0,
                  TongTienThuc: tongTienSan,
                  GhiChu: "",
                  LoaiDat: "Đặt sân ngày",
                  NgayLap: date,
                });
                start = hours[i];
                end = hours[i];
              }
            }
          });
        });

        console.log("🧾 Danh sách yêu cầu gửi đặt sân ngày:", requests);

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
        window.location.href = "/";
      } catch (err) {
        console.error("❌ Lỗi đặt sân:", err);
        alert(err.message || "❌ Lỗi đặt sân!");
      }
    }
  };

  // ==== RENDER ====
  return (
    <div className="xacnhan-container">
      <Sidebar />
      <div className="xacnhan-content">
        <h1>{isDatSanThang ? "Xác nhận đặt sân tháng" : "Xác nhận đặt sân"}</h1>

        {/* Nếu là đặt sân tháng */}
        {isDatSanThang ? (
          <div className="info-group">
            {/* Thông tin khách hàng và đặt sân tháng */}
            <div className="info-grid">
              {/* Cột 1 + 2: Thông tin khách hàng */}
              <div className="info-col info-customer">
                <div className="grid-row">
                  <div className="grid-label">Họ và tên:</div>
                  <div className="grid-value" title="Click để chỉnh sửa">
                    {thongTinThang.TenKH || tenKhach}
                  </div>
                </div>
                <div className="grid-row">
                  <div className="grid-label">SĐT:</div>
                  <div className="grid-value" title="Click để chỉnh sửa">
                    {thongTinThang.SDT || sdt}
                  </div>
                </div>
                <div className="grid-row">
                  <div className="grid-label">Tháng:</div>
                  <div className="grid-value">
                    {thongTinThang.Thang} / {thongTinThang.Nam}
                  </div>
                </div>
                <div className="grid-row">
                  <div className="grid-label">Sân:</div>
                  <div className="grid-value">
                    {thongTinThang.MaSan?.join(", ")}
                  </div>
                </div>
              </div>

              {/* Cột 3: Mã QR */}
              <div className="info-col info-qr">
                <img src={mbBank} alt="QR Thanh toán" className="qr-image" />
                <p className="qr-note">Quét mã QR để thanh toán</p>
              </div>

              {/* Cột 4: Thông tin tài khoản */}
              <div className="info-col info-bank">
                <h3>Thông tin chuyển khoản</h3>
                <p>
                  <b>Tên tài khoản:</b> Nguyen Trung Nguyen
                </p>
                <p>
                  <b>Số tài khoản:</b> 0345137842
                </p>
                <p>
                  <b>Ngân hàng:</b> MB Bank
                </p>
              </div>
            </div>

            <table className="table-san-thang">
              <thead>
                <tr>
                  <th>Tên sân</th>
                  <th>Ngày</th>
                  <th>Thứ</th>
                  <th>Giờ bắt đầu</th>
                  <th>Giờ kết thúc</th>
                  <th>Giá / giờ</th>
                  <th>Tổng</th>
                </tr>
              </thead>
              <tbody>
                {thongTinThang.MaSan?.flatMap((maSan, i) =>
                  thongTinThang.NgayDat?.map((ngay, j) => {
                    const date = new Date(ngay);
                    const thuVN = [
                      "CN",
                      "Hai",
                      "Ba",
                      "Tư",
                      "Năm",
                      "Sáu",
                      "Bảy",
                    ][date.getDay()];

                    const gioVao = thongTinThang.GioVao;
                    const gioRa = thongTinThang.GioRa;

                    // ✅ Chuẩn hóa tên sân TT
                    const courtName =
                      maSan === "TT" || maSan === "STT" ? "Sân TT" : maSan;

                    // ✅ Tính tổng tiền thực tế theo giờ
                    const tong = tinhTienTheoGio(courtName, gioVao, gioRa);

                    // ✅ Tính giá trung bình / giờ để hiển thị (tuỳ ý)
                    const soGio =
                      parseInt(gioRa.split(":")[0]) -
                      parseInt(gioVao.split(":")[0]);
                    const giaGio = Math.round(tong / soGio);

                    return (
                      <tr key={`${i}-${j}`}>
                        <td>{courtName}</td>
                        <td>{ngay}</td>
                        <td>{thuVN}</td>
                        <td>{gioVao}</td>
                        <td>{gioRa}</td>
                        <td>{giaGio.toLocaleString()}đ</td>
                        <td className="tongTien">{tong.toLocaleString()}đ</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* ✅ Khu vực tính tổng tiền & loại thanh toán */}
            <div className="total-summary">
              <label>Loại thanh toán:</label>
              <select
                value={loaiThanhToan}
                onChange={(e) => setLoaiThanhToan(e.target.value)}
              >
                <option value="50%">Cọc 50%</option>
                <option value="100%">Thanh toán 100% (Giảm 10%)</option>
              </select>

              <div className="price-summary">
                <p>
                  <b>Tổng tiền:</b> {Number(tongTienSan || 0).toLocaleString()}đ
                </p>

                {loaiThanhToan === "100%" && (
                  <>
                    <p>
                      <b>Giảm 10%:</b> -{Number(giamGia || 0).toLocaleString()}đ
                    </p>
                    <p className="total">
                      <b>Khách cần thanh toán:</b>{" "}
                      {Number(tongTienThuc || 0).toLocaleString()}đ
                    </p>
                  </>
                )}

                {loaiThanhToan === "50%" && (
                  <>
                    <p>
                      <b>Khách cần thanh toán (50%):</b>{" "}
                      {Number(soTienThanhToan || 0).toLocaleString()}đ
                    </p>
                    <p>
                      <b>Còn lại:</b>{" "}
                      {Number(
                        tongTienSan - soTienThanhToan || 0
                      ).toLocaleString()}
                      đ
                    </p>
                  </>
                )}
              </div>

              <button
                className="btn-confirm"
                onClick={() => xacNhanDatSan(isDatSanThang ? "thang" : "ngay")}
              >
                {isDatSanThang
                  ? "✅ Xác nhận đặt sân tháng"
                  : "✅ Xác nhận đặt sân"}
              </button>
            </div>
          </div>
        ) : (
          // Giữ nguyên phần giao diện sân lẻ
          <>
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
                    const tong = san.gia; // đã tính tổng sẵn trong danhSachSan
                    return (
                      <tr key={index}>
                        <td>{san.ten}</td>
                        <td>{san.loai}</td>
                        <td>{san.ngay}</td>
                        <td>{san.batDau}</td>
                        <td>{san.ketThuc}</td>
                        <td>
                          {san.soGio
                            ? (san.gia / san.soGio).toLocaleString()
                            : "-"}
                          đ
                        </td>
                        <td className="tongTien">
                          {san.gia?.toLocaleString() || "0"}đ
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="total">
                Tổng cộng: {tongTien.toLocaleString()}đ
              </div>
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

              {/* Dịch vụ thêm */}
              <div className="info-group">
                <h2>Dịch vụ thêm</h2>
                <button
                  className="btn-add-service"
                  onClick={() =>
                    setDichVuList([...dichVuList, { ten: "", gia: "" }])
                  }
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
                {/* <button className="btn-confirm" onClick={xacNhanDatSan}>
                  {isDatSanThang
                    ? "Xác nhận đặt sân tháng"
                    : "Xác nhận đặt sân"}
                </button> */}
                <button
                  className="btn-confirm"
                  onClick={() =>
                    xacNhanDatSan(isDatSanThang ? "thang" : "ngay")
                  }
                >
                  {isDatSanThang
                    ? "✅ Xác nhận đặt sân tháng"
                    : "✅ Xác nhận đặt sân"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
