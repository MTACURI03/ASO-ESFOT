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
  const usuario = await Usuario.findOne({ tokenVerificacion: req.params.token });
  if (!usuario) return res.status(400).send('Token inválido');
  usuario.verificado = true;
  usuario.tokenVerificacion = undefined;
  await usuario.save();
  res.send('Cuenta verificada. Ya puedes iniciar sesión.');
});


// POST /api/usuarios/registrar
router.post('/registrar', async (req, res) => {
  try {
    const tokenVerificacion = crypto.randomBytes(32).toString('hex');
    const { nombre, apellido, telefono, carrera, correo, password } = req.body;
    const nuevoUsuario = new Usuario({ nombre, apellido, telefono, carrera, correo, password,verificado: false,
      tokenVerificacion });
    await nuevoUsuario.save();

    const url = `http://localhost:3000/verificar/${tokenVerificacion}`;
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
    res.status(201).json({ mensaje: 'Usuario registrado con éxito' });
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

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
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

module.exports = router;
