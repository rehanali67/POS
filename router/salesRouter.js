// routes/salesRoutes.js
import express from 'express';
import salesController from '../controllers/salesControllers.js';

const router = express.Router();

router.post('/sales', salesController.createSale);
router.get('/sales', salesController.getSales);
router.get('/sales/:saleId', salesController.getSaleById); // Add this route

export default router;
