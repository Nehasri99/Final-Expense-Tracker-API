const UserModel = require("../Models/User");
const { Parser } = require('json2csv');
// In the addExpenses function
const addExpenses = async (req, res) => {
    try {
        // ✅ Destructure the new 'paymentMethod' field from the request
        const { text, amount, category, date, paymentMethod } = req.body;

        // ✅ Build the new expense object, including the payment method
        const newExpense = {
            text,
            amount,
            category,
            paymentMethod // Add the new field here
        };

        if (date) {
            newExpense.date = new Date(date);
        }
        
        const userData = await UserModel.findByIdAndUpdate(
            req.user._id, 
            { $push: { expenses: newExpense } }, 
            { new: true }
        );

        return res.status(200).json({ message: "Expenses Added successfully", success: true, data: userData?.expenses });

    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: err, success: false });
    }
};

const fetchExpenses = async (req, res) => {
    try {
        const userData = await UserModel.findById(req.user._id).select('expenses');
        return res.status(200).json({ message: "Expenses Fetched successfully", success: true, data: userData?.expenses });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: err, success: false });
    }
};

const deleteExpenses = async (req, res) => {
    try {
        const userData = await UserModel.findByIdAndUpdate(req.user._id, { $pull: { expenses: { _id: req.params.expenseId } } }, { new: true });
        return res.status(200).json({ message: "Expenses Deleted successfully", success: true, data: userData?.expenses });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: err, success: false });
    }
};

const fetchExpensesByDateRange = async (req, res) => {
    const { _id } = req.user;
    const { startDate, endDate } = req.query;

    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        const userData = await UserModel.findById(_id).select('expenses');
        if (!userData) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        const filteredExpenses = userData.expenses.filter(expense => {
            // ✅ FIX: Use 'expense.date' which matches your updated model
            const expenseDate = new Date(expense.date);
            return expenseDate >= start && expenseDate <= end;
        });
        return res.status(200).json({
            message: "Expenses Fetched Successfully",
            success: true,
            data: filteredExpenses
        });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: err.message, success: false });
    }
};

const getSpendingInsights = async (req, res) => {
    try {
        const userId = req.user._id;
        const now = new Date();
        const startOfAveragePeriod = new Date(now.getFullYear(), now.getMonth() - 3, 1);

        const aggregationPipeline = [
            { $match: { _id: userId } },
            { $unwind: "$expenses" },
            {
                $match: {
                    // ✅ FIX: Use 'expenses.date' here to match your model
                    "expenses.date": { $gte: startOfAveragePeriod },
                    "expenses.amount": { $lt: 0 }
                }
            },
            {
                $group: {
                    _id: {
                        category: "$expenses.category",
                        // ✅ FIX: And use 'expenses.date' here as well
                        year: { $year: "$expenses.date" },
                        month: { $month: "$expenses.date" }
                    },
                    totalAmount: { $sum: { $abs: "$expenses.amount" } }
                }
            },
            {
                $group: {
                    _id: "$_id.category",
                    monthlyTotals: {
                        $push: {
                            month: "$_id.month",
                            year: "$_id.year",
                            total: "$totalAmount"
                        }
                    }
                }
            }
        ];

        const results = await UserModel.aggregate(aggregationPipeline);
        const insights = [];
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        results.forEach(result => {
            const category = result._id;
            if (!category) return;
            let currentMonthTotal = 0;
            let previousMonthsTotals = [];
            result.monthlyTotals.forEach(monthData => {
                if (monthData.month === currentMonth && monthData.year === currentYear) {
                    currentMonthTotal = monthData.total;
                } else {
                    previousMonthsTotals.push(monthData.total);
                }
            });
            if (previousMonthsTotals.length > 0) {
                const average = previousMonthsTotals.reduce((a, b) => a + b, 0) / previousMonthsTotals.length;
                const difference = ((currentMonthTotal - average) / average) * 100;
                if (difference > 20) {
                    insights.push(`Heads up! Your spending on '${category}' is ${Math.round(difference)}% higher than your 3-month average.`);
                } else if (difference < -20) {
                    insights.push(`Good job! Your spending on '${category}' is ${Math.round(Math.abs(difference))}% lower than your 3-month average.`);
                }
            }
        });

        return res.status(200).json({ success: true, data: insights });

    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: err.message, success: false });
    }
};
const exportExpenses = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const userData = await UserModel.findById(req.user._id).select('expenses');
        
        let expensesToExport = userData.expenses;

        // If date range is provided, filter the expenses
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            
            expensesToExport = userData.expenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate >= start && expenseDate <= end;
            });
        }
        
        // Define the columns for your CSV file
        const fields = ['date', 'text', 'category', 'amount', 'paymentMethod'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(expensesToExport);

        // Set the headers to tell the browser to download the file
        res.header('Content-Type', 'text/csv');
        res.attachment('expenses.csv');
        return res.send(csv);

    } catch (err) {
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};

module.exports = {
    addExpenses,
    fetchExpenses,
    deleteExpenses,
    fetchExpensesByDateRange,
    getSpendingInsights,
    exportExpenses
};
