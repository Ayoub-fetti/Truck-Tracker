const mongoose = require('mongoose');

const tireSchema = new mongoose.Schema({
  vehicule: { type: mongoose.Schema.Types.ObjectId, refPath: 'vehiculeType', required: true },
  vehiculeType: { type: String, enum: ['Truck', 'Trailer'], required: true },
  position: { type: String, required: true },
  marque: String,
  etat: { type: String, enum: ['neuf', 'bon', 'moyen', 'usé', 'à_changer'], default: 'bon' },
  pressionRecommandee: Number,
  dateInstallation: { type: Date, default: Date.now },
  kilometrageInstallation: Number
}, { timestamps: true });

module.exports = mongoose.model('Tire', tireSchema);
