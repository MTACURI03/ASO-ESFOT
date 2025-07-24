import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const StudentHeader = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showActualizarModal, setShowActualizarModal] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioData = JSON.parse(localStorage.getItem('usuario'));
    setUsuario(usuarioData);
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("usuario");
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleActualizarClick = (e) => {
    e.preventDefault();
    setShowActualizarModal(true);
  };

  const confirmActualizar = () => {
    setShowActualizarModal(false);
    navigate('/actualizar-datos');
  };

  const cancelActualizar = () => {
    setShowActualizarModal(false);
  };

  return (
    <>
      {/* ENCABEZADO */}
      <header className="bg-esfot text-white py-3 px-4 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <img src="/imagenes_asoesfot/logo.png" alt="ESFOT" style={{ height: '60px' }} />
          <div className="ms-3 d-flex align-items-center">
            <i className="bi bi-person-circle" style={{ fontSize: '2rem', color: 'white' }}></i>
            <span className="ms-2" style={{ fontSize: '1.25rem' }}>Hola, {usuario?.nombre || 'Usuario'}</span>
          </div>
        </div>
        <div>
          {usuario && usuario.activo === false ? (
            <>
              <Link to="/actualizar-datos" className="nav-link-custom me-3" style={{ fontSize: '1.25rem' }}>
                Actualizar Datos
              </Link>
              <span
                className="nav-link-custom"
                onClick={handleLogout}
                style={{ fontSize: '1.25rem', cursor: 'pointer' }}
              >
                Cerrar Sesión
              </span>
            </>
          ) : (
            <>
              <Link to="/landing" className="nav-link-custom me-3" style={{ fontSize: '1.25rem' }}>
                Inicio
              </Link>
              <Link to="/visualizar" className="nav-link-custom me-3" style={{ fontSize: '1.25rem' }}>
                Mis Aportaciones
              </Link>
              <Link to="/registro" className="nav-link-custom me-3" style={{ fontSize: '1.25rem' }}>
                Planes de Aportaciones
              </Link>
              <span
                className="nav-link-custom me-3"
                onClick={handleActualizarClick}
                style={{ fontSize: '1.25rem', cursor: 'pointer' }}
              >
                Actualizar Datos
              </span>
              <span
                className="nav-link-custom"
                onClick={handleLogout}
                style={{ fontSize: '1.25rem', cursor: 'pointer' }}
              >
                Cerrar Sesión
              </span>
            </>
          )}
        </div>
      </header>

      {/* Modal de advertencia para actualizar datos */}
      {showActualizarModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderColor: '#e94c4c' }}>
              <div className="modal-header bg-esfot text-white">
                <h5 className="modal-title">Atención</h5>
                <button type="button" className="btn-close btn-close-white" onClick={cancelActualizar}></button>
              </div>
              <div className="modal-body">
                <p>Solo actualiza tus datos si es realmente necesario.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelActualizar}>Cancelar</button>
                <button type="button" className="btn btn-esfot" style={{ background: '#e94c4c', color: '#fff' }} onClick={confirmActualizar}>Continuar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de cierre de sesión */}
      {showLogoutModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderColor: '#004A99' }}>
              <div className="modal-header bg-esfot text-white">
                <h5 className="modal-title">Confirmar cierre de sesión</h5>
                <button type="button" className="btn-close btn-close-white" onClick={cancelLogout}></button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de cerrar sesión?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelLogout}>Cancelar</button>
                <button type="button" className="btn btn-danger" onClick={confirmLogout}>Cerrar sesión</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentHeader;