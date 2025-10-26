// File: Backend/Routes/ExpenseRouter.js

// ✅ Make sure getSpendingInsights is included in this import list
const { 
    fetchExpenses, 
    addExpenses, 
    deleteExpenses, 
    fetchExpensesByDateRange, 
    getSpendingInsights,
    exportExpenses 
} = require('../controllers/ExpenseController');

const router = require('express').Router();

router.get('/', fetchExpenses);
router.post('/', addExpenses);
router.delete('/:expenseId', deleteExpenses);
router.get('/date-range', fetchExpensesByDateRange);
router.get('/export', exportExpenses);
router.get('/insights', getSpendingInsights);

module.exports = router;