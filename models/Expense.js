import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
