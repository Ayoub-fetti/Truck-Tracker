const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  truck: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck', required: true },
  trailer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trailer' },
  chauffeur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  depart: { type: String, required: true },
  destination: { type: String, required: true },
  dateDepart: { type: Date, required: true },
  dateArrivee: Date,
  kilometrageDepart: { type: Number, required: true },
  kilometrageArrivee: Number,
  distanceParcourue: Number,
  statut: { type: String, enum: ['planifié', 'en_cours', 'terminé', 'annulé'], default: 'planifié' },
  marchandise: String
}, { timestamps: true });

tripSchema.pre('save', function(next) {
  if (this.kilometrageArrivee && this.kilometrageDepart) {
    this.distanceParcourue = this.kilometrageArrivee - this.kilometrageDepart;
  }
  next();
});

module.exports = mongoose.model('Trip', tripSchema);
