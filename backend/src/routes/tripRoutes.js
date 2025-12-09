const express = require('express');
const { createTrip, getTrips, getTrip, updateTrip, updateTripStatus, deleteTrip, generateTripPDF } = require('../controllers/TripController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(authorize('admin'), createTrip)
  .get(getTrips);

router.route('/:id')
  .get(getTrip)
  .put(authorize('admin'), updateTrip)
  .delete(authorize('admin'), deleteTrip);

router.patch('/:id/status', updateTripStatus);
router.get('/:id/pdf', generateTripPDF);

module.exports = router;
