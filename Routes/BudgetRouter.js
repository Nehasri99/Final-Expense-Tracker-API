// In Backend/Routes/BudgetRouter.js
const router = require('express').Router();
const { setBudget, getBudgets } = require('../controllers/BudgetController');

// Route to get all budgets for the user
router.get('/', getBudgets);

// Route to set/update a budget
router.post('/', setBudget);

module.exports = router;