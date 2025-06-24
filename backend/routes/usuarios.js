const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const Admin = require('../models/Admin'); // Importa el modelo Admin
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mateotacuri67@gmail.com',
    pass: 'bzrtsqptiholqdgt'
  }
});

// Guardar temporalmente los datos de registro
const registrosPendientes = {};

router.get('/verificar/:token', async (req, res) => {
  const datos = registrosPendientes[req.params.token];
  if (!datos) return res.status(400).send('Token inválido o expirado');

  try {
    if (datos.rol === 'admin') {
      const nuevoAdmin = new Admin({
        ...datos,
        verificado: true
      });
      await nuevoAdmin.save();
    } else {
      const nuevoUsuario = new Usuario({
        ...datos,
        verificado: true
      });
      await nuevoUsuario.save();
    }

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

router.post('/registrar', async (req, res) => {
  const { nombre, apellido, telefono, carrera, semestre, correo, password, rol } = req.body;

  try {
    // Verifica si el correo ya existe en usuarios o admins
    const existeUsuario = await Usuario.findOne({ correo });
    const existeAdmin = await Admin.findOne({ correo });
    if (existeUsuario || existeAdmin) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado.' });
    }

    // Guarda los datos temporalmente, incluyendo el rol
    const tokenVerificacion = crypto.randomBytes(32).toString('hex');
    registrosPendientes[tokenVerificacion] = {
      nombre,
      apellido,
      telefono,
      carrera,
      semestre,
      correo,
      password,
      rol: rol === 'admin' ? 'admin' : 'estudiante',
      verificado: false,
      activo: true
    };

    // Envía correo de verificación
    const link = `https://aso-esfot-ldw7.vercel.app/verificar/${tokenVerificacion}`;
    await transporter.sendMail({
      from: 'mateotacuri67@gmail.com',
      to: correo,
      subject: 'Verifica tu cuenta',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center;">
          <h2 style="color: #e94c4c;">ASO-ESFOT</h2>
          <p>Haz clic en el botón para verificar tu cuenta:</p>
          <a href="${link}" style="
            display: inline-block;
            padding: 12px 24px;
            background-color: #e94c4c;
            color: #fff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 16px 0;
          ">Verificar cuenta</a>
          <p style="font-size: 13px; color: #888;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
          <p style="font-size: 13px; color: #888;">${link}</p>
          <hr style="margin: 24px 0;">
          <p style="font-size: 12px; color: #aaa;">ASO-ESFOT &copy; 2025</p>
        </div>
      `
    });

    res.status(200).json({ mensaje: 'Revisa tu correo para verificar tu cuenta.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar usuario', error: error.message });
  }
});

// POST /api/usuarios/login
router.post('/login', async (req, res) => {
  const { correo, password, rol } = req.body;

  try {
    let usuario;
    if (rol === 'admin') {
      usuario = await Admin.findOne({ correo });
    } else {
      usuario = await Usuario.findOne({ correo });
    }

    if (!usuario || !usuario.activo) {
      return res.status(401).json({ mensaje: 'Usuario inactivo o no encontrado.' });
    }

    if (usuario.password !== password) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    if (!usuario.verificado) {
      return res.status(401).json({ mensaje: 'Debes verificar tu correo antes de iniciar sesión.' });
    }

    if (rol && usuario.rol !== rol) {
      return res.status(401).json({ mensaje: 'Rol incorrecto.' });
    }

    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        rol: usuario.rol
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
