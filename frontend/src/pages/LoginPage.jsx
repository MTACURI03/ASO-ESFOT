import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
      const body = { correo, password };

      const res = await fetch('https://aso-esfot-backend.onrender.com/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok && data.usuario) {
        const usuario = data.usuario;

        if (usuario.activo === false) {
          const yaAccedio = localStorage.getItem('actualizacionRealizada');
          if (yaAccedio === 'true') {
            setMensaje('Solicitud enviada. Espera la activación de tu cuenta.');
          } else {
            localStorage.setItem('actualizacionRealizada', 'true');
            localStorage.setItem('usuario', JSON.stringify(usuario));
            navigate('/actualizar-datos');
          }
        } else if (usuario.rol === 'admin') {
          localStorage.setItem('usuario', JSON.stringify(usuario));
          navigate('/adminpage');
        } else if (usuario.rol === 'estudiante') {
          localStorage.setItem('usuario', JSON.stringify(usuario));
          navigate('/landing');
        } else {
          setMensaje('Tu cuenta no tiene un rol válido.');
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
              <button type="submit" className="btn w-100" style={{ backgroundColor: '#e94c4c', color: 'white' }}>
                Ingresar
              </button>
            </form>
            {mensaje && (
              <div className="alert alert-info text-center mt-3">{mensaje}</div>
            )}
            <div className="mt-4 text-center">
              <a href="/crear-password" className="text-decoration-none">¿No tienes cuenta? Crea una aquí</a>
            </div>
            <div className="mt-2 text-center">
              <a href="/actualizar-password" className="text-decoration-none">¿Olvidaste tu contraseña? Actualízala aquí</a>
            </div>
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

