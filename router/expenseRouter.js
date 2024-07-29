import express from 'express';
import expenseController from '../controllers/expenseController.js';

const router = express.Router();

// Route to get all expenses
router.get('/', expenseController.getExpenses);

// Route to add a new expense
router.post('/', expenseController.addExpense);

router.delete('/:id', expenseController.deleteExpense);

export default router;
