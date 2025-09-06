const { fetchExpenses, addExpenses, deleteExpenses, fetchExpensesByDateRange } = require('../controllers/ExpenseController');
const router = require('express').Router();

router.get('/', fetchExpenses);
router.post('/', addExpenses);
router.delete('/:expenseId', deleteExpenses);

// ✅ New Route: Fetch expenses between two dates
router.get('/date-range', fetchExpensesByDateRange);

module.exports = router;
