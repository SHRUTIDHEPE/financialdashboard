const express = require('express');
const {
  getRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
} = require('../controllers/recordController');
const { protect } = require('../middleware/auth');
const { restrictTo, PERMISSIONS } = require('../middleware/roleCheck');
const {
  validateRecordCreate,
  validateRecordUpdate,
  validateRecordId,
  validateRecordFilters,
} = require('../middleware/Validation');

const router = express.Router();

// All record routes require authentication
router.use(protect);

// Routes accessible to Analyst and Admin (view records)
router.get('/', restrictTo(...PERMISSIONS.VIEW_RECORDS), validateRecordFilters, getRecords);
router.get('/:id', restrictTo(...PERMISSIONS.VIEW_RECORDS), validateRecordId, getRecord);

// Routes accessible only to Admin (create, update, delete)
router.post('/', restrictTo(...PERMISSIONS.MANAGE_RECORDS), validateRecordCreate, createRecord);
router.put('/:id', restrictTo(...PERMISSIONS.MANAGE_RECORDS), validateRecordUpdate, updateRecord);
router.delete('/:id', restrictTo(...PERMISSIONS.MANAGE_RECORDS), validateRecordId, deleteRecord);

module.exports = router;