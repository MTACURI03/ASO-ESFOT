const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  telefono: String,
  carrera: String,
  semestre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  password: String,
  verificado: { type: Boolean, default: false },
  tokenVerificacion: { type: String },
  activo: { type: Boolean, default: true },
  rol: { type: String, enum: ['admin'], default: 'admin' }
});

module.exports = mongoose.model('Admin', adminSchema, 'admins');