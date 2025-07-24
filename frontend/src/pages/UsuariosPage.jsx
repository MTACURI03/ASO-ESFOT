import React, { useState, useEffect } from 'react';
import AdminHeader from '../components/AdminHeader';

const SEMESTRES = [
  'Nivelacion', 'Primer semestre', 'Segundo semestre', 'Tercer semestre', 'Cuarto semestre', 'Quinto semestre',
];

const UsuariosPage = () => {
  const [busqueda, setBusqueda] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [modal, setModal] = useState({ show: false, step: 1, loading: false, usuarioId: null, activar: null, mensaje: '' });

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
    // Muestra el modal de confirmación final
    setModal({ show: true, step: 3, loading: false, mensaje: '¡Todas las cuentas han sido desactivadas!' });
  };

  const mostrarModal = (usuarioId = null, activar = null, step = 1) => {
    setModal({ show: true, step, loading: false, usuarioId, activar, mensaje: '' });
  };

  const cerrarModal = () => setModal({ show: false, step: 1, loading: false });

  // Función para activar/desactivar usuario individual:
  const cambiarEstadoUsuario = async () => {
    setModal(modal => ({ ...modal, loading: true }));
    await fetch(`https://aso-esfot-backend.onrender.com/api/usuarios/${modal.usuarioId}/activo`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo: !modal.activar })
    });
    setUsuarios(usuarios =>
      usuarios.map(u =>
        u._id === modal.usuarioId ? { ...u, activo: !modal.activar } : u
      )
    );
    setModal({
      show: true,
      step: 5,
      loading: false,
      usuarioId: null,
      activar: null,
      mensaje: modal.activar
        ? '¡Usuario desactivado correctamente!'
        : '¡Usuario activado correctamente!'
    });
  };

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
                    : modal.step === 2
                    ? '¿Está seguro de realizar esta acción?'
                    : modal.step === 3
                    ? 'Acción completada'
                    : modal.step === 4
                    ? (modal.activar ? 'Desactivar usuario' : 'Activar usuario')
                    : 'Acción completada'}
                </h5>
                <button type="button" className="btn-close" onClick={cerrarModal}></button>
              </div>
              <div className="modal-body">
                {modal.step === 1
                  ? '¿Desea desactivar todas las cuentas al finalizar el semestre en curso?'
                  : modal.step === 2
                  ? 'Esta acción desactivará todas las cuentas. ¿Está seguro de continuar?'
                  : modal.step === 3
                  ? modal.mensaje
                  : modal.step === 4
                  ? (modal.activar
                      ? '¿Está seguro que desea desactivar este usuario?'
                      : '¿Está seguro que desea activar este usuario?')
                  : modal.mensaje}
              </div>
              <div className="modal-footer">
                {modal.step === 1 ? (
                  <>
                    <button className="btn btn-secondary" onClick={cerrarModal} disabled={modal.loading}>Cancelar</button>
                    <button
                      className="btn btn-primary"
                      onClick={() => mostrarModal(null, null, 2)}
                      disabled={modal.loading}
                    >
                      Aceptar
                    </button>
                  </>
                ) : modal.step === 2 ? (
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
                ) : modal.step === 4 ? (
                  <>
                    <button className="btn btn-secondary" onClick={cerrarModal} disabled={modal.loading}>Cancelar</button>
                    <button
                      className={`btn ${modal.activar ? 'btn-danger' : 'btn-success'}`}
                      onClick={cambiarEstadoUsuario}
                      disabled={modal.loading}
                    >
                      {modal.loading
                        ? (modal.activar ? 'Desactivando...' : 'Activando...')
                        : (modal.activar ? 'Desactivar' : 'Activar')}
                    </button>
                  </>
                ) : (
                  <button className="btn btn-primary" onClick={cerrarModal}>Cerrar</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <AdminHeader />

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
                          onClick={() => mostrarModal(u._id, u.activo, 4)}
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