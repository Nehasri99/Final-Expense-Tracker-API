const UserModel = require("../Models/User");
const addExpenses = async (req, res) => {
    try {
        const userData = await UserModel.findByIdAndUpdate(req.user._id, { $push: { expenses: req.body } }, { new: true });
        return res.status(200).json({ message: "Expenses Added successfully", success: true, data: userData?.expenses });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: err, success: false });
    }};
const fetchExpenses = async (req, res) => {
    try {
        const userData = await UserModel.findById(req.user._id).select('expenses');
        return res.status(200).json({ message: "Expenses Fetched successfully", success: true, data: userData?.expenses });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: err, success: false });
    }};
const deleteExpenses = async (req, res) => {
    try {
        const userData = await UserModel.findByIdAndUpdate(req.user._id, { $pull: { expenses: { _id: req.params.expenseId } } }, { new: true });
        return res.status(200).json({ message: "Expenses Deleted successfully", success: true, data: userData?.expenses });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: err, success: false });
    }};
    const fetchExpensesByDateRange = async (req, res) => {
        const { _id } = req.user;
        const { startDate, endDate } = req.query; // Get dates from request query parameters
    
        try {
            // Convert string dates to JavaScript Date objects
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // Include the full last day
    
            const userData = await UserModel.findById(_id).select('expenses');
    
            if (!userData) {
                return res.status(404).json({ message: "User not found", success: false });
            }
    
            // Filter expenses in the given date range
            const filteredExpenses = userData.expenses.filter(expense => {
                const expenseDate = new Date(expense.createdAt);
                return expenseDate >= start && expenseDate <= end;
            });
    
            return res.status(200).json({
                message: "Expenses Fetched Successfully",
                success: true,
                data: filteredExpenses
            });
    
        } catch (err) {
            return res.status(500).json({
                message: "Something went wrong",
                error: err.message,
                success: false
            });
        }
    };
    
    module.exports = {
        addExpenses,
        fetchExpenses,
        deleteExpenses,
        fetchExpensesByDateRange // ✅ Added new function
    };