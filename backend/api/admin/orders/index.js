import express from 'express';
import getAllOrdersRouter from './getAllOrders.js';
import putOrderStatusRouter from './putOrderStatus.js';
import deleteOrderRouter from './deleteOrder.js';

const router = express.Router();

router.use('/', getAllOrdersRouter);
router.use('/', putOrderStatusRouter);
router.use('/', deleteOrderRouter); // ✅ thêm dòng này

export default router;
