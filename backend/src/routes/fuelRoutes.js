const express = require('express');
const { createFuelLog, getFuelLogs, getFuelLog, getConsumptionStats, deleteFuelLog } = require('../controllers/FuelController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createFuelLog)
  .get(getFuelLogs);

router.get('/stats/:truck', getConsumptionStats);

router.route('/:id')
  .get(getFuelLog)
  .delete(authorize('admin'), deleteFuelLog);

module.exports = router;
