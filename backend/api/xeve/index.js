import express from "express";
import { getAllXeVe } from "./getAllXeVe.js";
import { getXeVe } from "./getXeVe.js";
import { postXeVe } from "./postXeVe.js";
import { putXeVeStatus } from "./putXeVeStatus.js";
import { putXeVe } from "./putXeVe.js";          // ✅ mới thêm
import { deleteXeVe } from "./deleteXeVe.js";    // ✅ mới thêm
import { getXeVeById } from "./getXeVeById.js";

const router = express.Router();

// Lấy toàn bộ sự kiện
router.get("/", getAllXeVe);

// Lấy chi tiết 1 sự kiện theo id
router.get("/:MaXeVe", getXeVe);

// Thêm sự kiện mới
router.post("/", postXeVe);

// Cập nhật trạng thái mở / khóa
router.put("/:MaXeVe/status", putXeVeStatus);

// ✅ Cập nhật toàn bộ thông tin
router.put("/:MaXeVe", putXeVe);

// ✅ Xóa sự kiện
router.delete("/:MaXeVe", deleteXeVe);

router.get("/getXeVeById/:MaXeVe", getXeVeById);

export default router;
