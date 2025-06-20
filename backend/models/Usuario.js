const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  telefono: String,
  carrera: String,
  semestre: { type: String, required: true }, // <-- Añadido el campo semestre
  correo: { type: String, required: true, unique: true },
  password: String,
  verificado: { type: Boolean, default: false },
  tokenVerificacion: { type: String },
  activo: { type: Boolean, default: true }
});

module.exports = mongoose.model('Usuario', usuarioSchema);