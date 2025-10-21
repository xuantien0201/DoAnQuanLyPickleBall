import express from 'express';
import getAllOrdersRouter from './getAllOrders.js';
import putOrderStatusRouter from './putOrderStatus.js';

const router = express.Router();

router.use('/', getAllOrdersRouter);
router.use('/', putOrderStatusRouter);

export default router;