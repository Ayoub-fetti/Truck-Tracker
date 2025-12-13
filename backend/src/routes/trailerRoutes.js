const express = require('express');
const { createTrailer, getTrailers, getTrailer, updateTrailer, deleteTrailer } = require('../controllers/TrailerController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(authorize('admin'), createTrailer)
  .get(getTrailers);

router.route('/:id')
  .get(getTrailer)
  .put(authorize('admin'), updateTrailer)
  .delete(authorize('admin'), deleteTrailer);

module.exports = router;
