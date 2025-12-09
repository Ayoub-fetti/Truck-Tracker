const express = require('express');
const { createTire, getTires, getTire, updateTire, deleteTire } = require('../controllers/TireController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(authorize('admin'), createTire)
  .get(getTires);

router.route('/:id')
  .get(getTire)
  .put(authorize('admin'), updateTire)
  .delete(authorize('admin'), deleteTire);

module.exports = router;
