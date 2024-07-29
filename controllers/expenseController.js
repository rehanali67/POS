import Expense from '../models/Expense.js';

// Get all expenses
const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ date: -1 });
        res.status(200).json({ success: true, expenses });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Add a new expense
const addExpense = async (req, res) => {
    const { title, description, price } = req.body;

    if (!title || !description || !price) {
        return res.status(400).json({ success: false, message: 'Please fill all fields.' });
    }

    if (isNaN(price) || price <= 0) {
        return res.status(400).json({ success: false, message: 'Price must be a positive number.' });
    }

    const expense = new Expense({
        title,
        description,
        price,
        date: new Date()
    });

    try {
        await expense.save();
        res.status(201).json({ success: true, expense });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Delete an expense by ID
const deleteExpense = async (req, res) => {
    const expenseId = req.params.id;

    try {
        const result = await Expense.findByIdAndDelete(expenseId);

        if (!result) {
            return res.status(404).json({ success: false, message: 'Expense not found.' });
        }

        res.status(200).json({ success: true, message: 'Expense deleted successfully.' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export default {
    getExpenses,
    addExpense,
    deleteExpense
};
