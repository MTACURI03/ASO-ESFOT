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

  // Validaciones de contraseña
  const passwordValid = password.length >= 9 && /[A-Z]/.test(password);
  const passwordError = password && !passwordValid;

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(!!value && !/^[\w-.]+@epn\.edu\.ec$/.test(value));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    if (!nombre || !apellido || !telefono || !carrera || !email || !password || !confirmPassword) {
      alert("Por favor completa todos los campos.");
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

    const nuevoUsuario = {
      nombre,
      apellido,
      telefono,
      carrera,
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
        alert(data.mensaje || "Registrado con éxito ✅");
        navigate('/');
      } else {
        alert(data.mensaje || "Error al registrar el usuario");
      }
    } catch (err) {
      alert("Error al registrar: " + err.message);
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
                  className="form-control"
                  id="nombre"
                  placeholder="Juan"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="apellido" className="form-label">Apellido</label>
                <input
                  type="text"
                  className="form-control"
                  id="apellido"
                  placeholder="Pérez"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="telefono" className="form-label">Teléfono</label>
                <input
                  type="tel"
                  className="form-control"
                  id="telefono"
                  placeholder="0991234567"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
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
                disabled={!passwordValid || password !== confirmPassword}
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

