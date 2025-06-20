import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalMensaje from './ModalMensaje'; // Ajusta la ruta según tu estructura

const CrearPasswordPage = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [carrera, setCarrera] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [semestre, setSemestre] = useState('');
  const [modal, setModal] = useState({ show: false, mensaje: '', tipo: 'success', onClose: null });

  // Validaciones
  const nombreValido = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?: [A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$/.test(nombre);
  const apellidoValido = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?: [A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$/.test(apellido);
  const telefonoValido = /^\d{10}$/.test(telefono);
  const passwordValid = password.length >= 9 && /[A-Z]/.test(password);
  const passwordError = password && !passwordValid;

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(!!value && !/^[\w-.]+@epn\.edu\.ec$/.test(value));
  };

  const handleNombreChange = (e) => {
    setNombre(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''));
  };

  const handleApellidoChange = (e) => {
    setApellido(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''));
  };

  const handleTelefonoChange = (e) => {
    setTelefono(e.target.value.replace(/\D/g, '').slice(0, 10));
  };

  const mostrarModal = (mensaje, tipo = 'error', onClose = null) => {
    setModal({ show: true, mensaje, tipo, onClose });
  };

  const handleCloseModal = () => {
    setModal({ ...modal, show: false });
    if (modal.onClose) modal.onClose();
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    if (!nombre || !apellido || !telefono || !carrera || !email || !password || !confirmPassword) {
      mostrarModal("Por favor completa todos los campos.");
      return;
    }

    if (!nombreValido) {
      mostrarModal("El nombre debe empezar con mayúscula y solo contener letras.");
      return;
    }

    if (!apellidoValido) {
      mostrarModal("El apellido debe empezar con mayúscula y solo contener letras.");
      return;
    }

    if (!telefonoValido) {
      mostrarModal("El teléfono debe tener exactamente 10 dígitos.");
      return;
    }

    if (emailError || !/^[\w-.]+@epn\.edu\.ec$/.test(email)) {
      mostrarModal("El correo debe ser institucional (@epn.edu.ec).");
      return;
    }

    if (!passwordValid) {
      mostrarModal("La contraseña debe tener mínimo 9 caracteres y al menos una letra mayúscula.");
      return;
    }

    if (password !== confirmPassword) {
      mostrarModal("Las contraseñas no coinciden.");
      return;
    }

    if (!semestre) {
      mostrarModal("Por favor selecciona tu semestre.");
      return;
    }

    const nuevoUsuario = {
      nombre,
      apellido,
      telefono,
      carrera,
      semestre,
      correo: email,
      password
    };

    try {
      const response = await fetch("https://aso-esfot-backend.onrender.com/api/usuarios/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario),
      });

      const data = await response.json();

      if (response.ok) {
        setModal({
          show: true,
          mensaje: data.mensaje || "Registrado con éxito ✅",
          tipo: 'success',
          onClose: () => navigate('/')
        });
      } else {
        mostrarModal(data.mensaje || "Error al registrar el usuario");
      }
    } catch (err) {
      mostrarModal("Error al registrar: " + err.message);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* ENCABEZADO */}
      <header className="bg-esfot text-white py-3 px-4 d-flex justify-content-between align-items-center">
        <img src="/imagenes_asoesfot/logo.png" alt="ESFOT" style={{ height: '60px' }} />
        <div></div>
      </header>

      {/* CUERPO PRINCIPAL */}
      <main className="flex-grow-1 d-flex flex-column flex-md-row">
        {/* MITAD IZQUIERDA: IMAGEN */}
        <div
          className="d-none d-md-block"
          style={{
            width: '60%',
            backgroundImage: "url('/imagenes_asoesfot/login.jpeg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>

        {/* MITAD DERECHA: FORMULARIO */}
        <div className="w-100 w-md-40 d-flex align-items-center justify-content-center p-4" style={{ width: '40%' }}>
          <div className="w-100" style={{ maxWidth: '400px' }}>
            <h1 className="text-center mb-3" style={{ fontSize: '2.2rem', fontWeight: 'bold' }}>
              Registro
            </h1>
            <h2 className="mb-4 text-center">Completa la información</h2>
            <form onSubmit={handleGuardar}>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input
                  type="text"
                  className={`form-control ${nombre && !nombreValido ? 'is-invalid' : ''}`}
                  id="nombre"
                  placeholder="Juan"
                  value={nombre}
                  onChange={handleNombreChange}
                />
                <div className="form-text">
                  Debe empezar con mayúscula y solo contener letras.
                </div>
                {nombre && !nombreValido && (
                  <div className="invalid-feedback d-block">
                    El nombre debe empezar con mayúscula y solo contener letras.
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="apellido" className="form-label">Apellido</label>
                <input
                  type="text"
                  className={`form-control ${apellido && !apellidoValido ? 'is-invalid' : ''}`}
                  id="apellido"
                  placeholder="Pérez"
                  value={apellido}
                  onChange={handleApellidoChange}
                />
                <div className="form-text">
                  Debe empezar con mayúscula y solo contener letras.
                </div>
                {apellido && !apellidoValido && (
                  <div className="invalid-feedback d-block">
                    El apellido debe empezar con mayúscula y solo contener letras.
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="telefono" className="form-label">Teléfono</label>
                <input
                  type="tel"
                  className={`form-control ${telefono && !telefonoValido ? 'is-invalid' : ''}`}
                  id="telefono"
                  placeholder="0991234567"
                  value={telefono}
                  onChange={handleTelefonoChange}
                  maxLength={10}
                />
                <div className="form-text">
                  Debe tener exactamente 10 dígitos.
                </div>
                {telefono && !telefonoValido && (
                  <div className="invalid-feedback d-block">
                    El teléfono debe tener exactamente 10 dígitos.
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="carrera" className="form-label">Carrera</label>
                <select
                  className="form-select"
                  id="carrera"
                  value={carrera}
                  onChange={(e) => setCarrera(e.target.value)}
                >
                  <option value="">Selecciona una carrera</option>
                  <option value="Software">Desarrollo de Software</option>
                  <option value="Agua y Saneamiento Ambiental">Agua y Saneamiento Ambiental</option>
                  <option value="Electromecánica">Electromecánica</option>
                  <option value="Redes y Telecomunicaciones">Redes y Telecomunicaciones</option>
                  <option value="Procesamiento de Alimentos">Procesamiento de Alimentos</option>
                  <option value="Procesamiento Industrial de Madera">Procesamiento Industrial de Madera</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="semestre" className="form-label">Semestre</label>
                <select
                  className="form-select"
                  id="semestre"
                  value={semestre}
                  onChange={e => setSemestre(e.target.value)}
                >
                  <option value="">Selecciona un semestre</option>
                  <option value="Nivelación">Nivelación</option>
                  <option value="Primer semestre">Primer semestre</option>
                  <option value="Segundo semestre">Segundo semestre</option>
                  <option value="Tercer semestre">Tercer semestre</option>
                  <option value="Cuarto semestre">Cuarto semestre</option>
                  <option value="Quinto semestre">Quinto semestre</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className={`form-control ${emailError ? 'is-invalid' : ''}`}
                  id="email"
                  placeholder="correo@epn.edu.ec"
                  value={email}
                  onChange={handleEmailChange}
                />
                <div className="form-text">
                  Solo se permite correo institucional (@epn.edu.ec)
                </div>
                {emailError && (
                  <div className="invalid-feedback d-block">
                    El correo debe ser institucional (@epn.edu.ec)
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Crear contraseña</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                    id="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    tabIndex={-1}
                    onClick={() => setShowPassword(v => !v)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                <div className="form-text">
                  La contraseña debe tener al menos 9 caracteres y una letra mayúscula.
                </div>
                {passwordError && (
                  <div className="invalid-feedback d-block">
                    La contraseña no cumple los requisitos.
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="form-label">Repetir contraseña</label>
                <div className="input-group">
                  <input
                    type={showConfirm ? "text" : "password"}
                    className="form-control"
                    id="confirmPassword"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    tabIndex={-1}
                    onClick={() => setShowConfirm(v => !v)}
                  >
                    {showConfirm ? "🙈" : "👁️"}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <div className="invalid-feedback d-block">
                    Las contraseñas no coinciden.
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="btn w-100"
                style={{ backgroundColor: '#e94c4c', color: 'white' }}
                disabled={
                  !passwordValid ||
                  password !== confirmPassword ||
                  !nombreValido ||
                  !apellidoValido ||
                  !telefonoValido
                }
              >
                Guardar
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* MODAL MENSAJE */}
      <ModalMensaje
        show={modal.show}
        mensaje={modal.mensaje}
        tipo={modal.tipo}
        onClose={handleCloseModal}
      />

      {/* PIE DE PÁGINA */}
      <footer className="bg-esfot text-white text-center py-3">
        &copy; 2025 ASO-ESFOT. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default CrearPasswordPage;

