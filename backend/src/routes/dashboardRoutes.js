const express = require('express');
const {
  getDashboardSummary,
  getMonthlyTrends,
  getWeeklyTrends,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');
const { restrictTo, PERMISSIONS } = require('../middleware/roleCheck');
const { validateDateRange } = require('../middleware/Validation');

const router = express.Router();

// All dashboard routes require authentication and dashboard view permission
router.use(protect);
router.use(restrictTo(...PERMISSIONS.VIEW_DASHBOARD));

router.get('/summary', validateDateRange, getDashboardSummary);
router.get('/trends/monthly', getMonthlyTrends);
router.get('/trends/weekly', getWeeklyTrends);

module.exports = router;