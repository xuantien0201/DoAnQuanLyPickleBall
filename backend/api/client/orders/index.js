import express from 'express';
import postOrderRouter from './postOrder.js';
import getOrderByCodeRouter from './getOrderByCode.js';
import getOrderHistoryRouter from './getOrderHistory.js'; // Import route mới

const router = express.Router();

// Use individual routers
router.use('/', postOrderRouter); // Handles POST /
router.use('/', getOrderHistoryRouter); 
router.use('/', getOrderByCodeRouter); // Handles GET /:orderCode

export default router;