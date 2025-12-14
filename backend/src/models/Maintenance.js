const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    vehicule: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "vehiculeType",
      required: true,
    },
    vehiculeType: { type: String, enum: ["Truck", "Trailer"], required: true },
    type: {
      type: String,
      enum: ["révision", "réparation", "vidange", "pneus", "autre"],
      required: true,
    },
    description: { type: String, required: true },
    cout: Number,
    kilometrage: Number,
    dateMaintenance: { type: Date, default: Date.now },
    prochaineMaintenance: Date,
    statut: {
      type: String,
      enum: ["planifiée", "en_cours", "terminée"],
      default: "planifiée",
    },
    garage: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Maintenance", maintenanceSchema);
