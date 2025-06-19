const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  telefono: String,
  carrera: String,
  correo: { type: String, required: true, unique: true },
  password: String,
  verificado: { type: Boolean, default: false },
  tokenVerificacion: { type: String },
});

module.exports = mongoose.model('Usuario', usuarioSchema);