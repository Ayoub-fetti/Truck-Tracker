const express = require('express');
const { createTruck, getTrucks, getTruck, updateTruck, deleteTruck } = require('../controllers/TruckController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(authorize('admin'), createTruck)
  .get(getTrucks);

router.route('/:id')
  .get(getTruck)
  .put(authorize('admin'), updateTruck)
  .delete(authorize('admin'), deleteTruck);

module.exports = router;
