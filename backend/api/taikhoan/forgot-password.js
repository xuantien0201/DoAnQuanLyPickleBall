import { db } from "../../config/db.js";

export async function forgotPassword(req, res) {
  const { role, email, maTK } = req.body;

  try {
    if (role === "Nhân viên") {
      // 🔹 Kiểm tra tài khoản nhân viên
      const [rows] = await db.execute(
        "SELECT * FROM tbl_taikhoan WHERE maTK = ? AND role = 'Nhân viên'",
        [maTK]
      );

      if (rows.length === 0) {
        return res.json({
          success: false,
          message: "Không tìm thấy tài khoản nhân viên hoặc mã tài khoản không hợp lệ",
        });
      }

      // 🔹 Reset mật khẩu về mặc định
      await db.execute(
        "UPDATE tbl_taikhoan SET passWord = ? WHERE maTK = ?",
        ["123456", maTK]
      );

      return res.json({
        success: true,
        message: "Đặt lại mật khẩu nhân viên thành công (mặc định: 123456)",
      });

    } else if (role === "Quản lý") {
      // 🔹 Kiểm tra tài khoản quản lý/admin
      const [rowsAdmin] = await db.execute(
        "SELECT * FROM tbl_taikhoan WHERE maTK = ? AND role = 'Quản lý'",
        [maTK]
      );

      if (rowsAdmin.length === 0) {
        return res.json({
          success: false,
          message: "Không tìm thấy tài khoản Quản lý hoặc mã tài khoản không hợp lệ",
        });
      }

      // 🔹 Reset mật khẩu về mặc định
      await db.execute(
        "UPDATE tbl_taikhoan SET passWord = ? WHERE maTK = ?",
        ["123456", maTK]
      );

      return res.json({
        success: true,
        message: "Đặt lại mật khẩu Quản lý thành công (mặc định: 123456)",
      });

    } else if (role === "Khách hàng") {
      // 🔹 Kiểm tra email trong bảng tài khoản khách hàng
      const [rowsKH] = await db.execute(
        "SELECT * FROM tbl_taikhoankhachhang WHERE email = ?",
        [email]
      );

      if (rowsKH.length === 0) {
        return res.json({
          success: false,
          message: "Email không tồn tại trong hệ thống khách hàng",
        });
      }

      // 🔹 Reset mật khẩu về mặc định
      await db.execute(
        "UPDATE tbl_taikhoankhachhang SET passWord = ? WHERE email = ?",
        ["123456", email]
      );

      return res.json({
        success: true,
        message: "Đặt lại mật khẩu khách hàng thành công (mặc định: 123456)",
      });

    } else {
      return res.json({
        success: false,
        message: "Vai trò không hợp lệ",
      });
    }
  } catch (error) {
    console.error("❌ Lỗi khi đặt lại mật khẩu:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi đặt lại mật khẩu",
    });
  }
}
