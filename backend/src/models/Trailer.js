const mongoose = require('mongoose');

const trailerSchema = new mongoose.Schema({
  immatriculation: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  capacite: Number,
  kilometrage: { type: Number, default: 0 },
  statut: { type: String, enum: ['disponible', 'en_service', 'maintenance'], default: 'disponible' },
  truckAttache: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck' }
}, { timestamps: true });

module.exports = mongoose.model('Trailer', trailerSchema);
