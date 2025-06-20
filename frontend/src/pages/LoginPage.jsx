import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [modal, setModal] = useState({ show: false, mensaje: '', tipo: 'success' });

  // ModalMensaje embebido
  const ModalMensaje = ({ show, mensaje, tipo = 'success', onClose }) => {
    const colores = {
      success: { bg: '#e94c4c', text: '#fff' },
      error: { bg: '#007bff', text: '#fff' },
      warning: { bg: '#ffc107', text: '#000' }
    };
    const color = colores[tipo] || colores.success;
    if (!show) return null;
    return (
      <div className="modal fade show" style={{display: 'block', zIndex: 1055}} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header" style={{ background: color.bg, color: color.text }}>
              <h5 className="modal-title">
                {tipo === 'success' && '¡Éxito!'}
                {tipo === 'error' && 'Error'}
                {tipo === 'warning' && 'Advertencia'}
              </h5>
            </div>
            <div className="modal-body">
              <p>{mensaje}</p>
            </div>
            <div className="modal-footer">
              <button className="btn" style={{ background: color.bg, color: color.text }} onClick={onClose} autoFocus>
                Cerrar
              </button>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show" style={{zIndex: 1040}}></div>
      </div>
    );
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!correo || !password) {
      setModal({ show: true, mensaje: 'Por favor ingresa tu correo y contraseña.', tipo: 'warning' });
      return;
    }
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
      navigate('/landing');
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

      {/* Modal de mensaje embebido */}
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

