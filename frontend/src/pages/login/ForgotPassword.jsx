import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../css/ForgotPassword.css";

export default function ForgotPassword() {
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [maTK, setMaTK] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (role === "employee") {
        // 🔹 Quên mật khẩu nhân viên
        const res = await axios.post("http://localhost:3000/api/taikhoan/forgot-password", {
          role: "Nhân viên",
          maTK,
        });

        if (res.data.success) {
          setMessage("✅ Mật khẩu mới của nhân viên đã được gửi tới email công ty hoặc cập nhật trong hệ thống!");
        } else {
          setMessage("❌ Không tìm thấy mã tài khoản nhân viên!");
        }

      } else if (role === "Quản lý") {
        // 🔹 Quên mật khẩu quản lý
        const res = await axios.post("http://localhost:3000/api/taikhoan/forgot-password", {
          role: "Quản lý",
          maTK,
        });

        if (res.data.success) {
          setMessage("✅ Mật khẩu mới của Quản lý đã được gửi tới email hệ thống!");
        } else {
          setMessage("❌ Không tìm thấy mã tài khoản Quản lý!");
        }

      } else {
        // 🔹 Quên mật khẩu khách hàng
        const res = await axios.post("http://localhost:3000/api/taikhoan/forgot-password", {
          role: "Khách hàng",
          email,
        });

        if (res.data.success) {
          setMessage("✅ Mật khẩu mới đã được gửi tới email của bạn!");
        } else {
          setMessage("❌ Email không tồn tại!");
        }
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
      setMessage("❌ Lỗi kết nối đến server!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box animate-pop">
        <h2>Quên mật khẩu</h2>
        <p>Chọn loại tài khoản để khôi phục mật khẩu.</p>

        {/* 🔹 Chọn loại tài khoản */}
        <div className="role-selector">
          <label className={role === "customer" ? "active" : ""}>
            <input
              type="radio"
              name="role"
              value="customer"
              checked={role === "customer"}
              onChange={() => setRole("customer")}
            />
            Khách hàng
          </label>

          <label className={role === "employee" ? "active" : ""}>
            <input
              type="radio"
              name="role"
              value="employee"
              checked={role === "employee"}
              onChange={() => setRole("employee")}
            />
            Nhân viên
          </label>

          <label className={role === "Quản lý" ? "active" : ""}>
            <input
              type="radio"
              name="role"
              value="Quản lý"
              checked={role === "Quản lý"}
              onChange={() => setRole("Quản lý")}
            />
            Quản lý 
          </label>
        </div>

        {/* 🔹 Form nhập dữ liệu */}
        <form onSubmit={handleSubmit}>
          {role === "customer" ? (
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          ) : (
            <input
              type="text"
              placeholder="Nhập mã tài khoản (maTK)"
              value={maTK}
              onChange={(e) => setMaTK(e.target.value)}
              required
            />
          )}

          <button type="submit">Gửi yêu cầu</button>
        </form>

        {message && <p className="message">{message}</p>}

        <p>
          <Link to="/login">← Quay lại đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
