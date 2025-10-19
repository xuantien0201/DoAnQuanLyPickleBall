import express from "express";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from "./api/index.js";

// Cần thiết để lấy __dirname trong ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Middleware để phục vụ file tĩnh từ thư mục 'uploads'
// Điều này rất quan trọng để hiển thị hình ảnh sản phẩm
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Định tuyến API
app.use("/api", apiRouter);

// Kiểm tra server
app.get("/", (req, res) => {
  res.send("✅ Pickleball Backend đang chạy!");
});

const PORT = 3000; // Đổi cổng thành 5000 để khớp với proxy của frontend
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
