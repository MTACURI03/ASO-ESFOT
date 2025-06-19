const mongoose = require('mongoose');

const finanzaSchema = new mongoose.Schema({
  saldo: { type: Number, default: 0 }
});

module.exports = mongoose.model('Finanza', finanzaSchema);