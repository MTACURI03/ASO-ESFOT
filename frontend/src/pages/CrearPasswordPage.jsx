import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [modal, setModal] = useState({ show: false, title: '', message: '', error: false });
  const [rol, setRol] = useState('estudiante');

  const usuarioActual = JSON.parse(localStorage.getItem('usuario'));
  const esAdmin = usuarioActual && usuarioActual.rol === 'admin';

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

  const handleGuardar = async (e) => {
    e.preventDefault();

    if (!nombre || !apellido || !telefono || !carrera || !email || !password || !confirmPassword) {
      alert("Por favor completa todos los campos.");
      return;
    }

    if (!nombreValido) {
      alert("El nombre debe empezar con mayúscula y solo contener letras.");
      return;
    }

    if (!apellidoValido) {
      alert("El apellido debe empezar con mayúscula y solo contener letras.");
      return;
    }

    if (!telefonoValido) {
      alert("El teléfono debe tener exactamente 10 dígitos.");
      return;
    }

    if (emailError || !/^[\w-.]+@epn\.edu\.ec$/.test(email)) {
      alert("El correo debe ser institucional (@epn.edu.ec).");
      return;
    }

    if (!passwordValid) {
      alert("La contraseña debe tener mínimo 9 caracteres y al menos una letra mayúscula.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    if (!semestre) {
      alert("Por favor selecciona tu semestre.");
      return;
    }

    const nuevoUsuario = {
      nombre,
      apellido,
      telefono,
      carrera,
      semestre,
      correo: email,
      password,
      ...(esAdmin && { rol }) // Solo agrega el rol si es admin
    };

    try {
      const response = await fetch("https://aso-esfot-backend.onrender.com/api/usuarios/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario),
      });
      const data = await response.json();
      if (!response.ok) {
        setModal({
          show: true,
          title: 'Error',
          message: data.mensaje || 'Error al registrar usuario',
          error: true,
        });
        return;
      }
      setSuccessMessage(data.mensaje || "Registrado con éxito ✅");
      setShowSuccessModal(true);
    } catch (err) {
      alert("Error al registrar: " + err.message);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Modal de éxito */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{
            background: 'white', padding: 32, borderRadius: 12, minWidth: 300, textAlign: 'center', boxShadow: '0 2px 16px #0002'
          }}>
            <h4>{successMessage}</h4>
            <button
              className="btn mt-3"
              style={{ backgroundColor: '#e94c4c', color: 'white', border: 'none' }} // color institucional
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/');
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
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
              {esAdmin && (
                <div className="mb-3">
                  <label htmlFor="rol" className="form-label">Rol</label>
                  <select
                    className="form-select"
                    id="rol"
                    value={rol}
                    onChange={e => setRol(e.target.value)}
                    disabled // El admin no puede cambiar su propio rol
                  >
                    <option value="estudiante">Estudiante</option>
                  </select>
                  <div className="form-text">
                    Como administrador solo puedes registrar usuarios con rol estudiante.
                  </div>
                </div>
              )}
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

      {/* PIE DE PÁGINA */}
      <footer className="bg-esfot text-white text-center py-3">
        &copy; 2025 ASO-ESFOT. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default CrearPasswordPage;

