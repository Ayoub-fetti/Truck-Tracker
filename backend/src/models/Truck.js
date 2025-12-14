const mongoose = require("mongoose");

const truckSchema = new mongoose.Schema(
  {
    immatriculation: { type: String, required: true, unique: true },
    marque: { type: String, required: true },
    modele: { type: String, required: true },
    kilometrage: { type: Number, default: 0 },
    chauffeurAssigne: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    statut: {
      type: String,
      enum: ["disponible", "en_service", "maintenance"],
      default: "disponible",
    },
    dateMiseEnService: Date,
    derniereRevision: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Truck", truckSchema);
