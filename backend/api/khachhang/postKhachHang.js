import { db } from "../../config/db.js";

export async function postKhachHang(req, res) {
  try {
    const { TenKh, SDT, DiaChi, Email } = req.body;

    if (!TenKh || !SDT)
      return res.status(400).json({ message: "Thiếu tên hoặc số điện thoại" });

    const [result] = await db.execute(
      "INSERT INTO tbl_khachhang (TenKh, SDT, DiaChi, Email) VALUES (?, ?, ?, ?)",
      [TenKh, SDT, DiaChi || "", Email || ""]
    );

    res.json({
      message: "✅ Thêm khách hàng thành công",
      insertedId: result.insertId,
    });
  } catch (err) {
    console.error("❌ Lỗi khi thêm khách hàng:", err);
    res.status(500).json({
      message: "Lỗi khi thêm khách hàng",
      error: err.message,
    });
  }
}
