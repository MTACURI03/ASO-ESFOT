import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showActualizarModal, setShowActualizarModal] = useState(false);
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const handleLogout = () => setShowLogoutModal(true);
  const confirmLogout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("usuario");
    navigate("/");
  };
  const cancelLogout = () => setShowLogoutModal(false);

  const handleActualizarClick = (e) => {
    e.preventDefault();
    setShowActualizarModal(true);
  };
  const confirmActualizar = () => {
    setShowActualizarModal(false);
    navigate('/actualizar-datos');
  };
  const cancelActualizar = () => setShowActualizarModal(false);

  return (
    <div className="d-flex flex-column min-vh-100" style={{ background: "linear-gradient(135deg, #004A99 0%, #e94c4c 100%)" }}>
      {/* HEADER */}
      <header className="py-3 px-4 d-flex flex-column flex-md-row justify-content-between align-items-center" style={{ background: "rgba(0,0,0,0.45)", borderBottom: "2px solid #e94c4c" }}>
        <div className="d-flex align-items-center mb-3 mb-md-0">
          <img src="/imagenes_asoesfot/logo.png" alt="ESFOT" style={{ height: '60px', marginRight: 16 }} />
          <span className="fs-3 fw-bold text-white" style={{ letterSpacing: 2 }}>ASO-ESFOT</span>
        </div>
        <nav>
          {usuario && usuario.activo === false ? (
            <>
              <Link to="/actualizar-datos" className="nav-link-custom me-3">Actualizar datos</Link>
              <span className="nav-link-custom" onClick={handleLogout}>Cerrar sesión</span>
            </>
          ) : (
            <>
              <Link to="/visualizar" className="nav-link-custom me-3">Mis Aportaciones</Link>
              <Link to="/registro" className="nav-link-custom me-3">Planes de Aportaciones</Link>
              <span className="nav-link-custom me-3" onClick={handleActualizarClick}>Actualizar datos</span>
              <span className="nav-link-custom" onClick={handleLogout}>Cerrar sesión</span>
            </>
          )}
        </nav>
      </header>

      {/* HERO */}
      <section className="d-flex flex-column align-items-center justify-content-center text-center py-5" style={{
        background: "linear-gradient(120deg, #004A99 60%, #e94c4c 100%)",
        minHeight: 350
      }}>
        <img src="/imagenes_asoesfot/Logo_ESFOT.png" alt="Logo" style={{ width: 120, height: 120, objectFit: 'contain', marginBottom: 24 }} />
        <h1 className="display-4 fw-bold text-white mb-2" style={{ textShadow: "0 2px 8px #0008" }}>APORTACIONES ASO-ESFOT</h1>
        <p className="lead text-white-50 mb-0" style={{ fontWeight: 500, textShadow: "0 1px 4px #0006" }}>
          Facilitando la gestión de aportes estudiantiles
        </p>
      </section>

      {/* CARDS */}
      <main className="container my-5 flex-grow-1">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-lg border-0" style={{ borderRadius: 18 }}>
              <img src="/imagenes_asoesfot/asotele.jpg" className="card-img-top" alt="img1" style={{ borderTopLeftRadius: 18, borderTopRightRadius: 18, height: 220, objectFit: 'cover' }} />
              <div className="card-body bg-light" style={{ borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }}>
                <h5 className="card-title fw-bold text-esfot mb-2">Modernización de la Asociación</h5>
                <p className="card-text text-secondary">
                  Empleando la modernización de la Asociación de Estudiantes de la ESFOT, mejorando instalaciones, infraestructura y servicios para los estudiantes. 👷‍♂️
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-lg border-0" style={{ borderRadius: 18 }}>
              <img src="/imagenes_asoesfot/campeones.jpg" className="card-img-top" alt="img2" style={{ borderTopLeftRadius: 18, borderTopRightRadius: 18, height: 220, objectFit: 'cover' }} />
              <div className="card-body bg-light" style={{ borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }}>
                <h5 className="card-title fw-bold text-esfot mb-2">Participación Estudiantil</h5>
                <p className="card-text text-secondary">
                  Promoviendo la participación estudiantil con torneos en diferentes disciplinas deportivas, apoyando a los deportistas hacia la excelencia y el triunfo. 🏆
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-lg border-0" style={{ borderRadius: 18 }}>
              <img src="/imagenes_asoesfot/amigos.jpg" className="card-img-top" alt="img3" style={{ borderTopLeftRadius: 18, borderTopRightRadius: 18, height: 220, objectFit: 'cover' }} />
              <div className="card-body bg-light" style={{ borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }}>
                <h5 className="card-title fw-bold text-esfot mb-2">Integración y Desarrollo</h5>
                <p className="card-text text-secondary">
                  Apoyando actividades académicas y sociales, la asociación organiza eventos que fomentan la integración y el desarrollo integral de los estudiantes. 🙌
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-esfot text-white text-center py-3 mt-auto" style={{ letterSpacing: 1 }}>
        &copy; 2025 ASO-ESFOT. Todos los derechos reservados.
      </footer>

      {/* MODALS */}
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

      {/* ESTILOS EXTRA PARA NAV-LINKS */}
      <style>{`
        .nav-link-custom {
          color: #fff !important;
          text-decoration: underline;
          padding: 4px 12px;
          border-radius: 6px;
          transition: background 0.2s, color 0.2s;
          cursor: pointer;
          display: inline-block;
        }
        .nav-link-custom:hover {
          background: #222;
          color: #fff !important;
          text-decoration: underline;
        }
        .text-esfot {
          color: #e94c4c;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
