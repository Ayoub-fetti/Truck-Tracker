const Trip = require("../models/Trip");
const Truck = require("../models/Truck");
const PDFDocument = require("pdfkit");

exports.createTrip = async (req, res) => {
  const trip = await Trip.create(req.body);
  await Truck.findByIdAndUpdate(trip.truck, { statut: "en_service" });
  res.status(201).json(trip);
};

exports.getTrips = async (req, res) => {
  const { statut, chauffeur, truck } = req.query;
  const filter = {};
  if (statut) filter.statut = statut;
  if (chauffeur) filter.chauffeur = chauffeur;
  if (truck) filter.truck = truck;

  const trips = await Trip.find(filter)
    .populate("truck", "immatriculation marque")
    .populate("trailer", "immatriculation")
    .populate("chauffeur", "nom email");
  res.json(trips);
};

exports.getTrip = async (req, res) => {
  const trip = await Trip.findById(req.params.id)
    .populate("truck", "immatriculation marque")
    .populate("trailer", "immatriculation")
    .populate("chauffeur", "nom email");
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  res.json(trip);
};

exports.updateTrip = async (req, res) => {
  const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  res.json(trip);
};

exports.updateTripStatus = async (req, res) => {
  const { statut, kilometrageArrivee, dateArrivee } = req.body;
  const trip = await Trip.findById(req.params.id);
  if (!trip) return res.status(404).json({ message: "Trip not found" });

  trip.statut = statut;
  if (kilometrageArrivee) trip.kilometrageArrivee = kilometrageArrivee;
  if (dateArrivee) trip.dateArrivee = dateArrivee;

  if (statut === "terminé") {
    await Truck.findByIdAndUpdate(trip.truck, {
      statut: "disponible",
      kilometrage: kilometrageArrivee,
    });
  }

  await trip.save();
  res.json(trip);
};

exports.deleteTrip = async (req, res) => {
  const trip = await Trip.findByIdAndDelete(req.params.id);
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  res.json({ message: "Trip deleted" });
};

exports.generateTripPDF = async (req, res) => {
  const trip = await Trip.findById(req.params.id)
    .populate("truck", "immatriculation marque modele")
    .populate("trailer", "immatriculation")
    .populate("chauffeur", "nom email");

  if (!trip) return res.status(404).json({ message: "Trip not found" });

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=trip-${trip._id}.pdf`
  );

  doc.pipe(res);

  doc.fontSize(20).text("Rapport de Trajet", { align: "center" });
  doc.moveDown();
  doc.fontSize(12);
  doc.text(
    `Camion: ${trip.truck.immatriculation} - ${trip.truck.marque} ${trip.truck.modele}`
  );
  if (trip.trailer) doc.text(`Remorque: ${trip.trailer.immatriculation}`);
  doc.text(`Chauffeur: ${trip.chauffeur.nom}`);
  doc.text(`Départ: ${trip.depart}`);
  doc.text(`Destination: ${trip.destination}`);
  doc.text(`Date départ: ${trip.dateDepart.toLocaleDateString()}`);
  if (trip.dateArrivee)
    doc.text(`Date arrivée: ${trip.dateArrivee.toLocaleDateString()}`);
  doc.text(`Kilométrage départ: ${trip.kilometrageDepart} km`);
  if (trip.kilometrageArrivee)
    doc.text(`Kilométrage arrivée: ${trip.kilometrageArrivee} km`);
  if (trip.distanceParcourue)
    doc.text(`Distance parcourue: ${trip.distanceParcourue} km`);
  doc.text(`Statut: ${trip.statut}`);
  if (trip.marchandise) doc.text(`Marchandise: ${trip.marchandise}`);

  doc.end();
};
