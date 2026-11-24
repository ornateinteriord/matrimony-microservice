const express = require('express');
const router = express.Router();
const PromotersModel = require('../models/promoters/Promoters');
const authenticateToken = require('../middleware/auth.middleware');
const checkRole = require('../middleware/roles.middleware');
const { getUsersByPromoter, getPromoterSentInterests, getPromoterReceivedInterests, getPromoterUserImageVerification, updatePromoterUserImageVerification, addPromoter, getPromoterDashboardData, updatePromoterProfile, activateFreeUserByPromoter } = require('../controllers/promoters/PromotersController');
const { generateLoginLink } = require('../controllers/authController/AuthController');
const { searchUsersByInput } = require('../controllers/profileController');

// Public route to register new promoter
router.post('/register', addPromoter);

// Generate instant one-time login link for user (15 days expiry)
router.post('/generate-login-link', authenticateToken, checkRole("promoter"), generateLoginLink);

// Get real dashboard stats and promoter profile
router.get('/dashboard/:promoter_id', authenticateToken, checkRole("promoter"), getPromoterDashboardData);
router.get('/profile/:promoter_id', authenticateToken, checkRole("promoter"), getPromoterDashboardData);

// Update promoter profile
router.put('/profile/:promoter_id', authenticateToken, checkRole("promoter"), updatePromoterProfile);

// Get all users referred by the logged-in promoter
router.get('/my-users/:promoter_id', authenticateToken, checkRole("promoter"), getUsersByPromoter);

// Get sent interests for users referred by the promoter
router.get('/interests/sent/:promoter_id', authenticateToken, checkRole("promoter"), getPromoterSentInterests);

// Get received interests for users referred by the promoter
router.get('/interests/received/:promoter_id', authenticateToken, checkRole("promoter"), getPromoterReceivedInterests);

// Search profiles for promoter
router.get('/search', authenticateToken, checkRole("promoter"), searchUsersByInput);

// Get image verification pending users for a promoter
router.post('/image-verification/:promoter_id', authenticateToken, checkRole("promoter"), getPromoterUserImageVerification);

// Upgrade user image verification status by promoter
router.put('/upgrade-user/:regno', authenticateToken, checkRole("promoter"), updatePromoterUserImageVerification);

// Activate free user profile by promoter (Sangam-Sathi & Girija-Kalyana only)
router.put('/activate-user/:registration_no', authenticateToken, checkRole("promoter"), activateFreeUserByPromoter);

// Check promocode validity
router.post('/promocheck', async (req, res) => {
  try {
    const { promocode, code, sponsorCode, planType } = req.body;
    const inputCode = promocode || code || sponsorCode;
    
    // Validate input
    if (!inputCode || !inputCode.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Promocode is required'
      });
    }
    
    // Convert promocode to uppercase for consistency
    const upperPromocode = inputCode.trim().toUpperCase();

    // If binding to shree-gandha-server exists and request is for Shree Gandha tenant, forward via binding
    if (process.env.SHREE_GANDHA_SERVER_URL) {
      const tenant = req.projectName || (req.headers && (req.headers['x-project-name'] || req.headers['x-project']));
      if (tenant && tenant.toLowerCase().includes('shree')) {
        try {
          const fetchFn = typeof fetch !== 'undefined' ? fetch : require('node-fetch');
          const targetUrl = new URL('api/promoter/promocheck', process.env.SHREE_GANDHA_SERVER_URL);
          const boundRes = await fetchFn(targetUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-project': tenant,
              'x-project-name': tenant
            },
            body: JSON.stringify(req.body)
          });
          const boundData = await boundRes.json();
          return res.status(boundRes.status).json(boundData);
        } catch (forwardErr) {
          console.warn('Failed forwarding to bound SHREE_GANDHA_SERVER_URL, falling back to local handler:', forwardErr.message);
        }
      }
    }
    
    // Check if promocode exists and is active
    const promoter = await PromotersModel.findOne({ 
      promoter_id: upperPromocode,
      status: 'active'  // Only active promoters' promocodes are valid
    });
    
    if (!promoter) {
      return res.status(400).json({
        success: false,
        message: 'Invalid promocode. Please check and try again.'
      });
    }
    
    // Promocode is valid - return success with discount info and promoter details
    return res.status(200).json({
      success: true,
      message: 'Promocode applied successfully! ₹100 discount applied.',
      data: {
        promocode: upperPromocode,
        code: upperPromocode,
        discount: 100,
        promoterName: promoter.promoter_name,
        isValid: true,
        status: promoter.status
      }
    });
    
  } catch (error) {
    console.error('Promocode check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while checking promocode'
    });
  }
});

module.exports = router;