import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SEMESTRES = [
  'Nivelacion', 'Primer semestre', 'Segundo semestre', 'Tercer semestre', 'Cuarto semestre', 'Quinto semestre',
];

const UsuariosPage = () => {
  const [busqueda, setBusqueda] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [modal, setModal] = useState({ show: false, id: null, activoActual: true, loading: false });

  useEffect(() => {
    const url = busqueda
      ? `https://aso-esfot-backend.onrender.com/api/usuarios?semestre=${encodeURIComponent(busqueda)}`
      : 'https://aso-esfot-backend.onrender.com/api/usuarios';
    fetch(url)
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(() => setUsuarios([]));
  }, [busqueda]);

  const confirmarCambioActivo = (nuevoActivo) => {
    setModal(modal => ({ ...modal, loading: true }));
    const id = modal.id;
    fetch(`https://aso-esfot-backend.onrender.com/api/usuarios/${id}/activo`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo: nuevoActivo }),
    })
      .then(res => res.json())
      .then(() => {
        setUsuarios(usuarios =>
          usuarios.map(u =>
            u._id === id ? { ...u, activo: nuevoActivo } : u
          )
        );
        setModal({ show: false, id: null, activoActual: true, loading: false });
      });
  };

  const mostrarModal = (id, activoActual) => {
    setModal({ show: true, id, activoActual, loading: false });
  };

  const cerrarModal = () => setModal({ show: false, id: null, activoActual: true, loading: false });

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Modal de confirmación */}
      {modal.show && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title">
                  {modal.activoActual ? 'Confirmar inactivación' : 'Confirmar activación'}
                </h5>
                <button type="button" className="btn-close" onClick={cerrarModal}></button>
              </div>
              <div className="modal-body">
                {modal.activoActual
                  ? '¿Seguro que quieres inactivar este usuario? No podrá iniciar sesión.'
                  : '¿Seguro que quieres activar este usuario? Podrá iniciar sesión.'}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cerrarModal} disabled={modal.loading}>No</button>
                <button
                  className={`btn ${modal.activoActual ? 'btn-danger' : 'btn-success'}`}
                  onClick={() => confirmarCambioActivo(!modal.activoActual)}
                  disabled={modal.loading}
                >
                  {modal.loading
                    ? (modal.activoActual ? 'Inactivando...' : 'Activando...')
                    : 'Sí'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Encabezado */}
      <header className="bg-esfot text-white py-3 px-4 d-flex justify-content-between align-items-center">
        <img src="/imagenes_asoesfot/logo.png" alt="ESFOT" style={{ height: '60px' }} />
        <div>
          <Link to="/adminpage" className="nav-link-custom me-3" style={{ fontSize: '1.25rem' }}>
            Menú
          </Link>
          <Link to="/adminpage/crudpage" className="nav-link-custom me-3" style={{ fontSize: '1.25rem' }}>
            Gestionar Planes
          </Link>
          <Link to="/adminpage/usuariospage" className="nav-link-custom me-3" style={{ fontSize: '1.25rem' }}>
            Gestión de Usuarios
          </Link>
          <Link to="/adminpage/reportespage" className="nav-link-custom me-3" style={{ fontSize: '1.25rem' }}>
            Gestionar Aportantes
          </Link>
          <Link to="/adminpage/finanzaspage" className="nav-link-custom me-3" style={{ fontSize: '1.25rem' }}>
            Finanzas
          </Link>
          <Link to="/admin/solicitudes" className="nav-link-custom me-3" style={{ fontSize: '1.25rem' }}>
            Solicitudes de Actualización
          </Link>
          <span
            className="nav-link-custom"
            onClick={() => {
              localStorage.removeItem("isAuthenticated");
              localStorage.removeItem("usuario");
              window.location.href = "/";
            }}
            style={{ fontSize: '1.25rem', cursor: 'pointer' }}
          >
            Cerrar sesión
          </span>
        </div>
      </header>

      {/* Cuerpo */}
      <main className="flex-grow-1 container py-5">
        <h2 className="text-center mb-4">Gestión de Usuarios</h2>

        {/* Búsqueda por semestre */}
        <div className="input-group mb-4">
          <label className="input-group-text" htmlFor="select-semestre">Filtrar por semestre</label>
          <select
            id="select-semestre"
            className="form-select"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          >
            <option value="">Todos</option>
            {SEMESTRES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Tabla */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Semestre</th>
                <th>Activo</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length > 0 ? (
                usuarios
                  .filter(u =>
                    u.rol === 'estudiante' &&
                    (
                      !busqueda ||
                      (u.semestre && u.semestre.toLowerCase() === busqueda.toLowerCase())
                    )
                  )
                  .map((u, i) => (
                    <tr key={u._id}>
                      <td>{i + 1}</td>
                      <td>{u.nombre || ''}</td>
                      <td>{u.apellido || ''}</td>
                      <td>{u.correo || ''}</td>
                      <td>{u.semestre || ''}</td>
                      <td>
                        <span className={`badge ${u.activo ? 'bg-success' : 'bg-danger'}`}>
                          {u.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`btn btn-sm ${u.activo ? 'btn-outline-danger' : 'btn-outline-success'}`}
                          onClick={() => mostrarModal(u._id, u.activo)}
                          disabled={modal.loading}
                        >
                          {u.activo ? 'Desactivar' : 'Activar'}
                        </button>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted">No se encontraron usuarios.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Pie de página */}
      <footer className="bg-esfot text-white text-center py-3">
        &copy; 2025 ASO-ESFOT. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default UsuariosPage;