import { db } from "../../../config/db.js";

export async function postDatVe(req, res) {
  try {
    const { MaXeVe, MaKH, NguoiLap, SoLuongSlot, GhiChu, ThoiGianDangKy } = req.body;

    if (!MaXeVe || !MaKH)
      return res.status(400).json({ message: "Thiếu mã xé vé hoặc mã khách hàng" });

    const [result] = await db.execute(
      `INSERT INTO tbl_xeve_datve 
        (MaXeVe, MaKH, NguoiLap, SoLuongSlot, GhiChu, ThoiGianDangKy)
       VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        MaXeVe,
        MaKH,
        NguoiLap || null,
        SoLuongSlot || 1,
        GhiChu || "",
        ThoiGianDangKy || new Date(),
      ]
    );

    res.json({
      message: "✅ Đặt vé thành công",
      insertedId: result.insertId,
    });
  } catch (err) {
    console.error("❌ Lỗi khi đặt vé:", err);
    res.status(500).json({
      message: "Lỗi khi đặt vé",
      error: err.message,
    });
  }
}
