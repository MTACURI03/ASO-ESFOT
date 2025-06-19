const mongoose = require('mongoose');
const gastoSchema = new mongoose.Schema({
  descripcion: String,
  monto: Number,
  fecha: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Gasto', gastoSchema);