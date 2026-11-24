const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');
const { login, signUp, resetPassword, getDashboardStats, getRecentRegisters, generateLoginLink, magicLogin } = require('../controllers/authController/AuthController');

router.post('/signup', signUp);
router.post('/login', login);
router.post("/reset-password", resetPassword);
router.get("/dashboardstats", getDashboardStats);
router.get("/recentregisters", getRecentRegisters);
router.post('/magic-login', magicLogin);
router.post('/generate-login-link', authenticateToken, generateLoginLink);

module.exports = router;