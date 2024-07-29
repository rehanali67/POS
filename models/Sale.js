import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
    saleId: { type: String, required: true, unique: true }, // Ensure uniqueness
    items: [{ 
        name: String,
        code: String,
        price: Number,
        quantity: Number
    }],
    totalPrice: { type: Number, required: true },
    amountPaid: { type: Number, required: true },
    change: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Sale = mongoose.model('Sale', saleSchema);

export default Sale;
