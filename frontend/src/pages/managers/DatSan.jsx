import React, { useEffect, useState } from "react";
import "../../css/DatSan.css";
import { Sidebar } from "../../components/Sidebar";
import { Link } from "react-router";

export function DatSan() {
  const openingHour = 5;
  const closingHour = 24;
  const slotMinutes = 60;

  const [courts, setCourts] = useState([]); // dữ liệu sân từ API
  const [bookedSlots, setBookedSlots] = useState({}); // { courtIndex: [slotIndex, ...] }
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const API_BASE = "http://localhost:3000/api/san";

  const timeSlots = () => {
    const total = (closingHour - openingHour) * (60 / slotMinutes);
    return Array.from({ length: total }, (_, i) => i);
  };

  const slotToLabel = (i) => {
    const minutes = openingHour * 60 + i * slotMinutes;
    const h = String(Math.floor(minutes / 60)).padStart(2, "0");
    const m = String(minutes % 60).padStart(2, "0");
    return `${h}:${m}`;
  };

  // =================== Fetch sân & booked từ API ===================
  const fetchCourts = async (date) => {
    try {
      const url = date ? `${API_BASE}?date=${date}` : API_BASE;
      const resCourts = await fetch(url);
      if (!resCourts.ok) throw new Error("Lỗi khi lấy danh sách sân");
      let courtsData = await resCourts.json();

      // Sắp xếp sân theo số
      const lower = courtsData.filter((c) => +c.MaSan.replace(/\D/g, "") < 10);
      const higher = courtsData.filter(
        (c) => +c.MaSan.replace(/\D/g, "") >= 10
      );
      courtsData = [...lower, ...higher];
      setCourts(courtsData);

      // Xử lý dữ liệu đặt chỗ
      const booked = {};
      courtsData.forEach((court, ci) => {
        booked[ci] = [];
        court.bookedSlots.forEach((slot) => {
          const [startH, startM] = slot.GioVao.split(":").map(Number);
          const [endH, endM] = slot.GioRa.split(":").map(Number);
          const startIndex = Math.floor(
            (startH * 60 + startM - openingHour * 60) / slotMinutes
          );
          const endIndex = Math.floor(
            (endH * 60 + endM - openingHour * 60) / slotMinutes
          );
          for (let i = startIndex; i < endIndex; i++) booked[ci].push(i);
        });
      });
      setBookedSlots(booked);
    } catch (err) {
      console.error("❌ Lỗi lấy dữ liệu sân/booked:", err);
    }
  };

  // 🔄 Tự động fetch lại khi selectedDate thay đổi
  useEffect(() => {
    fetchCourts(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // =================== Render lưới sân ===================
  const buildGrid = () => {
    const gridEl = document.getElementById("grid");
    if (!gridEl) return;
    gridEl.innerHTML = "";

    const slots = timeSlots();

    // ==== Header ====
    const headWrapper = document.createElement("div");
    headWrapper.className = "grid-head-wrapper";
    const head = document.createElement("div");
    head.className = "grid-head";

    const blank = document.createElement("div");
    blank.className = "hcell side";
    blank.textContent = "Sân / Giờ";
    head.appendChild(blank);

    slots.forEach((i) => {
      const h = document.createElement("div");
      h.className = "hcell";
      h.textContent = slotToLabel(i);
      head.appendChild(h);
    });

    headWrapper.appendChild(head);
    gridEl.appendChild(headWrapper);

    // ==== Rows ====
    const rowsWrapper = document.createElement("div");
    rowsWrapper.className = "grid-rows-wrapper";

    courts.forEach((court, ci) => {
      const row = document.createElement("div");
      row.className = "row";

      const side = document.createElement("div");
      side.className = "cell side";
      side.textContent = court.TenSan || `Sân ${ci + 1}`;
      row.appendChild(side);

      slots.forEach((i) => {
        const cell = document.createElement("div");
        cell.className = "cell slot avail";
        cell.dataset.court = ci;
        cell.dataset.slot = i;

        // ==== đánh dấu các slot đã booked ====
        if (bookedSlots[ci] && bookedSlots[ci].includes(i)) {
          cell.classList.remove("avail");
          cell.classList.add("booked"); // màu đỏ
        }

        cell.addEventListener("click", () => onSelect(cell));
        row.appendChild(cell);
      });

      rowsWrapper.appendChild(row);
    });

    gridEl.appendChild(rowsWrapper);
  };

  useEffect(() => {
    if (courts.length > 0) buildGrid();
  }, [courts, bookedSlots]);

  const getSlotPrice = (courtName, slotIndex) => {
    const hour = openingHour + slotIndex;
    const isAfter16h = hour >= 16;
    if (courtName === "Sân TT") return isAfter16h ? 200000 : 150000;
    return isAfter16h ? 160000 : 100000;
  };

  const onSelect = (cell) => {
    const ci = +cell.dataset.court;
    const si = +cell.dataset.slot;
    if (cell.classList.contains("booked")) return; // không chọn được ô đã đặt

    const courtName = courts[ci].TenSan || `Sân ${ci + 1}`;

    setSelectedSlots((prev) => {
      const exists = prev.some(
        (s) => s.courtIndex === ci && s.slotIndex === si
      );
      let updated;
      if (exists) {
        cell.classList.remove("selected");
        cell.classList.add("avail");
        updated = prev.filter(
          (s) => !(s.courtIndex === ci && s.slotIndex === si)
        );
      } else {
        cell.classList.remove("avail");
        cell.classList.add("selected");
        updated = [...prev, { courtIndex: ci, slotIndex: si }];
      }

      const newTotal = updated.reduce(
        (sum, s) =>
          sum +
          getSlotPrice(
            courts[s.courtIndex].TenSan || `Sân ${s.courtIndex + 1}`,
            s.slotIndex
          ),
        0
      );
      setTotal(newTotal);

      return updated;
    });
  };

  const handleConfirm = () => {
    if (selectedSlots.length === 0) {
      alert("Vui lòng chọn ít nhất 1 sân giờ trước khi xác nhận!");
      return;
    }

    const dataToSend = {
      selectedSlots,
      total,
      date: selectedDate,
      bookingType: document.getElementById("type").value || "Đặt sân ngày",
    };
    localStorage.setItem("bookingData", JSON.stringify(dataToSend));
    window.location.href = "/xacnhansan";
  };

  return (
    <div className="dat-san-wrapper">
      <Sidebar />
      <div className="container">
        <header>
          <div className="left">
            <div className="brand">Pickleball Bồ Đề</div>

            <div className="control">
              <label>Ngày</label>
              <input
                id="date"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>

            <div className="control">
              <label>Hình thức đặt sân</label>
              <select id="type">
                <option>Đặt sân ngày</option>
                <option>Đặt sân cố định</option>
                <option>Xé vé</option>
              </select>
            </div>
          </div>

          <div className="right legend">
            <span className="dot a"></span>
            <small>Còn trống</small>
            <span className="dot b"></span>
            <small>Đang chờ</small>
            <span className="dot c"></span>
            <small>Đã đặt</small>
            <span className="dot d hide-sm"></span>
            <small className="hide-sm">Sự kiện</small>
          </div>
        </header>

        <div className="grid-wrapper" id="grid"></div>

        <div className="confirm-area">
          <div className="total">Tổng: {total.toLocaleString("vi-VN")} đ</div>
          <button className="btn-confirm" onClick={handleConfirm}>
            <Link to="/xacnhansan"></Link>
            XÁC NHẬN
          </button>
        </div>
      </div>
    </div>
  );
}

// đây là file mới sau khi thay đổi