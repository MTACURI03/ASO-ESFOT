import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Modal de bienvenida
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [adminNombre, setAdminNombre] = useState('');
  const [adminApellido, setAdminApellido] = useState('');

  useEffect(() => {
    // Obtén los datos del admin desde localStorage (ajusta según cómo guardes el usuario)
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario) {
      setAdminNombre(usuario.nombre || '');
      setAdminApellido(usuario.apellido || '');
    }
  }, []);

  const handleLogout = () => {
    // Abrir modal
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    // Cerrar modal y realizar logout
    setShowLogoutModal(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    navigate("/");
  };

  const cancelLogout = () => {
    // Solo cerrar modal
    setShowLogoutModal(false);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Modal de bienvenida */}
      {showWelcomeModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderColor: '#004A99' }}>
              <div className="modal-header bg-esfot text-white">
                <h5 className="modal-title">Bienvenido administrador</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowWelcomeModal(false)}></button>
              </div>
              <div className="modal-body text-center">
                <p className="mb-0">
                  <strong>{adminNombre} {adminApellido}</strong>
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() => setShowWelcomeModal(false)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ENCABEZADO */}
      <header className="bg-esfot text-white py-3 px-4 d-flex justify-content-between align-items-center">
        <img src="/imagenes_asoesfot/logo.png" alt="ESFOT" style={{ height: '60px' }} />
        <div>
          <Link to="/adminpage/crudpage" className="btn btn-esfot me-2">Gestionar Planes</Link>
          <Link to="/adminpage/usuariospage" className="btn btn-esfot me-2">Gestión de Usuarios</Link>
          <Link to="/adminpage/reportespage" className="btn btn-esfot me-2">Gestionar Aportantes</Link>
          <Link to="/adminpage/finanzaspage" className="btn btn-esfot me-2">Finanzas</Link>
          <button onClick={handleLogout} className="btn btn-danger">Cerrar sesión</button>
        </div>
      </header>

      {/* Modal de confirmación */}
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

      {/* CARRUSEL */}
      <div className="bg-light py-3"></div>
      <div className="container mt-4 d-flex justify-content-center">
        <div
          id="adminCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
          style={{ width: '850px', height: '600px' }}
        >
          <div className="carousel-inner rounded shadow" style={{ width: '100%', height: '100%' }}>
            <div className="carousel-item active">
              <img
                src="/imagenes_asoesfot/Logo_ESFOT.png"
                className="d-block w-100 h-100"
                style={{ objectFit: 'contain' }}
                alt="Panel de gestión"
              />
            </div>
            <div className="carousel-item">
              <img
                src="/imagenes_asoesfot/finalistas.jpg"
                className="d-block w-100 h-100"
                style={{ objectFit: 'contain' }}
                alt="Reportes financieros"
              />
            </div>
            <div className="carousel-item">
              <img
                src="/imagenes_asoesfot/directiva.jpeg"
                className="d-block w-100 h-100"
                style={{ objectFit: 'contain' }}
                alt="Seguimiento de aportes"
              />
            </div>
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#adminCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Anterior</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#adminCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Siguiente</span>
          </button>
        </div>
      </div>

      {/* CUERPO PRINCIPAL */}
      <main className="flex-grow-1 container text-center py-5">
        <h1 className="display-4 fw-bold mb-3">ADMINISTRACIÓN ASO-ESFOT</h1>
        <p className="lead mb-5 text-secondary fw-semibold">Panel de control para gestión financiera y administrativa</p>

        <div className="container my-5">
          {/* Fila 1 */}
          <div className="row align-items-center mb-4">
            <div className="col-md-6">
              <img src="/imagenes_asoesfot/asotele.jpg" alt="Gestión de aportes" className="img-fluid rounded shadow-sm" />
            </div>
            <div className="col-md-6">
              <p className="lead text-secondary fw-semibold">
                Supervisa y organiza las aportaciones de los estudiantes. Gestiona planes, fechas y verifica el cumplimiento de pagos.
              </p>
            </div>
          </div>

          {/* Fila 2 */}
          <div className="row align-items-center mb-4">
            <div className="col-md-6 order-md-2">
              <img src="/imagenes_asoesfot/campeones.jpg" alt="Reportes detallados" className="img-fluid rounded shadow-sm" />
            </div>
            <div className="col-md-6 order-md-1">
              <p className="lead text-secondary fw-semibold">
                Accede a reportes financieros, aportaciones individuales, estadísticas y más, con visualizaciones claras.
              </p>
            </div>
          </div>

          {/* Fila 3 */}
          <div className="row align-items-center mb-4">
            <div className="col-md-6">
              <img src="/imagenes_asoesfot/amigos.jpg" alt="Control financiero" className="img-fluid rounded shadow-sm" />
            </div>
            <div className="col-md-6">
              <p className="lead text-secondary fw-semibold">
                Revisa el estado de cuentas, ingresos, egresos y proyecciones financieras de la Asociación.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* PIE DE PÁGINA */}
      <footer className="bg-esfot text-white text-center py-3">
        &copy; 2025 ASO-ESFOT. Panel administrativo.
      </footer>
    </div>
  );
};

export default AdminPage;

