import express from 'express';
import postOrderRouter from './postOrder.js';
import getOrderByCodeRouter from './getOrderByCode.js';

const router = express.Router();

// Use individual routers
router.use('/', postOrderRouter); // Handles POST /
router.use('/', getOrderByCodeRouter); // Handles GET /:orderCode

export default router;