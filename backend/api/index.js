import express from "express";
import khachhangRouter from "./khachhang/index.js";
import sanRouter from "./san/index.js"; // nếu có
import xeveRouter from "./xeve/index.js"; // nếu có
import sanThangRouter from "./santhang/index.js"

import adminRouter from './admin/index.js';
import customersRouter from './client/index.js';

import orderRouter from './client/orders/index.js';
import nhanvienRouter from "./nhanvien/index.js"; 
import calamRouter from "./calam/index.js";
import taikhoanRouter from "./taikhoan/index.js";
const router = express.Router();

router.use('/admin', adminRouter);
router.use('/client', customersRouter);

router.use("/khachhang", khachhangRouter);
router.use("/san", sanRouter);
router.use("/xeve", xeveRouter);
router.use("/santhang", sanThangRouter);
router.use("/nhanvien", nhanvienRouter);
router.use("/calam", calamRouter);
router.use("/taikhoan", taikhoanRouter);

export default router;

// index tổng