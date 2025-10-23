import { db } from "../../config/db.js";

export async function loginKhachHang(req, res) {
  try {
    const { userName, passWord } = req.body;

    // 1️⃣ Kiểm tra tài khoản trong bảng tbl_taikhoankhachhang
    const [accountRows] = await db.execute(
      "SELECT * FROM tbl_taikhoankhachhang WHERE userName = ? AND passWord = ?",
      [userName, passWord]
    );

    if (accountRows.length === 0) {
      return res.json({
        success: false,
        message: "Sai tài khoản hoặc mật khẩu",
      });
    }

    const account = accountRows[0];
    const customerId = account.id; // Lấy id từ tbl_taikhoankhachhang

    // 2️⃣ Lấy thông tin khách hàng từ tbl_khachhang dựa trên id
    const [customerRows] = await db.execute(
      "SELECT TenKh FROM tbl_khachhang WHERE id = ?",
      [customerId]
    );

    const customerName = customerRows.length > 0 ? customerRows[0].TenKh : userName;

    // 3️⃣ Trả về thông tin khách hàng (bao gồm tên)
    res.json({
      success: true,
      message: "Đăng nhập khách hàng thành công",
      user: {
        ...account,   // thông tin tài khoản
        TenKh: customerName, // thêm tên khách hàng
      },
    });
  } catch (err) {
    console.error("❌ Lỗi khi đăng nhập khách hàng:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
  
}
export async function getKhachHangProfile(req, res) {
  try {
    // Nhận id từ query params. Đây là ID từ tbl_taikhoankhachhang, 
    // và bạn dùng nó làm khóa ngoại trong tbl_khachhang.
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        // SỬA: Thông báo lỗi phải phản ánh biến đang được sử dụng
        message: "Thiếu ID tài khoản khách hàng.", 
      });
    }

    // Lấy tất cả thông tin từ tbl_khachhang
    const [rows] = await db.execute(
      // SỬA: Thay MaKH bằng id
      "SELECT * FROM tbl_khachhang WHERE id = ?",
      [id] // SỬA: Truyền biến id vào đây
    );

    if (rows.length > 0) {
      res.json({
        success: true,
        customer: rows[0], // Trả về toàn bộ thông tin khách hàng
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin khách hàng tương ứng.",
      });
    }
  } catch (err) {
    console.error("❌ Lỗi khi lấy thông tin khách hàng:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
}
export const updateCustomerProfile = async (req, res) => {
  const { id } = req.query; // id khách hàng
  const { TenKh, SDT, email, DiaChi, GioiTinh } = req.body;

  if (!id) return res.status(400).json({ success: false, message: "Thiếu id khách hàng" });

  try {
    // 🔹 Cập nhật tbl_khachhang
    const sqlKh = `UPDATE tbl_khachhang 
                   SET TenKh=?, SDT=?, email=?, DiaChi=?, GioiTinh=? 
                   WHERE id=?`;
    await db.execute(sqlKh, [TenKh, SDT, email, DiaChi, GioiTinh, id]);

    // 🔹 Cập nhật TenKh, SDT, email trong tbl_taikhoankhachhang
    const sqlTK = `UPDATE tbl_taikhoankhachhang 
                   SET TenKh=?, SDT=?, email=? 
                   WHERE id=?`;
    await db.execute(sqlTK, [TenKh, SDT, email, id]);

    res.json({ success: true, message: "Cập nhật thông tin khách hàng thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
