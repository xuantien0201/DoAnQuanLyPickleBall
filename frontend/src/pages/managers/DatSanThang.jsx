import { Sidebar } from "../../components/Sidebar";
import "../../css/DatSanThang.css";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export function DatSanThang() {
  const [activeTab, setActiveTab] = useState("weekday");
  const navigate = useNavigate();

  // ===== Khách hàng =====
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTen, setSearchTen] = useState([]);
  const [searchSdt, setSearchSdt] = useState([]);
  const typingTimeout = useRef(null);

  const API_BASE = "http://localhost:3000/api/khachhang";

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
      console.error("Lỗi tìm khách hàng:", err);
    }
  };

  useEffect(() => {
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(
      () => timKiemKhachHang(customerName, "ten"),
      300
    );
  }, [customerName]);

  useEffect(() => {
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(
      () => timKiemKhachHang(customerPhone, "sdt"),
      300
    );
  }, [customerPhone]);

  const chonKhach = (ten, phone, id) => {
    setCustomerName(ten);
    setCustomerPhone(phone);
    setSelectedCustomer({ id });
    setSearchTen([]);
    setSearchSdt([]);
  };

  const themKhachHang = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert("Vui lòng nhập đầy đủ họ tên và số điện thoại!");
      return;
    }
    if (!/^\d{10}$/.test(customerPhone)) {
      alert("Số điện thoại không hợp lệ (10 số)!");
      return;
    }
    try {
      const newId = `KH${Date.now()}`;
      const res = await fetch(`${API_BASE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newId,
          TenKh: customerName,
          SDT: customerPhone,
          DiaChi: "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi thêm khách hàng!");
      setSelectedCustomer({ id: newId });
      alert("✅ Thêm khách hàng thành công!");
    } catch (err) {
      console.error(err);
      alert(err.message || "❌ Lỗi thêm khách hàng!");
    }
  };

  // ===== Chọn sân =====
  const courts = [
    "S1",
    "S2",
    "S3",
    "S4",
    "S5",
    "S6",
    "S7",
    "S8",
    "S9",
    "S10",
    "S11",
    "S12",
    "S13",
    "S14",
    "S15",
    "STT",
  ];
  const [selectedCourts, setSelectedCourts] = useState([]);

  const toggleCourt = (court) => {
    setSelectedCourts((prev) =>
      prev.includes(court) ? prev.filter((c) => c !== court) : [...prev, court]
    );
  };

  // ===== Ngày/Tháng/Năm =====
  const monthNames = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  const years = ["2025"];
  const [month, setMonth] = useState("01");
  const [year, setYear] = useState("2025");
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [weekdayChecked, setWeekdayChecked] = useState([]);
  const [dayChecked, setDayChecked] = useState([]);

  useEffect(() => {
    const total = dayjs(`${year}-${month}-01`).daysInMonth();
    setDaysInMonth(Array.from({ length: total }, (_, i) => i + 1));
  }, [month, year]);

  const weekdays = [
    { label: "Thứ 2", value: 2 },
    { label: "Thứ 3", value: 3 },
    { label: "Thứ 4", value: 4 },
    { label: "Thứ 5", value: 5 },
    { label: "Thứ 6", value: 6 },
    { label: "Thứ 7", value: 7 },
    { label: "Chủ nhật", value: 1 },
  ];

  const toggleWeekday = (day) => {
    setWeekdayChecked((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };
  const toggleDay = (day) => {
    setDayChecked((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // ===== Giờ =====
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // ===== Xác nhận đặt sân (chuyển trang review) =====
  const handleConfirm = async () => {
    const name = customerName.trim();
    const phone = customerPhone.trim();

    if (!name || !phone) {
      alert("Vui lòng nhập tên và số điện thoại khách hàng");
      return;
    }

    let customerId = selectedCustomer?.id || `KH${Date.now()}`;

    if (selectedCourts.length === 0) {
      alert("Vui lòng chọn ít nhất 1 sân");
      return;
    }
    if (!startTime || !endTime) {
      alert("Vui lòng chọn giờ bắt đầu và giờ kết thúc");
      return;
    }

    const start =
      parseInt(startTime.split(":")[0], 10) +
      parseInt(startTime.split(":")[1], 10) / 60;
    const end =
      parseInt(endTime.split(":")[0], 10) +
      parseInt(endTime.split(":")[1], 10) / 60;
    const tongGio = end - start;
    if (tongGio <= 0) {
      alert("Giờ kết thúc phải lớn hơn giờ bắt đầu");
      return;
    }

    let danhSachNgay = [];
    if (activeTab === "weekday") {
      if (weekdayChecked.length === 0) {
        alert("Vui lòng chọn ít nhất 1 thứ trong tuần");
        return;
      }
      const totalDays = dayjs(`${year}-${month}-01`).daysInMonth();
      for (let d = 1; d <= totalDays; d++) {
        const date = dayjs(`${year}-${month}-${d}`);
        const thu = date.day() === 0 ? 1 : date.day() + 1;
        if (weekdayChecked.includes(thu)) {
          danhSachNgay.push(date.format("YYYY-MM-DD"));
        }
      }
    } else {
      if (dayChecked.length === 0) {
        alert("Vui lòng chọn ít nhất 1 ngày trong tháng");
        return;
      }
      danhSachNgay = dayChecked.map((d) =>
        dayjs(`${year}-${month}-${d}`).format("YYYY-MM-DD")
      );
    }

    if (danhSachNgay.length === 0) {
      alert("Không có ngày nào hợp lệ để đặt sân!");
      return;
    }

    const payload = {
      MaSan: selectedCourts,
      MaKH: customerId,
      TenKH: name,
      SDT: phone,
      MaNV: "NV001",
      GioVao: startTime,
      GioRa: endTime,
      TongGio: tongGio,
      TongTien: 0,
      GiamGia: 0,
      TongTienThuc: 0,
      GhiChu: name,
      LoaiDat: "Đặt sân tháng",
      Thang: parseInt(month),
      Nam: parseInt(year),
      NgayDat: danhSachNgay,
    };

    // 👉 Chuyển sang trang xác nhận & truyền toàn bộ payload
    console.log("✅ Payload gửi sang trang xác nhận:", payload);

    // 🧩 Lưu dữ liệu vào localStorage trước khi chuyển
    localStorage.setItem("bookingData", JSON.stringify(payload));

    // Điều hướng đến trang xác nhận
    navigate("/xacnhansan");
  };

  // ===== RENDER =====
  return (
    <div className="santhang-container">
      <Sidebar />
      <div className="santhang-content">
        <div className="st-header">Đặt sân tháng</div>
        <h2>Thông tin lịch đặt</h2>

        {/* Khách hàng */}
        <div className="form-group">
          <label>Tên khách hàng:</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => {
              setCustomerName(e.target.value);
              setSelectedCustomer(null);
            }}
            placeholder="Nhập tên khách"
          />
          {searchTen.length > 0 && (
            <div className="st-suggestions">
              {searchTen.slice(0, 5).map((c) => (
                <div
                  key={c.id ?? c.ID}
                  className="st-suggestion-item"
                  onClick={() => chonKhach(c.TenKh, c.SDT, c.id ?? c.ID)}
                >
                  {c.TenKh} - {c.SDT}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>SĐT khách hàng:</label>
          <input
            type="text"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="Nhập số điện thoại"
          />
          {searchSdt.length > 0 && (
            <div className="st-suggestions">
              {searchSdt.slice(0, 5).map((c) => (
                <div
                  key={c.id ?? c.ID}
                  className="st-suggestion-item"
                  onClick={() => chonKhach(c.TenKh, c.SDT, c.id ?? c.ID)}
                >
                  {c.SDT} - {c.TenKh}
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="btn-add-customer" onClick={themKhachHang}>
          + Thêm khách hàng mới
        </button>

        {/* Tabs */}
        <div className="tabs">
          <div
            className={`tab ${activeTab === "weekday" ? "active" : ""}`}
            onClick={() => setActiveTab("weekday")}
          >
            Đặt theo thứ
          </div>
          <div
            className={`tab ${activeTab === "day" ? "active" : ""}`}
            onClick={() => setActiveTab("day")}
          >
            Đặt theo ngày
          </div>
        </div>

        {/* Nội dung */}
        {activeTab === "weekday" ? (
          <div className="content">
            <div className="st-row">
              <div className="form-group">
                <label>Chọn tháng:</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  {monthNames.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Chọn năm:</label>
                <select value={year} onChange={(e) => setYear(e.target.value)}>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Chọn thứ trong tuần:</label>
              <div className="weekday-grid">
                {weekdays.map((d) => (
                  <label key={d.value}>
                    <input
                      type="checkbox"
                      checked={weekdayChecked.includes(d.value)}
                      onChange={() => toggleWeekday(d.value)}
                    />
                    {d.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="content">
            <div className="st-row">
              <div className="form-group">
                <label>Chọn tháng:</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  {monthNames.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Chọn năm:</label>
                <select value={year} onChange={(e) => setYear(e.target.value)}>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Chọn ngày trong tháng:</label>
              <div className="days-grid">
                {daysInMonth.map((d) => (
                  <label key={d}>
                    <input
                      type="checkbox"
                      checked={dayChecked.includes(d)}
                      onChange={() => toggleDay(d)}
                    />
                    {d}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sân + Giờ */}
        <div className="form-group">
          <label>Chọn sân:</label>
          <div className="court-grid">
            {courts.map((c) => (
              <label key={c}>
                <input
                  type="checkbox"
                  checked={selectedCourts.includes(c)}
                  onChange={() => toggleCourt(c)}
                />
                {c}
              </label>
            ))}
          </div>
        </div>

        <div className="time-group">
          <label>Giờ bắt đầu:</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            step="1800"
          />
        </div>
        <div className="time-group">
          <label>Giờ kết thúc:</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            step="1800"
          />
        </div>

        <div className="action-area">
          <button className="btn btn-primary" onClick={handleConfirm}>
            Xác nhận đặt sân
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => window.location.reload()}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
