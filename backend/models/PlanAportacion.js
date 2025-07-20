const mongoose = require('mongoose');

const planAportacionSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  nombrePlan: { type: String, required: true },
  precio: { type: Number, required: true },
  fechaSeleccion: { type: Date, default: Date.now },
  estado: { type: String, default: 'Pendiente' },
  activo: { type: Boolean, default: true } // Nuevo campo para activo/inactivo
});

module.exports = mongoose.model('PlanAportacion', planAportacionSchema);
