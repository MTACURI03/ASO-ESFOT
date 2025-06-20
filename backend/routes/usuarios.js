const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mateotacuri67@gmail.com',
    pass: 'bzrtsqptiholqdgt'
  }
});

router.get('/verificar/:token', async (req, res) => {
  const datos = registrosPendientes[req.params.token];
  if (!datos) return res.status(400).send('Token inválido o expirado');

  try {
    // Guarda el usuario en la base de datos y lo marca como verificado
    const nuevoUsuario = new Usuario({
      ...datos,
      verificado: true
    });
    await nuevoUsuario.save();

    // Elimina los datos temporales
    delete registrosPendientes[req.params.token];

    res.send('Cuenta verificada y registrada. Ya puedes iniciar sesión.');
  } catch (error) {
    res.status(500).send('Error al guardar el usuario');
  }
});

// GET /api/usuarios?semestre=5
router.get('/', async (req, res) => {
  try {
    const filtro = {};
    if (req.query.semestre) {
      filtro.semestre = req.query.semestre;
    }
    const usuarios = await Usuario.find(filtro);
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
  }
});

// Guardar temporalmente los datos de registro
const registrosPendientes = {};

router.post('/registrar', async (req, res) => {

  if (!/^[\w-.]+@epn\.edu\.ec$/.test(req.body.correo)) {
    return res.status(400).json({ mensaje: 'El correo debe ser institucional (@epn.edu.ec).' });
  }
  if (req.body.password.length < 9 || !/[A-Z]/.test(req.body.password)) {
    return res.status(400).json({ mensaje: 'La contraseña debe tener mínimo 9 caracteres y al menos una letra mayúscula.' });
  }

  if (!/^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?: [A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$/.test(req.body.nombre)) {
  return res.status(400).json({ mensaje: 'El nombre debe empezar con mayúscula y solo contener letras.' });
}

  if (!/^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?: [A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$/.test(req.body.apellido)) {
  return res.status(400).json({ mensaje: 'El apellido debe empezar con mayúscula y solo contener letras.' });
}

  if (!/^\d{10}$/.test(req.body.telefono)) {
  return res.status(400).json({ mensaje: 'El teléfono debe tener exactamente 10 dígitos.' });
}

  try {
    const tokenVerificacion = crypto.randomBytes(32).toString('hex');
    const { nombre, apellido, telefono, carrera, semestre, correo, password } = req.body;

    // Guarda los datos temporalmente
    registrosPendientes[tokenVerificacion] = {
      nombre, apellido, telefono, carrera, semestre, correo, password
    };

    const url = `https://aso-esfot-p1kb.vercel.app/verificar/${tokenVerificacion}`;
    await transporter.sendMail({
      from: 'tuusuario@gmail.com',
      to: correo,
      subject: 'Verifica tu cuenta',
      html: `
  <div style="font-family: Arial, sans-serif; text-align: center; padding: 24px;">
    <h2 style="color: #b22222;">🐉 Verifícate en <span style="color: #007bff;">ASO-ESFOT</span></h2>
    <p style="font-size: 1.1em;">¡Hola! Para activar tu cuenta y disfrutar de todos los beneficios, haz clic en el siguiente botón:</p>
    <a href="${url}" style="display: inline-block; margin: 24px 0; padding: 12px 28px; background: #007bff; color: #fff; border-radius: 6px; text-decoration: none; font-size: 1.1em;">
      Verificar mi cuenta 🐉
    </a>
    <p style="color: #888; font-size: 0.95em;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
    <p style="word-break: break-all;"><a href="${url}">${url}</a></p>
    <hr style="margin: 32px 0;">
    <p style="font-size: 0.9em; color: #aaa;">ASO-ESFOT &copy; 2025</p>
  </div>
`
    });
    console.log('Correo enviado');
    res.status(201).json({ mensaje: 'Revisa tu correo para verificar tu cuenta' });
  } catch (error) {
    console.error('Error en /registrar:', error);
    res.status(500).json({ mensaje: 'Error al registrar el usuario', error: error.message });
  }
});

// POST /api/usuarios/login
router.post('/login', async (req, res) => {
  const { correo, password } = req.body;

  try {
    // Buscar usuario por correo
    const usuario = await Usuario.findOne({ correo });

    if (!usuario || !usuario.activo) {
      return res.status(401).json({ mensaje: 'Usuario inactivo o no encontrado.' });
    }

    // Verificar contraseña
    if (usuario.password !== password) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Verificar si el usuario está verificado
    if (!usuario.verificado) {
      return res.status(401).json({ mensaje: 'Debes verificar tu correo antes de iniciar sesión.' });
    }

    // Autenticación exitosa
    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
      }
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
});

router.put('/:id/activo', async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { activo: req.body.activo },
      { new: true }
    );
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json({ mensaje: 'Estado actualizado', usuario });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar estado', error: error.message });
  }
});

module.exports = router;
