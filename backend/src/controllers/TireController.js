const Tire = require('../models/Tire');

exports.createTire = async (req, res) => {
  const tire = await Tire.create(req.body);
  res.status(201).json(tire);
};

exports.getTires = async (req, res) => {
  const { etat, vehicule, vehiculeType } = req.query;
  const filter = {};
  if (etat) filter.etat = etat;
  if (vehicule) filter.vehicule = vehicule;
  if (vehiculeType) filter.vehiculeType = vehiculeType;
  
  const tires = await Tire.find(filter).populate('vehicule');
  res.json(tires);
};

exports.getTire = async (req, res) => {
  const tire = await Tire.findById(req.params.id).populate('vehicule');
  if (!tire) return res.status(404).json({ message: 'Tire not found' });
  res.json(tire);
};

exports.updateTire = async (req, res) => {
  const tire = await Tire.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!tire) return res.status(404).json({ message: 'Tire not found' });
  res.json(tire);
};

exports.deleteTire = async (req, res) => {
  const tire = await Tire.findByIdAndDelete(req.params.id);
  if (!tire) return res.status(404).json({ message: 'Tire not found' });
  res.json({ message: 'Tire deleted' });
};
