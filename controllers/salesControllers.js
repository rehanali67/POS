import { v4 as uuidv4 } from 'uuid';
import Sale from '../models/Sale.js';

const createSale = async (req, res) => {
    try {
        const { items, totalPrice, amountPaid, change, timestamp } = req.body;
        const saleId = uuidv4();

        const sale = new Sale({
            saleId,
            items,
            totalPrice,
            amountPaid,
            change,
            timestamp
        });

        await sale.save();

        res.status(201).json({ message: 'Sale recorded successfully', sale });
    } catch (error) {
        console.error('Error recording sale:', error);
        res.status(500).json({ message: 'Failed to record sale', error });
    }
};

const getSales = async (req, res) => {
    try {
        // Get the date for 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Fetch sales from the last 7 days
        const sales = await Sale.find({
            timestamp: { $gte: sevenDaysAgo }
        });
        res.status(200).json(sales);
    } catch (error) {
        console.error('Error fetching sales:', error);
        res.status(500).json({ message: 'Failed to fetch sales', error });
    }
};

const getSaleById = async (req, res) => {
    try {
        const saleId = req.params.saleId;

        if (typeof saleId !== 'string') {
            throw new Error(`Invalid saleId: ${saleId}`);
        }

        const sale = await Sale.findOne({ saleId });
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        res.status(200).json(sale);
    } catch (error) {
        console.error('Error fetching sale details:', error);
        res.status(500).json({ message: 'Error fetching sale details', error });
    }
};

export default { createSale, getSales, getSaleById };
