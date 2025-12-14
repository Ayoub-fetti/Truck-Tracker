const Trailer = require("../models/Trailer");

exports.createTrailer = async (req, res) => {
  const trailer = await Trailer.create(req.body);
  res.status(201).json(trailer);
};

exports.getTrailers = async (req, res) => {
  const { statut, truckAttache } = req.query;
  const filter = {};
  if (statut) filter.statut = statut;
  if (truckAttache) filter.truckAttache = truckAttache;

  const trailers = await Trailer.find(filter).populate(
    "truckAttache",
    "immatriculation"
  );
  res.json(trailers);
};

exports.getTrailer = async (req, res) => {
  const trailer = await Trailer.findById(req.params.id).populate(
    "truckAttache",
    "immatriculation"
  );
  if (!trailer) return res.status(404).json({ message: "Trailer not found" });
  res.json(trailer);
};

exports.updateTrailer = async (req, res) => {
  const trailer = await Trailer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!trailer) return res.status(404).json({ message: "Trailer not found" });
  res.json(trailer);
};

exports.deleteTrailer = async (req, res) => {
  const trailer = await Trailer.findByIdAndDelete(req.params.id);
  if (!trailer) return res.status(404).json({ message: "Trailer not found" });
  res.json({ message: "Trailer deleted" });
};
