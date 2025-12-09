const mongoose = require('mongoose');

const fuelLogSchema = new mongoose.Schema({
  truck: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck', required: true },
  chauffeur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantite: { type: Number, required: true },
  cout: { type: Number, required: true },
  kilometrage: { type: Number, required: true },
  consommationMoyenne: Number,
  station: String,
  date: { type: Date, default: Date.now }
}, { timestamps: true });

fuelLogSchema.pre('save', function() {
  if (this.quantite && this.kilometrage) {
    this.consommationMoyenne = (this.quantite / this.kilometrage) * 100;
  };
});

module.exports = mongoose.model('FuelLog', fuelLogSchema);
