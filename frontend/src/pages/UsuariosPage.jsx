import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UsuariosPage = () => {
  const [busqueda, setBusqueda] = useState('');
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetch('https://aso-esfot-backend.onrender.com/api/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(() => setUsuarios([]));
  }, []);

  // Filtrar por semestre (puedes cambiar a select si lo deseas)
  const filtrados = usuarios.filter(
    u => (u.semestre || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  // Cambiar estado activo/inactivo
  const cambiarActivo = (id, activoActual) => {
    const nuevoActivo = !activoActual;
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
      });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Encabezado */}
      <header className="bg-esfot text-white py-3 px-4 d-flex justify-content-between align-items-center">
        <img src="/imagenes_asoesfot/logo.png" alt="ESFOT" style={{ height: '60px' }} />
        <Link to="/adminpage" className="btn btn-light">Inicio</Link>
      </header>

      {/* Cuerpo */}
      <main className="flex-grow-1 container py-5">
        <h2 className="text-center mb-4">Gestión de Usuarios</h2>

        {/* Búsqueda por semestre */}
        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por semestre (ej: 3, 4, 5...)"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
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
              {filtrados.length > 0 ? (
                filtrados.map((u, i) => (
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
                        onClick={() => cambiarActivo(u._id, u.activo)}
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