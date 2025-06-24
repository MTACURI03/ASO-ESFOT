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
    user: 'mateotacuri67@gmail.com',
    pass: 'bzrtsqptiholqdgt'
  }
});

// Función para enviar notificación
async function enviarNotificacionAportacion({ correo, nombre, nombrePlan, fechaSeleccion, precio, estado }) {
  return transporter.sendMail({
    from: 'ASO-ESFOT <mateotacuri67@gmail.com>',
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
    const { usuarioId, nombrePlan, precio } = req.body;

    // Busca el usuario
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario || usuario.rol !== 'estudiante') {
      return res.status(404).json({ mensaje: 'Usuario no encontrado o no autorizado.' });
    }

    // Guarda la aportación
    const nuevaAportacion = new PlanAportacion({
      usuarioId,
      nombrePlan,
      precio,
      // fechaSeleccion y estado se asignan por defecto
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
    console.error('Error al registrar la aportación:', error);
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
  const { estado } = req.body;
  try {
    const aportacion = await PlanAportacion.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    ).populate('usuarioId');
    if (!aportacion) return res.status(404).json({ mensaje: 'Aportación no encontrada' });

    // Si el nuevo estado es "Pagado", enviar correo al usuario
    if (estado === 'Pagado' && aportacion.usuarioId && aportacion.usuarioId.correo) {
      const transporter = require('nodemailer').createTransport({
        service: 'gmail',
        auth: {
          user: 'mateotacuri67@gmail.com',
          pass: 'bzrtsqptiholqdgt'
        }
      });

      const mailOptions = {
        from: 'mateotacuri67@gmail.com',
        to: aportacion.usuarioId.correo,
        subject: '¡Tu pago ha sido registrado en ASO-ESFOT!',
        html: `
          <div style="font-family: Arial, sans-serif; background: #f8f8f8; padding: 24px;">
            <h2 style="color: #e94c4c;">¡Pago registrado!</h2>
            <p>Hola <b>${aportacion.usuarioId.nombre} ${aportacion.usuarioId.apellido}</b>,</p>
            <p>Te informamos que tu pago del plan <b>${aportacion.nombrePlan}</b> ha sido registrado exitosamente el <b>${new Date(aportacion.fechaSeleccion).toLocaleDateString()}</b>.</p>
            <ul>
              <li><b>Nombre:</b> ${aportacion.usuarioId.nombre} ${aportacion.usuarioId.apellido}</li>
              <li><b>Correo:</b> ${aportacion.usuarioId.correo}</li>
              <li><b>Plan:</b> ${aportacion.nombrePlan}</li>
              <li><b>Fecha de selección:</b> ${new Date(aportacion.fechaSeleccion).toLocaleDateString()}</li>
              <li><b>Estado:</b> Pagado</li>
            </ul>
            <p>Ya puedes acercarte a las oficinas de la asociación para disfrutar de tus beneficios.</p>
            <p style="color: #2986f5; font-weight: bold;">Puedes imprimir tu factura en el apartado de <b>Mis Aportaciones</b> en tu cuenta de ASO-ESFOT.</p>
            <hr>
            <p style="font-size: 12px; color: #888;">ASO-ESFOT &copy; 2025</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    }

    res.json({ mensaje: 'Estado actualizado', aportacion });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar estado', error: error.message });
  }
});

module.exports = router;