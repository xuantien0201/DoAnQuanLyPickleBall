import mysql from "mysql2/promise";

export const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pickleball",
});

// ✅ Kiểm tra kết nối
try {
  await db.connect;
  console.log("✅ Kết nối MySQL thành công!");
} catch (err) {
  console.error("❌ Lỗi kết nối MySQL:", err.message);
}
