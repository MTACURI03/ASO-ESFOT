const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  beneficios: [String],
  imagen: String, // URL o base64
  precio: { type: Number, required: true }
});

module.exports = mongoose.model('Plan', planSchema);