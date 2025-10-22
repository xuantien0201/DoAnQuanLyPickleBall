import { db } from "../../../config/db.js";

export async function postDatVe(req, res) {
  try {
    const { MaXeVe, MaKH, NguoiLap, SoLuongSlot, GhiChu, ThoiGianDangKy } = req.body;

    if (!MaXeVe || !MaKH || !SoLuongSlot) {
      return res.status(400).json({ success: false, message: "Thiếu dữ liệu bắt buộc" });
    }

    const [result] = await db.execute(
      "INSERT INTO tbl_xeve_datve (MaXeVe, MaKH, NguoiLap, SoLuongSlot, GhiChu, ThoiGianDangKy) VALUES (?, ?, ?, ?, ?, ?)",
      [MaXeVe, MaKH, NguoiLap, SoLuongSlot, GhiChu, ThoiGianDangKy]
    );

    res.json({ success: true, message: "✅ Đặt vé thành công", insertedId: result.insertId });
  } catch (err) {
    console.error("❌ Lỗi khi thêm đặt vé:", err);
    res.status(500).json({ success: false, message: "Lỗi khi thêm đặt vé", error: err.message });
  }
}
