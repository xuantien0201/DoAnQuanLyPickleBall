import { db } from "../../config/db.js";

// 🔹 Đăng nhập khách hàng
export async function loginKhachHang(req, res) {
  try {
    const { userName, passWord } = req.body;

    // Kiểm tra trong bảng tbl_taikhoankhachhang
    const [rows] = await db.execute(
      "SELECT * FROM tbl_taikhoankhachhang WHERE userName = ? AND passWord = ?",
      [userName, passWord]
    );

    if (rows.length > 0) {
      res.json({
        success: true,
        message: "Đăng nhập khách hàng thành công",
        user: rows[0],
      });
    } else {
      res.json({
        success: false,
        message: "Sai tài khoản hoặc mật khẩu",
      });
    }
  } catch (err) {
    console.error("❌ Lỗi khi đăng nhập khách hàng:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
}
