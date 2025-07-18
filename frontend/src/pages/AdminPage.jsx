import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [adminNombre, setAdminNombre] = useState('');
  const [adminApellido, setAdminApellido] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario) {
      setAdminNombre(usuario.nombre || '');
      setAdminApellido(usuario.apellido || '');

      // Mostrar los modales solo una vez al iniciar sesión
      const modalesMostrados = localStorage.getItem('modalesMostrados');
      if (!modalesMostrados) {
        setShowWelcomeModal(true);
        localStorage.setItem('modalesMostrados', 'true');
      }
    }
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(true); // Siempre muestra el modal de cierre de sesión
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("usuario");
    localStorage.removeItem("modalesMostrados");
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleWelcomeModalClose = () => {
    setShowWelcomeModal(false);
    setShowAccountModal(true); // Mostrar el segundo modal
  };

  const handleAccountModalClose = () => {
    setShowAccountModal(false);
  };

  const handleCreateAccount = () => {
    navigate('/crear-password'); // Redirige a la página de registro
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Modal de bienvenida */}
      {showWelcomeModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-esfot text-white">
                <h5 className="modal-title">¡Hola Administrador!</h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleWelcomeModalClose}></button>
              </div>
              <div className="modal-body">
                <p>Bienvenido, {adminNombre} {adminApellido}. ¡Esperamos que tengas un excelente día!</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handleWelcomeModalClose}>
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de cuenta de usuario */}
      {showAccountModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-esfot text-white">
                <h5 className="modal-title">¿Deseas crear una cuenta de usuario?</h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleAccountModalClose}></button>
              </div>
              <div className="modal-body">
                <p>¿Ya tienes una cuenta de usuario o deseas crear una nueva?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handleCreateAccount}>
                  Crear cuenta
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleAccountModalClose}>
                  Ya tengo una cuenta
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
          <Link to="/adminpage/crudpage" className="nav-link-custom me-3" style={{ fontSize: '1.25rem' }}>
            Planes
          </Link>
          <Link to="/adminpage/usuariospage" className="nav-link-custom me-3" style={{ fontSize: '1.25rem' }}>
            Usuarios
          </Link>
          <Link to="/adminpage/reportespage" className="nav-link-custom me-3" style={{ fontSize: '1.25rem' }}>
            Aportantes
          </Link>
          <Link to="/adminpage/finanzaspage" className="nav-link-custom me-3" style={{ fontSize: '1.25rem' }}>
            Finanzas
          </Link>
          <Link to="/admin/solicitudes" className="nav-link-custom me-3" style={{ fontSize: '1.25rem' }}>
            Solicitudes de Actualización
          </Link>
          <span
            className="nav-link-custom"
            onClick={handleLogout}
            style={{ fontSize: '1.25rem', cursor: 'pointer' }}
          >
            Cerrar sesión
          </span>
        </div>
      </header>

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

