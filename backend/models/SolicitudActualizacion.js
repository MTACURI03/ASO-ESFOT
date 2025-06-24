const mongoose = require('mongoose');

const solicitudSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  telefono: String,
  carrera: String,
  semestre: String,
  estado: { type: String, default: 'pendiente' }, // pendiente, aprobada, rechazada
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SolicitudActualizacion', solicitudSchema);