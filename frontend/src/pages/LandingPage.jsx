import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showActualizarModal, setShowActualizarModal] = useState(false);
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("usuario"); // <-- necesario para cerrar sesión correctamente
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Nuevo: Modal para advertencia de actualización de datos
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
    <div className="d-flex flex-column min-vh-100">
      {/* ENCABEZADO */}
      <header className="bg-esfot text-white py-3 px-4 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <img src="/imagenes_asoesfot/logo.png" alt="ESFOT" style={{ height: '60px' }} />
          <div className="ms-3 d-flex align-items-center">
            <i className="bi bi-person-circle" style={{ fontSize: '1.5rem', color: 'white' }}></i> {/* Ícono de usuario */}
            <span className="ms-2">Hola, {usuario?.nombre || 'Usuario'}</span> {/* Mensaje con el nombre del usuario */}
          </div>
        </div>
        <div>
          {(() => {
            const usuario = JSON.parse(localStorage.getItem('usuario'));
            if (usuario && usuario.activo === false) {
              return (
                <>
                  <Link to="/actualizar-datos" className="nav-link-custom me-3">
                    Actualizar datos
                  </Link>
                  <span
                    className="nav-link-custom"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </span>
                </>
              );
            }
            // Si el usuario está activo, muestra los otros links normales:
            return (
              <>
                <Link to="/visualizar" className="nav-link-custom me-3">
                  Mis Aportaciones
                </Link>
                <Link to="/registro" className="nav-link-custom me-3">
                  Planes de Aportaciones
                </Link>
                <span
                  className="nav-link-custom me-3"
                  onClick={handleActualizarClick}
                >
                  Actualizar datos
                </span>
                <span
                  className="nav-link-custom"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </span>
              </>
            );
          })()}
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

      <div className="bg-light py-3"></div>

      <div className="container mt-4 d-flex justify-content-center">
        <div
          id="asoCarousel"
          className="carousel slide w-100"
          data-bs-ride="carousel"
          data-bs-interval="3000" // Reproducción automática cada 3 segundos
          style={{
            maxWidth: '800px', // Ajusta el tamaño del carrusel
            maxHeight: '500px',
            width: '100%',
            height: 'auto'
          }}
        >
          <div className="carousel-inner rounded shadow" style={{ width: '100%', height: '100%' }}>
            <div className="carousel-item active">
              <img
                src="/imagenes_asoesfot/Logo_ESFOT.png"
                className="d-block w-100 h-100"
                style={{ objectFit: 'cover', maxHeight: '500px' }}
                alt="Logo"
              />
            </div>
            <div className="carousel-item">
              <img
                src="/imagenes_asoesfot/directiva.jpeg"
                className="d-block w-100 h-100"
                style={{ objectFit: 'cover', maxHeight: '500px' }}
                alt="Directiva"
              />
            </div>
            <div className="carousel-item">
              <img
                src="/imagenes_asoesfot/finalistas.jpg"
                className="d-block w-100 h-100"
                style={{ objectFit: 'cover', maxHeight: '500px' }}
                alt="Finalistas"
              />
            </div>
          </div>

          {/* Botón anterior */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#asoCarousel"
            data-bs-slide="prev"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '50%' }}
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Anterior</span>
          </button>

          {/* Botón siguiente */}
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#asoCarousel"
            data-bs-slide="next"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '50%' }}
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Siguiente</span>
          </button>
        </div>
      </div>

      {/* CUERPO PRINCIPAL */}
      <main className="flex-grow-1 container text-center py-5">
        <h1 className="display-4 fw-bold mb-3">APORTACIONES ASO-ESFOT</h1>
        <p className="lead mb-5 text-secondary fw-semibold">Facilitando la gestión de aportes estudiantiles</p>
        <div className="container my-5">
          {/* Fila 1 */}
          <div className="row align-items-center mb-4">
            <div className="col-md-6">
              <img src="/imagenes_asoesfot/asotele.jpg" alt="img1" className="img-fluid rounded shadow-sm" />
            </div>
            <div className="col-md-6">
              <p className="lead text-secondary fw-semibold">
                Empleando la modernizacion de la Asociacion
                de Estudiantes de la ESFOT, modernizando sus instalaciones ademas de mejorar la infraestructura
                y los servicios que ofrece a los estudiantes.👷‍♂️
              </p>
            </div>
          </div>

          {/* Fila 2 */}
          <div className="row align-items-center mb-4">
            <div className="col-md-6 order-md-2">
              <img src="/imagenes_asoesfot/campeones.jpg" alt="img2" className="img-fluid rounded shadow-sm" />
            </div>
            <div className="col-md-6 order-md-1">
              <p className="lead text-secondary fw-semibold">
                Promoviendo la participación estudiantil, al tener diferentes torneos in diferentes disciplinas
                deportivas,se centra en la ayuda a los deportistas y colabora en el camino hacia la excelencia y el trinunfo.🏆
              </p>
            </div>
          </div>

          {/* Fila 3 */}
          <div className="row align-items-center mb-4">
            <div className="col-md-6">
              <img src="/imagenes_asoesfot/amigos.jpg" alt="img3" className="img-fluid rounded shadow-sm" />
            </div>
            <div className="col-md-6">
              <p className="lead text-secondary fw-semibold">
                Apoyando actividades académicas y sociales, la asociación organiza eventos que fomentan la integración
                y el desarrollo integral de los estudiantes, creando un ambiente propicio para el aprendizaje y la convivencia.🙌
              </p>
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

export default LandingPage;
