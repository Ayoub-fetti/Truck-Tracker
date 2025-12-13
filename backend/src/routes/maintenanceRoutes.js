const express = require('express');
const { 
  createMaintenance, 
  getMaintenances, 
  getMaintenance, 
  updateMaintenance, 
  deleteMaintenance,
  setMaintenanceRules,
  getMaintenanceRules,
  checkMaintenanceNeeded
} = require('../controllers/MaintenanceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

// router.get('/rules', authorize('admin'), getMaintenanceRules);
// router.put('/rules', authorize('admin'), setMaintenanceRules);
// router.post('/check', authorize('admin'), checkMaintenanceNeeded);

router.route('/')
  .post(authorize('admin'), createMaintenance)
  .get(getMaintenances);

router.route('/:id')
  .get(getMaintenance)
  .put(authorize('admin'), updateMaintenance)
  .delete(authorize('admin'), deleteMaintenance);

module.exports = router;
