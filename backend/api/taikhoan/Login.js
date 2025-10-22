import { db } from "../../config/db.js";

export async function login(req, res) {
  try {
    const { userName, passWord, role } = req.body;

    // Truy vấn tài khoản
    const [accounts] = await db.execute(
      "SELECT * FROM tbl_taikhoan WHERE userName = ? AND passWord = ? AND role = ?",
      [userName, passWord, role]
    );

    if (accounts.length === 0) {
      return res.json({
        success: false,
        message: "Sai tài khoản, mật khẩu hoặc vai trò!",
      });
    }

    const account = accounts[0];

    // 🔹 Nếu là nhân viên hoặc quản lý, lấy thông tin từ tbl_nhanvien
    if (role === "Nhân viên" || role === "Quản lý") {
      const [nvRows] = await db.execute(
        "SELECT maNV, tenNV FROM tbl_nhanvien WHERE maTK = ?",
        [account.maTK]
      );

      if (nvRows.length > 0) {
        account.maNV = nvRows[0].maNV;
        account.tenNV = nvRows[0].tenNV;
      }
    }

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      user: account,
    });

  } catch (err) {
    console.error("❌ Lỗi khi đăng nhập:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
}
