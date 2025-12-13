const Maintenance = require('../models/Maintenance');
const Truck = require('../models/Truck');
const Trailer = require('../models/Trailer');

// const MAINTENANCE_RULES = {
//   kilometrage: 10000,
//   jours: 90
// };

// exports.setMaintenanceRules = async (req, res) => {
//   const { kilometrage, jours } = req.body;
//   if (kilometrage) MAINTENANCE_RULES.kilometrage = kilometrage;
//   if (jours) MAINTENANCE_RULES.jours = jours;
//   res.json({ message: 'Rules updated', rules: MAINTENANCE_RULES });
// };

// exports.getMaintenanceRules = async (req, res) => {
//   res.json(MAINTENANCE_RULES);
// };

exports.createMaintenance = async (req, res) => {
  const maintenance = await Maintenance.create(req.body);
  
  const Model = maintenance.vehiculeType === 'Truck' ? Truck : Trailer;
  await Model.findByIdAndUpdate(maintenance.vehicule, { statut: 'maintenance' });
  
  res.status(201).json(maintenance);
};

exports.getMaintenances = async (req, res) => {
  const { vehicule, vehiculeType, statut } = req.query;
  const filter = {};
  if (vehicule) filter.vehicule = vehicule;
  if (vehiculeType) filter.vehiculeType = vehiculeType;
  if (statut) filter.statut = statut;
  
  const maintenances = await Maintenance.find(filter).populate('vehicule').sort({ dateMaintenance: -1 });
  res.json(maintenances);
};

exports.getMaintenance = async (req, res) => {
  const maintenance = await Maintenance.findById(req.params.id).populate('vehicule');
  if (!maintenance) return res.status(404).json({ message: 'Maintenance not found' });
  res.json(maintenance);
};

exports.updateMaintenance = async (req, res) => {
  const maintenance = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!maintenance) return res.status(404).json({ message: 'Maintenance not found' });
  
  if (req.body.statut === 'terminée') {
    const Model = maintenance.vehiculeType === 'Truck' ? Truck : Trailer;
    await Model.findByIdAndUpdate(maintenance.vehicule, { statut: 'disponible' });
  }
  
  res.json(maintenance);
};

exports.deleteMaintenance = async (req, res) => {
  const maintenance = await Maintenance.findByIdAndDelete(req.params.id);
  if (!maintenance) return res.status(404).json({ message: 'Maintenance not found' });
  res.json({ message: 'Maintenance deleted' });
};

// exports.checkMaintenanceNeeded = async (req, res) => {
//   const trucks = await Truck.find({ statut: { $ne: 'maintenance' } });
//   const trailers = await Trailer.find({ statut: { $ne: 'maintenance' } });
//   const needed = [];
  
//   for (const truck of trucks) {
//     const lastMaintenance = await Maintenance.findOne({ vehicule: truck._id, vehiculeType: 'Truck' })
//       .sort({ dateMaintenance: -1 });
    
//     if (!lastMaintenance || 
//         truck.kilometrage - (lastMaintenance.kilometrage || 0) >= MAINTENANCE_RULES.kilometrage ||
//         Date.now() - lastMaintenance.dateMaintenance > MAINTENANCE_RULES.jours * 24 * 60 * 60 * 1000) {
      
//       const maintenance = await Maintenance.create({
//         vehicule: truck._id,
//         vehiculeType: 'Truck',
//         type: 'révision',
//         description: 'Maintenance automatique - seuil atteint',
//         kilometrage: truck.kilometrage,
//         statut: 'planifiée'
//       });
//       needed.push(maintenance);
//     }
//   }
  
//   for (const trailer of trailers) {
//     const lastMaintenance = await Maintenance.findOne({ vehicule: trailer._id, vehiculeType: 'Trailer' })
//       .sort({ dateMaintenance: -1 });
    
//     if (!lastMaintenance || 
//         trailer.kilometrage - (lastMaintenance.kilometrage || 0) >= MAINTENANCE_RULES.kilometrage ||
//         Date.now() - lastMaintenance.dateMaintenance > MAINTENANCE_RULES.jours * 24 * 60 * 60 * 1000) {
      
//       const maintenance = await Maintenance.create({
//         vehicule: trailer._id,
//         vehiculeType: 'Trailer',
//         type: 'révision',
//         description: 'Maintenance automatique - seuil atteint',
//         kilometrage: trailer.kilometrage,
//         statut: 'planifiée'
//       });
//       needed.push(maintenance);
//     }
//   }
  
//   res.json({ message: `${needed.length} maintenances créées`, maintenances: needed });
// };
