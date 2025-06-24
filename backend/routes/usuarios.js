const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const Admin = require('../models/Admin'); // Importa el modelo Admin
const SolicitudActualizacion = require('../models/SolicitudActualizacion'); // Asegúrate de tener este modelo
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
    // const existeAdmin = await Admin.findOne({ correo }); // <-- Elimina o comenta esta línea
    if (existeUsuario) { // <-- Solo valida en la colección de usuarios
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
        <div style="background: #232323; color: #fff; font-family: Arial, sans-serif; text-align: center; padding: 40px 0; min-height: 100vh;">
          <h2 style="color: #ff5e5e; margin-bottom: 16px;">
            <span style="font-size: 1.5em;">🐍</span>
            <span style="color: #ff5e5e;">Verifícate en</span>
            <span style="color: #4da3ff;">ASO-ESFOT</span>
          </h2>
          <p style="font-size: 1.1em; margin-bottom: 32px;">
            ¡Hola! Para activar tu cuenta y disfrutar de todos los beneficios, haz clic en el siguiente botón:
          </p>
          <a href="${link}" style="
            display: inline-block;
            padding: 14px 32px;
            background-color: #2986f5;
            color: #fff;
            text-decoration: none;
            border-radius: 8px;
            font-size: 1.1em;
            font-weight: bold;
            margin: 24px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            transition: background 0.2s;
          ">
            Verificar mi cuenta 🐍
          </a>
          <p style="font-size: 13px; color: #bbb; margin-top: 40px;">
            Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
            <span style="color: #4da3ff;">${link}</span>
          </p>
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
  let usuario = null;

  if (rol.trim() === 'admin') {
    usuario = await Admin.findOne({
      correo: correo.trim(),
      rol: rol.trim()
    });
  } else {
    usuario = await Usuario.findOne({
      correo: correo.trim(),
      rol: rol.trim()
    });
  }

  if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
  if (usuario.password !== password) return res.status(400).json({ mensaje: 'Contraseña incorrecta.' });

  res.json({
    usuario: {
      id: usuario._id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      activo: usuario.activo,
      telefono: usuario.telefono,
      carrera: usuario.carrera,
      semestre: usuario.semestre,
      rol: usuario.rol
    }
  });
});

router.put('/:id/activo', async (req, res) => {
  try {
    // Busca el usuario antes de actualizar para saber su estado anterior
    const usuarioPrevio = await Usuario.findById(req.params.id);

    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { activo: req.body.activo },
      { new: true }
    );

    // Si se inactiva la cuenta, enviar notificación
    if (usuario && req.body.activo === false) {
      await transporter.sendMail({
        from: 'ASO-ESFOT <mateotacuri67@gmail.com>',
        to: usuario.correo,
        subject: 'Tu cuenta ha sido inactivada en ASO-ESFOT',
        html: `
          <div style="font-family: Arial, sans-serif; background: #fff3cd; padding: 24px;">
            <h2 style="color: #b22222;">Cuenta inactivada</h2>
            <p>Hola <b>${usuario.nombre} ${usuario.apellido}</b>,</p>
            <p>Tu cuenta en ASO-ESFOT ha sido <b>inactivada</b> por una de las siguientes razones:</p>
            <ul>
              <li>No actualizaste tus datos personales.</li>
              <li>Has culminado el quinto semestre.</li>
            </ul>
            <div style="margin: 18px 0; padding: 14px; background: #ffeeba; border-radius: 6px; color: #856404;">
              <b>Nota:</b> Por favor, acércate a las oficinas de la Asociación de Estudiantes de la ESFOT para solucionar tu situación y poder reactivar tu cuenta.
            </div>
            <hr>
            <p style="font-size: 12px; color: #888;">ASO-ESFOT &copy; 2025</p>
          </div>
        `
      });
    }

    // Si la cuenta pasa de inactiva a activa (pero no en el registro inicial)
    if (
      usuario &&
      req.body.activo === true &&
      usuarioPrevio &&
      usuarioPrevio.activo === false // Solo si antes estaba inactiva
    ) {
      await transporter.sendMail({
        from: 'ASO-ESFOT <mateotacuri67@gmail.com>',
        to: usuario.correo,
        subject: '¡Tu cuenta ha sido activada en ASO-ESFOT!',
        html: `
          <div style="font-family: Arial, sans-serif; background: #d4edda; padding: 24px;">
            <h2 style="color: #155724;">Cuenta activada</h2>
            <p>Hola <b>${usuario.nombre} ${usuario.apellido}</b>,</p>
            <p>¡Tu cuenta en ASO-ESFOT ha sido <b>activada</b> nuevamente! Ya puedes iniciar sesión y disfrutar de todos los servicios y beneficios de la asociación.</p>
            <div style="margin: 18px 0; padding: 14px; background: #c3e6cb; border-radius: 6px; color: #155724;">
              <b>Recuerda:</b> Si tienes dudas o problemas, acércate a las oficinas de la Asociación de Estudiantes de la ESFOT.
            </div>
            <hr>
            <p style="font-size: 12px; color: #888;">ASO-ESFOT &copy; 2025</p>
          </div>
        `
      });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar usuario', error: error.message });
  }
});

router.put('/actualizar-password', async (req, res) => {
  const { correo, passwordActual, nuevoPassword } = req.body;
  try {
    // Buscar usuario por correo
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'El correo no está registrado.' });
    }

    // Validar contraseña actual
    if (usuario.password !== passwordActual) {
      return res.status(400).json({ mensaje: 'La contraseña actual es incorrecta.' });
    }

    // Validar que la nueva contraseña sea diferente
    if (nuevoPassword === passwordActual) {
      return res.status(400).json({ mensaje: 'La nueva contraseña debe ser diferente a la anterior.' });
    }

    // Validar longitud y mayúscula
    const tieneMayuscula = /[A-Z]/.test(nuevoPassword);
    if (nuevoPassword.length < 9 || !tieneMayuscula) {
      return res.status(400).json({ mensaje: 'La nueva contraseña debe tener al menos 9 caracteres y una letra mayúscula.' });
    }

    // Actualizar contraseña
    usuario.password = nuevoPassword;
    await usuario.save();

    res.json({ mensaje: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar la contraseña.' });
  }
});

router.post('/solicitar-actualizacion', async (req, res) => {
  const { id, telefono, carrera, semestre } = req.body;
  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    if (usuario.activo) return res.status(400).json({ mensaje: 'Solo puedes actualizar datos si tu cuenta está inactiva.' });

    // Guarda la solicitud pendiente
    const solicitud = await SolicitudActualizacion.create({
      usuarioId: id,
      telefono,
      carrera,
      semestre,
      estado: 'pendiente'
    });

    // Correo al usuario
    await transporter.sendMail({
      from: 'ASO-ESFOT <mateotacuri67@gmail.com>',
      to: usuario.correo,
      subject: 'Solicitud de actualización de datos recibida',
      html: `
        <h3>¡Solicitud recibida!</h3>
        <p>Tu solicitud de actualización de datos ha sido registrada. Un administrador la revisará pronto.</p>
      `
    });

    // Correo al admin
    await transporter.sendMail({
      from: 'ASO-ESFOT <mateotacuri67@gmail.com>',
      to: 'admin@esfot.edu.ec', // Cambia por el correo real del admin
      subject: 'Solicitud de actualización de datos de estudiante',
      html: `
        <h3>Actualización de datos solicitada</h3>
        <p>El estudiante <b>${usuario.nombre} ${usuario.apellido}</b> (${usuario.correo}) ha solicitado actualizar sus datos:</p>
        <ul>
          <li>Teléfono: ${telefono}</li>
          <li>Carrera: ${carrera}</li>
          <li>Semestre: ${semestre}</li>
        </ul>
        <p>Revisa y aprueba la solicitud en el panel de administración.</p>
      `
    });

    res.json({ mensaje: 'Solicitud enviada. Un administrador revisará tu actualización.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al solicitar actualización.' });
  }
});

router.post('/aprobar-actualizacion/:solicitudId', async (req, res) => {
  try {
    const solicitud = await SolicitudActualizacion.findById(req.params.solicitudId);
    if (!solicitud || solicitud.estado !== 'pendiente') {
      return res.status(404).json({ mensaje: 'Solicitud no encontrada o ya procesada.' });
    }
    // Actualiza los datos del usuario
    const usuario = await Usuario.findById(solicitud.usuarioId);
    usuario.telefono = solicitud.telefono;
    usuario.carrera = solicitud.carrera;
    usuario.semestre = solicitud.semestre;
    usuario.activo = true; // Reactiva la cuenta
    await usuario.save();

    solicitud.estado = 'aprobada';
    await solicitud.save();

    // Notifica al usuario
    await transporter.sendMail({
      from: 'ASO-ESFOT <mateotacuri67@gmail.com>',
      to: usuario.correo,
      subject: 'Actualización de datos aprobada',
      html: `
        <h3>¡Tus datos han sido actualizados!</h3>
        <p>Tu cuenta ha sido reactivada y tus datos han sido actualizados correctamente. Ya puedes iniciar sesión.</p>
      `
    });

    res.json({ mensaje: 'Datos actualizados y cuenta reactivada.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al aprobar la actualización.' });
  }
});

module.exports = router;
