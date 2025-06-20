import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalMensaje from './ModalMensaje'; // Ajusta la ruta según tu estructura

const LoginPage = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [modal, setModal] = useState({ show: false, mensaje: '', tipo: 'success' });

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch('https://aso-esfot-backend.onrender.com/api/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, password }),
    });
    const data = await response.json();
    if (response.ok) {
      setModal({ show: true, mensaje: 'Inicio de sesión exitoso', tipo: 'success' });
    } else {
      setModal({ show: true, mensaje: data.mensaje || 'Error al iniciar sesión', tipo: 'error' });
    }
  };

  const handleCloseModal = () => {
    setModal({ ...modal, show: false });
    if (modal.tipo === 'success') {
      navigate('/landing'); // Cambia la ruta según tu app
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
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4 text-center">
                <p className="mb-1">¿Cuentas con una cuenta? No?</p>
                <a href="/crear-password" className="text-decoration-none">Puedes crearla aquí</a>
              </div>
              <button type="submit" className="btn w-100" style={{ backgroundColor: '#e94c4c', color: 'white' }}>
                Ingresar
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* PIE DE PÁGINA */}
      <footer className="bg-esfot text-white text-center py-3">
        &copy; 2025 ASO-ESFOT. Todos los derechos reservados.
      </footer>

      {/* Modal de mensaje */}
      <ModalMensaje
        show={modal.show}
        mensaje={modal.mensaje}
        tipo={modal.tipo}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default LoginPage;

