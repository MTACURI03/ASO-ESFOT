import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ActualizarPasswordPage = () => {
  const [correo, setCorreo] = useState('');
  const [passwordActual, setPasswordActual] = useState('');
  const [nuevoPassword, setNuevoPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [showPasswordActual, setShowPasswordActual] = useState(false);
  const [showNuevoPassword, setShowNuevoPassword] = useState(false);
  const navigate = useNavigate();

  const handleActualizar = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
      const res = await fetch('https://aso-esfot-backend.onrender.com/api/usuarios/actualizar-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, passwordActual, nuevoPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMensaje('Contraseña actualizada correctamente. Redirigiendo al login...');
        setTimeout(() => navigate('/'), 1800);
      } else {
        setMensaje(data.mensaje || 'Error al actualizar la contraseña.');
      }
    } catch (err) {
      setMensaje('Error de red.');
    }
  };

  const labelStyle = { color: '#e94c4c', fontWeight: 'bold' };
  const inputStyle = { color: '#222', fontWeight: 'bold' };

  // SVG ojo simple
  const EyeIcon = ({ open }) => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      style={{ cursor: 'pointer' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {open ? (
        <>
          <ellipse cx="11" cy="11" rx="7" ry="4" stroke="#e94c4c" strokeWidth="2" fill="none" />
          <circle cx="11" cy="11" r="1.8" fill="#e94c4c" />
        </>
      ) : (
        <>
          <ellipse cx="11" cy="11" rx="7" ry="4" stroke="#e94c4c" strokeWidth="2" fill="none" />
          <circle cx="11" cy="11" r="1.8" fill="#e94c4c" />
          <line x1="5" y1="17" x2="17" y2="5" stroke="#e94c4c" strokeWidth="2" />
        </>
      )}
    </svg>
  );

  return (
    <div className="d-flex flex-column min-vh-100" style={{ background: '#f8f9fa' }}>
      <header className="bg-esfot text-white py-3 px-4 d-flex justify-content-between align-items-center" style={{ background: '#e94c4c' }}>
        <img src="/imagenes_asoesfot/logo.png" alt="ESFOT" style={{ height: '60px' }} />
        <Link to="/" className="btn btn-esfot me-2">Volver</Link>
      </header>
      <main className="flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="card shadow" style={{ maxWidth: 420, width: '100%', borderTop: '5px solid #e94c4c' }}>
          <div className="card-body">
            <h2 className="mb-4 text-center" style={{ color: '#e94c4c', fontWeight: 'bold' }}>Actualizar Contraseña</h2>
            <form onSubmit={handleActualizar}>
              <div className="mb-3">
                <label className="form-label" style={labelStyle}>Correo institucional</label>
                <input type="email" className="form-control" style={inputStyle} value={correo} onChange={e => setCorreo(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label" style={labelStyle}>Contraseña actual</label>
                <div className="input-group">
                  <input
                    type={showPasswordActual ? "text" : "password"}
                    className="form-control"
                    style={inputStyle}
                    value={passwordActual}
                    onChange={e => setPasswordActual(e.target.value)}
                    required
                  />
                  <span
                    className="input-group-text"
                    style={{ background: 'transparent', border: 'none', paddingLeft: 6, cursor: 'pointer' }}
                    onClick={() => setShowPasswordActual(v => !v)}
                  >
                    <EyeIcon open={showPasswordActual} />
                  </span>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label" style={labelStyle}>Nueva contraseña</label>
                <div className="input-group">
                  <input
                    type={showNuevoPassword ? "text" : "password"}
                    className="form-control"
                    style={inputStyle}
                    value={nuevoPassword}
                    onChange={e => setNuevoPassword(e.target.value)}
                    required
                  />
                  <span
                    className="input-group-text"
                    style={{ background: 'transparent', border: 'none', paddingLeft: 6, cursor: 'pointer' }}
                    onClick={() => setShowNuevoPassword(v => !v)}
                  >
                    <EyeIcon open={showNuevoPassword} />
                  </span>
                </div>
              </div>
              <button type="submit" className="btn w-100" style={{ background: '#e94c4c', color: '#fff', fontWeight: 'bold' }}>Actualizar</button>
              {mensaje && <div className="mt-3 alert alert-info text-center">{mensaje}</div>}
            </form>
          </div>
        </div>
      </main>
      <footer className="bg-esfot text-white text-center py-3" style={{ background: '#e94c4c' }}>
        &copy; 2025 ASO-ESFOT. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default ActualizarPasswordPage;