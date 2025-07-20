const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Usuario = require('../models/Usuario');
const PlanAportacion = require('../models/PlanAportacion'); // Tu modelo
const mongoose = require('mongoose');
const Finanza = require('../models/Finanza');
// Configura tu transporter de Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'asoesfot@gmail.com',
    pass: 'erkobvndueuotaot'
  }
});

// Función para enviar notificación
async function enviarNotificacionAportacion({ correo, nombre, nombrePlan, fechaSeleccion, precio, estado }) {
  return transporter.sendMail({
    from: 'ASO-ESFOT <asoesfot@gmail.com>',
    to: correo,
    subject: `Detalles de tu aportación en ASO-ESFOT`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 24px;">
        <h2 style="color: #b22222;">🐉 Verifícate en <span style="color: #007bff;">ASO-ESFOT</span></h2>
        <p>Hola <b>${nombre}</b>,</p>
        <p>Has seleccionado el siguiente plan de aportación:</p>
        <ul style="font-size: 1.1em;">
          <li><b>Plan:</b> ${nombrePlan}</li>
          <li><b>Fecha:</b> ${new Date(fechaSeleccion).toLocaleDateString()}</li>
          <li><b>Precio:</b> $${precio}</li>
          <li><b>Estado:</b> ${estado}</li>
        </ul>
        <div style="margin: 24px 0; padding: 16px; background: #fff3cd; border-radius: 6px; color: #856404;">
          <b>Importante:</b> Acércate a cancelar tu aportación en la Asociación de Estudiantes de la ESFOT para activar todos los beneficios de tu plan.
        </div>
        <hr style="margin: 32px 0;">
        <p style="font-size: 0.9em; color: #aaa;">ASO-ESFOT &copy; 2025</p>
      </div>
    `
  });
}

// Ruta para seleccionar plan, guardar y notificar
router.post('/seleccionar', async (req, res) => {
  try {
    console.log('--- PETICIÓN RECIBIDA EN /api/planes/seleccionar ---');
    console.log('Body recibido:', req.body);

    const { usuarioId, nombrePlan, precio } = req.body;
    if (!usuarioId) {
      console.log('❌ usuarioId no recibido');
      return res.status(400).json({ mensaje: 'No se recibió usuarioId' });
    }

    const usuario = await Usuario.findById(usuarioId);
    console.log('usuario encontrado:', usuario);

    if (!usuario || usuario.rol !== 'estudiante') {
      console.log('❌ Usuario no encontrado o no autorizado');
      return res.status(404).json({ mensaje: 'Usuario no encontrado o no autorizado.' });
    }

    // Guarda la aportación
    const nuevaAportacion = new PlanAportacion({
      usuarioId,
      nombrePlan,
      precio,
    });
    await nuevaAportacion.save();

    // Envía la notificación
    await enviarNotificacionAportacion({
      correo: usuario.correo,
      nombre: usuario.nombre,
      nombrePlan,
      fechaSeleccion: nuevaAportacion.fechaSeleccion,
      precio,
      estado: nuevaAportacion.estado
    });

    res.status(201).json({ mensaje: 'Aportación registrada y notificación enviada.' });
  } catch (error) {
    console.error('Error en /seleccionar:', error);
    res.status(500).json({ mensaje: 'Error al registrar la aportación', error: error.message });
  }
});

// Ruta para visualizar aportaciones de un usuario
router.get('/usuario/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const aportaciones = await PlanAportacion.find({ usuarioId });
    res.json(aportaciones);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las aportaciones', error: error.message });
  }
});

router.get('/aportaciones', async (req, res) => {
  try {
    const aportaciones = await PlanAportacion.find().populate('usuarioId', 'nombre apellido correo');
    res.json(aportaciones);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las aportaciones', error: error.message });
  }
});

router.put('/aportaciones/:id/estado', async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    const aportacion = await PlanAportacion.findById(id).populate('usuarioId');
    if (!aportacion) {
      return res.status(404).json({ mensaje: 'Aportación no encontrada.' });
    }
    // Solo validar si se quiere cambiar a Pagado
    if (estado === 'Pagado' && aportacion.usuarioId && aportacion.usuarioId.activo === false) {
      return res.status(400).json({ mensaje: 'El usuario está inactivo y no puede cambiar a Pagado.' });
    }
    aportacion.estado = estado;
    await aportacion.save();
    res.json({ mensaje: 'Estado actualizado correctamente.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el estado.' });
  }
});

module.exports = router;