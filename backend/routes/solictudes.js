const express = require('express');
const router = express.Router();
const SolicitudActualizacion = require('../models/SolicitudActualizacion');
const Usuario = require('../models/Usuario');

router.get('/', async (req, res) => {
  try {
    const solicitudes = await SolicitudActualizacion.find({ estado: 'pendiente' })
      .populate('usuarioId', 'nombre apellido correo');
    // Formatea para el frontend
    res.json(solicitudes.map(s => ({
      _id: s._id,
      telefono: s.telefono,
      carrera: s.carrera,
      semestre: s.semestre,
      usuario: s.usuarioId
    })));
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener solicitudes' });
  }
});

module.exports = router;