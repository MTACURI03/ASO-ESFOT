import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('estudiante');
  const [mensaje, setMensaje] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
      const res = await fetch('https://aso-esfot-backend.onrender.com/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password, rol }),
      });
      const data = await res.json();
      if (res.ok && data.usuario) {
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        if (data.usuario.activo === false) {
          setMensaje('Tu cuenta está inactiva. Actualiza tus datos para reactivarla.');
          setTimeout(() => navigate('/actualizar-datos'), 2000);
        } else if (data.usuario.rol === 'admin') {
          navigate('/adminpage');
        } else {
          navigate('/landing');
        }
      } else {
        setMensaje(data.mensaje || 'Error al iniciar sesión.');
      }
    } catch {
      setMensaje('Error de red.');
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
            <h4>Inicio de sesión exitoso</h4>
            <button
              className="btn mt-3"
              style={{ backgroundColor: '#e94c4c', color: 'white', border: 'none' }}
              onClick={() => {
                setShowSuccessModal(false);
                window.location.href = '/landing';
              }}
            >
              Aceptar
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

        {/* MITAD DERECHA: FORMULARIO DE LOGIN */}
        <div className="w-100 w-md-40 d-flex align-items-center justify-content-center p-4" style={{ width: '40%' }}>
          <div className="w-100" style={{ maxWidth: '400px' }}>
            <h1 className="text-center mb-3" style={{ fontSize: '2.2rem', fontWeight: 'bold' }}>
              Bienvenido ASO-ESFOT
            </h1>
            <h2 className="mb-4 text-center">Inicia sesión</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Correo institucional</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="correo@epn.edu.ec"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="input-group-text"
                    style={{ background: 'transparent', border: 'none', paddingLeft: 6, cursor: 'pointer', color: 'black' }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"} {/* Ícono de ojo */}
                  </span>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="rol" className="form-label">Rol</label>
                <select
                  id="rol"
                  className="form-select"
                  value={rol}
                  onChange={e => setRol(e.target.value)}
                  required
                >
                  <option value="estudiante">Estudiante</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="mb-4 text-center">
                <p className="mb-1">¿Cuentas con una cuenta? No?</p>
                <a href="/crear-password" className="text-decoration-none">Puedes crearla aquí</a>
              </div>
              <div className="mb-2 text-center">
                <a href="/actualizar-password" className="text-decoration-none">¿Olvidaste o quieres cambiar tu contraseña?</a>
              </div>
              <button type="submit" className="btn w-100" style={{ backgroundColor: '#e94c4c', color: 'white' }}>
                Ingresar
              </button>
            </form>
            {mensaje && (
              <div className="alert alert-info text-center mt-3">{mensaje}</div>
            )}
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

export default LoginPage;

