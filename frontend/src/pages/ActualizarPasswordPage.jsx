import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ActualizarPasswordPage = () => {
  const [correo, setCorreo] = useState('');
  const [nuevoPassword, setNuevoPassword] = useState('');
  const [repetirPassword, setRepetirPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [showNuevoPassword, setShowNuevoPassword] = useState(false);
  const [showRepetirPassword, setShowRepetirPassword] = useState(false);
  const [modal, setModal] = useState({ show: false, title: '', message: '' });
  const navigate = useNavigate();

  const handleActualizar = async (e) => {
    e.preventDefault();
    setMensaje('');
    if (nuevoPassword !== repetirPassword) {
      setMensaje('Las contraseñas no coinciden.');
      return;
    }
    try {
      const res = await fetch('https://aso-esfot-backend.onrender.com/api/usuarios/actualizar-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, nuevoPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setModal({
          show: true,
          title: 'Contraseña actualizada',
          message: 'Tu contraseña se ha actualizado correctamente. Presiona "Aceptar" para ir al login.',
        });
        // El navigate('/') solo se ejecuta al presionar "Aceptar" en el modal
      } else {
        setModal({ show: true, title: 'Error', message: data.mensaje || 'Error al actualizar la contraseña.' });
      }
    } catch (err) {
      setModal({ show: true, title: 'Error', message: 'Error de red.' });
    }
  };

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
        <div className="card shadow" style={{ maxWidth: 420, width: '100%', borderTop: '5px solid rgb(2, 2, 2)' }}>
          <div className="card-body">
            <h2 className="text-center mb-4">Actualizar Contraseña</h2>
            <form onSubmit={handleActualizar}>
              <div className="mb-3">
                <label className="text-center mb-4">Correo institucional</label>
                <input type="email" className="form-control" style={inputStyle} value={correo} onChange={e => setCorreo(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="text-center mb-4">Nueva contraseña</label>
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
              <div className="mb-3">
                <label className="text-center mb-4">Repetir nueva contraseña</label>
                <div className="input-group">
                  <input
                    type={showRepetirPassword ? "text" : "password"}
                    className="form-control"
                    style={inputStyle}
                    value={repetirPassword}
                    onChange={e => setRepetirPassword(e.target.value)}
                    required
                  />
                  <span
                    className="input-group-text"
                    style={{ background: 'transparent', border: 'none', paddingLeft: 6, cursor: 'pointer' }}
                    onClick={() => setShowRepetirPassword(v => !v)}
                  >
                    <EyeIcon open={showRepetirPassword} />
                  </span>
                </div>
              </div>
              <button type="submit" className="btn w-100" style={{ backgroundColor: '#e94c4c', color: 'white' }}>
                Actualizar
              </button>
              {mensaje && <div className="mt-3 alert alert-info text-center">{mensaje}</div>}
            </form>
          </div>
        </div>
      </main>
      <footer className="bg-esfot text-white text-center py-3" style={{ background: '#e94c4c' }}>
        &copy; 2025 ASO-ESFOT. Todos los derechos reservados.
      </footer>
      {modal.show && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className={`modal-header ${modal.title === 'Contraseña actualizada' ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                <h5 className="modal-title">{modal.title}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => {
                    if (modal.title === 'Contraseña actualizada') {
                      navigate('/');
                    } else {
                      setModal({ show: false, title: '', message: '' });
                    }
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>{modal.message}</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (modal.title === 'Contraseña actualizada') {
                      navigate('/');
                    } else {
                      setModal({ show: false, title: '', message: '' });
                    }
                  }}
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActualizarPasswordPage;