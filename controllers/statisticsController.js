import Expense from '../models/Expense.js';
import Sale from '../models/Sale.js';

// Get statistics
const getStatistics = async (req, res) => {
  try {
    // Get the date for 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Aggregate sales data for the last 7 days
    const salesData = await Sale.aggregate([
      {
        $match: {
          timestamp: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          total: { $sum: "$totalPrice" }
        }
      },
      { $sort: { _id: 1 } } // Sort by date
    ]);

    // Aggregate expenses data for the last 7 days
    const expensesData = await Expense.aggregate([
      {
        $match: {
          date: { $gte: sevenDaysAgo }
        }
      },
      { 
        $group: { 
          _id: null, 
          total: { $sum: '$price' } 
        } 
      }
    ]);

    res.status(200).json({
      success: true,
      statistics: {
        sales: salesData,
        expenses: expensesData[0] ? expensesData[0].total : 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export default {
  getStatistics
};
