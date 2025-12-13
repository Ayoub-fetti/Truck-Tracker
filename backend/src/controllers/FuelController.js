const FuelLog = require('../models/FuelLog');
const Truck = require('../models/Truck');

exports.createFuelLog = async (req, res) => {
  const { truck, kilometrage, chauffeur } = req.body;
  
  const lastLog = await FuelLog.findOne({ truck }).sort({ kilometrage: -1 });
  
  const fuelLogData = {
    ...req.body,
    chauffeur: (req.user.role === 'admin' && chauffeur) ? chauffeur : req.user._id
  };
  
  const fuelLog = await FuelLog.create(fuelLogData);
  
  if (lastLog) {
    const distance = kilometrage - lastLog.kilometrage;
    if (distance > 0) {
      fuelLog.consommationMoyenne = (fuelLog.quantite / distance) * 100;
      await fuelLog.save();
    }
  }
  
  await Truck.findByIdAndUpdate(truck, { kilometrage });
  res.status(201).json(fuelLog);
};

exports.getFuelLogs = async (req, res) => {
  const { truck, chauffeur } = req.query;
  const filter = {};
  if (truck) filter.truck = truck;
  if (chauffeur) filter.chauffeur = chauffeur;
  
  const logs = await FuelLog.find(filter)
    .populate('truck', 'immatriculation')
    .populate('chauffeur', 'nom')
    .sort({ date: -1 });
  res.json(logs);
};

exports.getFuelLog = async (req, res) => {
  const log = await FuelLog.findById(req.params.id)
    .populate('truck', 'immatriculation')
    .populate('chauffeur', 'nom');
  if (!log) return res.status(404).json({ message: 'Fuel log not found' });
  res.json(log);
};

// exports.getConsumptionStats = async (req, res) => {
//   const { truck } = req.params;
//   const logs = await FuelLog.find({ truck }).sort({ date: -1 }).limit(10);
  
//   const avgConsumption = logs.reduce((sum, log) => sum + (log.consommationMoyenne || 0), 0) / logs.length;
//   const totalFuel = logs.reduce((sum, log) => sum + log.quantite, 0);
//   const totalCost = logs.reduce((sum, log) => sum + log.cout, 0);
  
//   res.json({ avgConsumption, totalFuel, totalCost, logs });
// };

exports.deleteFuelLog = async (req, res) => {
  const log = await FuelLog.findByIdAndDelete(req.params.id);
  if (!log) return res.status(404).json({ message: 'Fuel log not found' });
  res.json({ message: 'Fuel log deleted' });
};
