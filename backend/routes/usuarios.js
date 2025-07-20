const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const Admin = require('../models/Admin');
const SolicitudActualizacion = require('../models/SolicitudActualizacion');
const PlanUsuario = require('../models/PlanUsuario'); // tu modelo de planes actuales
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'asoesfot@gmail.com',
    pass: 'erkobvndueuotaot'
  }
});

// Diseño de notificaciones con dragón y colores
const dragonNotification = (title, message, color) => `
  <div style="font-family: Arial, sans-serif; background: ${color.background}; padding: 24px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <h2 style="color: ${color.text}; text-align: center;">🐉 ${title}</h2>
    <p>${message}</p>
    <hr>
    <p style="font-size: 12px; color: #888; text-align: center;">ASO-ESFOT &copy; 2025</p>
  </div>
`;

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
    const existeUsuario = await Usuario.findOne({ correo });
    if (existeUsuario) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado.' });
    }

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

    const link = `https://aso-esfot-ldw7.vercel.app/verificar/${tokenVerificacion}`;
    await transporter.sendMail({
      from: 'ASO-ESFOT <asoesfot@gmail.com>',
      to: correo,
      subject: 'Verifica tu cuenta',
      html: dragonNotification(
        'Verifica tu cuenta',
        `¡Hola <b>${nombre} ${apellido}</b>!<br>
        Te damos la bienvenida al sistema de ASO-ESFOT.<br><br>
        Para acceder a todos los beneficios y disfrutar de ellos, <b>debes verificar tu cuenta</b>.<br>
        No esperes más, haz clic en el siguiente botón para completar tu registro:<br>
        <a href="${link}" style="display: inline-block; padding: 14px 32px; background-color: #2986f5; color: #fff; text-decoration: none; border-radius: 8px; font-size: 1.1em; font-weight: bold; margin: 24px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.15); transition: background 0.2s;">Verificar mi cuenta 🐉</a><br>
        Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
        <span style="color: #4da3ff;">${link}</span>`,
        { background: '#232323', text: '#ff5e5e' }
      )
    });

    res.status(200).json({ mensaje: 'Revisa tu correo para verificar tu cuenta.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar usuario', error: error.message });
  }
});

// POST /api/usuarios/login
router.post('/login', async (req, res) => {
  const { correo, password } = req.body;
  let usuario = await Admin.findOne({ correo: correo.trim() });

  if (!usuario) {
    usuario = await Usuario.findOne({ correo: correo.trim() });
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
    const usuarioPrevio = await Usuario.findById(req.params.id);
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, { activo: req.body.activo }, { new: true });

    if (usuario && req.body.activo === false) {
      await transporter.sendMail({
        from: 'ASO-ESFOT <asoesfot@gmail.com>',
        to: usuario.correo,
        subject: 'Tu cuenta ha sido inactivada en ASO-ESFOT',
        html: dragonNotification(
          'Cuenta inactivada',
          `Hola <b>${usuario.nombre} ${usuario.apellido}</b>,<br>
          Tu cuenta en ASO-ESFOT ha sido <b>inactivada</b> por una de las siguientes razones:<br>
          <ul>
            <li>No actualizaste tus datos personales.</li>
            <li>Has culminado el quinto semestre.</li>
          </ul>
          <div style="margin: 18px 0; padding: 14px; background: #ffeeba; border-radius: 6px; color: #856404;">
            <b>Nota:</b> Por favor, acércate a las oficinas de la Asociación de Estudiantes de la ESFOT para solucionar tu situación y poder reactivar tu cuenta.
          </div>`,
          { background: '#fff3cd', text: '#b22222' }
        )
      });
    }

    if (usuario && req.body.activo === true && usuarioPrevio && usuarioPrevio.activo === false) {
      await transporter.sendMail({
        from: 'ASO-ESFOT <asoesfot@gmail.com>',
        to: usuario.correo,
        subject: '¡Tu cuenta ha sido activada en ASO-ESFOT!',
        html: dragonNotification(
          'Cuenta activada',
          `Hola <b>${usuario.nombre} ${usuario.apellido}</b>,<br>
          ¡Tu cuenta en ASO-ESFOT ha sido <b>activada</b> nuevamente! Ya puedes iniciar sesión y disfrutar de todos los servicios y beneficios de la asociación.<br>
          <div style="margin: 18px 0; padding: 14px; background: #c3e6cb; border-radius: 6px; color: #155724;">
            <b>Recuerda:</b> Si tienes dudas o problemas, acércate a las oficinas de la Asociación de Estudiantes de la ESFOT.
          </div>`,
          { background: '#d4edda', text: '#155724' }
        )
      });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar usuario', error: error.message });
  }
});

router.put('/actualizar-password', async (req, res) => {
  const { correo, nuevoPassword } = req.body;
  try {
    // Buscar usuario por correo
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'El correo no está registrado.' });
    }

    // Validar que la nueva contraseña sea diferente a la anterior
    if (usuario.password === nuevoPassword) {
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

    // Notificación por correo
    await transporter.sendMail({
      from: 'ASO-ESFOT <asoesfot@gmail.com>',
      to: correo,
      subject: 'Contraseña actualizada',
      html: dragonNotification(
        'Contraseña actualizada',
        `Hola <b>${usuario.nombre} ${usuario.apellido}</b>,<br>
        Tu contraseña ha sido actualizada correctamente en ASO-ESFOT.<br>
        Si no realizaste este cambio, por favor contacta al soporte de inmediato.`,
        { background: '#232323', text: '#e94c4c' }
      )
    });

    res.json({ mensaje: 'Contraseña actualizada correctamente. Se ha enviado una notificación a tu correo.' });
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
      from: 'ASO-ESFOT <asoesfot@gmail.com>',
      to: usuario.correo,
      subject: 'Solicitud de actualización de datos recibida',
      html: `
        <h3>¡Solicitud recibida!</h3>
        <p>Tu solicitud de actualización de datos ha sido registrada. Un administrador la revisará pronto.</p>
      `
    });

    // Correo al admin
    await transporter.sendMail({
      from: 'ASO-ESFOT <asoesfot@gmail.com>',
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

    // MARCA LOS PLANES ANTERIORES COMO INACTIVOS/HISTÓRICOS
    await PlanUsuario.updateMany(
      { usuarioId: usuario._id, activo: true },
      { $set: { activo: false } }
    );

    solicitud.estado = 'aprobada';
    await solicitud.save();

    // Notifica al usuario
    await transporter.sendMail({
      from: 'ASO-ESFOT <asoesfot@gmail.com>',
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

app.post('/api/usuarios/desactivar-todos', async (req, res) => {
  try {
    // Desactivar todas las cuentas
    await db.query('UPDATE usuarios SET activo = false WHERE rol = "estudiante"');

    // Registrar planes actuales en el historial (si aplica)
    const usuarios = await db.query('SELECT id, plan_id, semestre FROM usuarios WHERE rol = "estudiante"');
    usuarios.forEach(async usuario => {
      await db.query('INSERT INTO planes_historial (usuario_id, plan_id, semestre, fecha_seleccion) VALUES (?, ?, ?, ?)', 
        [usuario.id, usuario.plan_id, usuario.semestre, new Date()]);
    });

    res.status(200).json({ message: 'Todas las cuentas han sido desactivadas.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al desactivar las cuentas.' });
  }
});

module.exports = router;
