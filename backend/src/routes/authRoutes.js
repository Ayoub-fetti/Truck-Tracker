const express = require('express');
const { register, login } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { authorize: roleAuth } = require('../middleware/roleMiddleware');

const router = express.Router();

// router.post('/register', protect, roleAuth('admin'), register);
router.post('/register', register);
router.post('/login', login);

module.exports = router;
