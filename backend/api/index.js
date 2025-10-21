import express from "express";
import khachhangRouter from "./khachhang/index.js";
import sanRouter from "./san/index.js"; // nếu có
import xeveRouter from "./xeve/index.js"; // nếu có

import adminRouter from './admin/index.js';
import customersRouter from './customers/index.js';

import orderRouter from './customers/orders/index.js';

const router = express.Router();

router.use('/admin', adminRouter);
router.use('/customers', customersRouter);

router.use('/orders', orderRouter);

router.use("/khachhang", khachhangRouter);
router.use("/san", sanRouter);
router.use("/xeve", xeveRouter);

export default router;

// index tổng