import { db } from "../../config/db.js";

export async function postDatSan(req, res) {
  try {
    const {
      MaSan,
      MaKH,
      MaNV,
      GioVao,
      GioRa,
      TongGio,
      TongTien,
      GiamGia,
      TongTienThuc,
      GhiChu,
      LoaiDat,
      NgayLap,
    } = req.body;

    // ✅ Kiểm tra thông tin bắt buộc
    if (!MaSan || !MaKH || !MaNV || !GioVao || !GioRa || !NgayLap) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin bắt buộc khi đặt sân!" });
    }

    // ✅ Chuẩn hóa dữ liệu giờ
    const gioVaoFormat = GioVao.length === 8 ? GioVao : `${GioVao}:00`;
    const gioRaFormat = GioRa.length === 8 ? GioRa : `${GioRa}:00`;

    // ✅ Kiểm tra trùng giờ (đã có người đặt sân này trong cùng ngày)
    const [checkExist] = await db.execute(
      `SELECT * FROM tbl_datsan 
       WHERE MaSan = ? AND NgayLap = ? 
       AND (
         (GioVao <= ? AND GioRa > ?) OR 
         (GioVao < ? AND GioRa >= ?)
       )`,
      [MaSan, NgayLap, gioVaoFormat, gioVaoFormat, gioRaFormat, gioRaFormat]
    );

    if (checkExist.length > 0) {
      return res
        .status(400)
        .json({ message: "Khung giờ này đã được đặt, vui lòng chọn giờ khác!" });
    }

    // ✅ Thêm mới dữ liệu đặt sân
    const [result] = await db.execute(
      `INSERT INTO tbl_datsan 
      (MaSan, MaKH, MaNV, GioVao, GioRa, TongGio, TongTien, GiamGia, TongTienThuc, GhiChu, LoaiDat, NgayLap)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        MaSan,
        MaKH,
        MaNV,
        gioVaoFormat,
        gioRaFormat,
        TongGio || 1,
        TongTien || 0,
        GiamGia || 0,
        TongTienThuc || TongTien || 0,
        GhiChu || "",
        LoaiDat || "Đặt sân ngày",
        NgayLap,
      ]
    );

    res.json({
      message: "✅ Đặt sân thành công",
      insertedId: result.insertId,
    });
  } catch (err) {
    console.error("❌ Lỗi khi đặt sân:", err);
    res.status(500).json({
      message: "Lỗi khi đặt sân",
      error: err.message,
    });
  }
}
