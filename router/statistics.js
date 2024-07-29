import express from 'express';
import statisticsController from '../controllers/statisticsController.js';

const router = express.Router();

// Route to get statistics data
router.get('/', statisticsController.getStatistics);

export default router;
