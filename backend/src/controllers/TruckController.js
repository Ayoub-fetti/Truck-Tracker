const Truck = require("../models/Truck");

exports.createTruck = async (req, res) => {
  const { immatriculation, marque, modele } = req.body;

  if (!immatriculation || !marque || !modele) {
    res.status(400).json({ message: "required files missing" });
  }

  const truck = await Truck.create(req.body);
  res.status(201).json(truck);
};

exports.getTrucks = async (req, res) => {
  const { statut, chauffeurAssigne } = req.query;
  const filter = {};
  if (statut) filter.statut = statut;
  if (chauffeurAssigne) filter.chauffeurAssigne = chauffeurAssigne;

  const trucks = await Truck.find(filter).populate(
    "chauffeurAssigne",
    "nom email"
  );
  res.json(trucks);
};

exports.getTruck = async (req, res) => {
  const truck = await Truck.findById(req.params.id).populate(
    "chauffeurAssigne",
    "nom email"
  );
  if (!truck) return res.status(404).json({ message: "Truck not found" });
  res.json(truck);
};

exports.updateTruck = async (req, res) => {
  const truck = await Truck.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!truck) return res.status(404).json({ message: "Truck not found" });
  res.json(truck);
};

exports.deleteTruck = async (req, res) => {
  const truck = await Truck.findByIdAndDelete(req.params.id);
  if (!truck) return res.status(404).json({ message: "Truck not found" });
  res.json({ message: "Truck deleted" });
};
