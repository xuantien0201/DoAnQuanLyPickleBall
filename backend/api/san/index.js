import express from "express";
import { getAllSan } from "./getAllSan.js";
import { postDatSan, uploadPaymentScreenshot } from "./postDatSan.js";

const router = express.Router();

router.get("/", getAllSan);
// Thêm upload.single("PaymentScreenshot") giống TTXeVe
router.post("/book", uploadPaymentScreenshot.single("PaymentScreenshot"), postDatSan);

export default router;