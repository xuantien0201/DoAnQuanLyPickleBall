import { db } from "../../config/db.js";

// Hàm sinh ID ngẫu nhiên (KH + 3 số)
function generateRandomId(prefix = "KH", length = 3) {
  const chars = "0123456789";
  let result = prefix;
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Sinh ID đảm bảo không trùng trong bảng tbl_taikhoankhachhang
async function getUniqueId() {
  let isUnique = false;
  let newId;
  while (!isUnique) {
    newId = generateRandomId();
    const [rows] = await db.execute(
      "SELECT id FROM tbl_taikhoankhachhang WHERE id = ?",
      [newId]
    );
    if (rows.length === 0) isUnique = true;
  }
  return newId;
}

export async function registerKhachHang(req, res) {
  try {
    const { userName, passWord, email, sdt, tenKh } = req.body;

    if (!userName || !passWord || !email || !sdt || !tenKh) {
      return res.json({ success: false, message: "Vui lòng nhập đầy đủ thông tin!" });
    }

    // Kiểm tra trùng trong tbl_taikhoankhachhang
    const [existTK] = await db.execute(
      "SELECT * FROM tbl_taikhoankhachhang WHERE userName = ? OR email = ? OR SDT = ?",
      [userName, email, sdt]
    );

    // Kiểm tra trùng trong tbl_khachhang
    const [existKH] = await db.execute(
      "SELECT * FROM tbl_khachhang WHERE email = ? OR SDT = ?",
      [email, sdt]
    );

    if (existTK.length > 0 || existKH.length > 0) {
      return res.json({
        success: false,
        message: "Tên đăng nhập, email hoặc SĐT đã tồn tại",
      });
    }

    // Sinh ID duy nhất
    const accId = await getUniqueId();

    // Thêm vào tbl_taikhoankhachhang
    await db.execute(
      "INSERT INTO tbl_taikhoankhachhang (id, userName, passWord, email, SDT, TenKh) VALUES (?, ?, ?, ?, ?, ?)",
      [accId, userName, passWord, email, sdt, tenKh]
    );

    // Thêm vào tbl_khachhang cùng ID
    await db.execute(
      "INSERT INTO tbl_khachhang (id, TenKh, SDT, email) VALUES (?, ?, ?, ?)",
      [accId, tenKh, sdt, email]
    );

    res.json({ success: true, message: "Đăng ký khách hàng thành công" });
  } catch (err) {
    console.error("❌ Lỗi khi đăng ký khách hàng:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
}
