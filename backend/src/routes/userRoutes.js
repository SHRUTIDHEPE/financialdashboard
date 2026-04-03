const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { restrictTo, PERMISSIONS } = require('../middleware/roleCheck');
const { validateUserUpdate, validateUserId } = require('../middleware/Validation');

const router = express.Router();

// All user routes require authentication and admin role
router.use(protect);
router.use(restrictTo(...PERMISSIONS.MANAGE_USERS));

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', validateUserId, getUser);
router.put('/:id', validateUserUpdate, updateUser);
router.delete('/:id', validateUserId, deleteUser);

module.exports = router;