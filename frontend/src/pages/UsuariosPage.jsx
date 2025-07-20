import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SEMESTRES = [
  'Nivelacion', 'Primer semestre', 'Segundo semestre', 'Tercer semestre', 'Cuarto semestre', 'Quinto semestre',
];

const UsuariosPage = () => {
  const [busqueda, setBusqueda] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [modal, setModal] = useState({ show: false, step: 1, loading: false });

  useEffect(() => {
    const url = busqueda
      ? `https://aso-esfot-backend.onrender.com/api/usuarios?semestre=${encodeURIComponent(busqueda)}`
      : 'https://aso-esfot-backend.onrender.com/api/usuarios';
    fetch(url)
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(() => setUsuarios([]));
  }, [busqueda]);

  const desactivarTodasCuentas = async () => {
    setModal(modal => ({ ...modal, loading: true }));
    await fetch('https://aso-esfot-backend.onrender.com/api/usuarios/desactivar-todos', {
      method: 'POST',
    });
    setUsuarios(usuarios.map(u => ({ ...u, activo: false })));
    setModal({ show: false, step: 1, loading: false });
    alert('Todas las cuentas han sido desactivadas.');
  };

  const mostrarModal = (step) => {
    setModal({ show: true, step, loading: false });
  };

  const cerrarModal = () => setModal({ show: false, step: 1, loading: false });

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Modal de confirmación */}
      {modal.show && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title">
                  {modal.step === 1
                    ? 'Confirmar acción'
                    : '¿Está seguro de realizar esta acción?'}
                </h5>
                <button type="button" className="btn-close" onClick={cerrarModal}></button>
              </div>
              <div className="modal-body">
                {modal.step === 1
                  ? '¿Desea desactivar todas las cuentas al finalizar el semestre en curso?'
                  : 'Esta acción desactivará todas las cuentas. ¿Está seguro de continuar?'}
              </div>
              <div className="modal-footer">
                {modal.step === 1 ? (
                  <>
                    <button className="btn btn-secondary" onClick={cerrarModal} disabled={modal.loading}>Cancelar</button>
                    <button
                      className="btn btn-primary"
                      onClick={() => mostrarModal(2)}
                      disabled={modal.loading}
                    >
                      Aceptar
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-secondary" onClick={cerrarModal} disabled={modal.loading}>Cancelar</button>
                    <button
                      className="btn btn-danger"
                      onClick={desactivarTodasCuentas}
                      disabled={modal.loading}
                    >
                      {modal.loading ? 'Desactivando...' : 'Aceptar'}
                    </button>
                  </>
                )}
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
            Inicio
          </Link>
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

        {/* Botón para desactivar todas las cuentas */}
        <div className="mb-4 text-end">
          <button className="btn btn-danger" onClick={() => mostrarModal(1)}>Desactivar todas las cuentas</button>
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