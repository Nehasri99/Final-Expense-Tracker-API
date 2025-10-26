// Routes/UserRoutes.js
const express = require('express');
const router = express.Router();
const { getUserProfile ,changePassword} = require('../controllers/UserController'); // Correct (object export)

// Correct import for the direct export from Auth.js
const ensureAunthenticated = require('../Middlewares/Auth'); 

router.get('/profile', ensureAunthenticated, getUserProfile);
router.put('/change-password', ensureAunthenticated, changePassword);
module.exports = router;