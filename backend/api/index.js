import express from "express";
import khachhangRouter from "./khachhang/index.js";
import sanRouter from "./san/index.js"; // nếu có
import xeveRouter from "./xeve/index.js"; // nếu có

import adminRouter from './admin/index.js';
import customersRouter from './client/index.js';

import orderRouter from './client/orders/index.js';

const router = express.Router();

router.use('/admin', adminRouter);
router.use('/client', customersRouter);

router.use("/khachhang", khachhangRouter);
router.use("/san", sanRouter);
router.use("/xeve", xeveRouter);

export default router;

// index tổng