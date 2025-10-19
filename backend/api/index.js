import express from "express";
import khachhangRouter from "./khachhang/index.js";
import sanRouter from "./san/index.js"; // nếu có
import xeveRouter from "./xeve/index.js"; // nếu có

import adminRouter from './admin.js';
import productRouter from './products.js';
import categoryRouter from './categories.js';
import cartRouter from './cart.js';
import orderRouter from './orders.js';

const router = express.Router();

router.use('/admin', adminRouter);
router.use('/products', productRouter);
router.use('/categories', categoryRouter);
router.use('/cart', cartRouter);
router.use('/orders', orderRouter);

router.use("/khachhang", khachhangRouter);
router.use("/san", sanRouter);
router.use("/xeve", xeveRouter);

export default router;

// index tổng