import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdminSolicitudesPage = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  // Cargar solicitudes pendientes al montar
  useEffect(() => {
    fetch('https://aso-esfot-backend.onrender.com/api/solicitudes')
      .then(res => res.json())
      .then(data => setSolicitudes(data))
      .catch(() => setMensaje('Error al cargar solicitudes'));
  }, []);

  // Aprobar solicitud
  const aprobarSolicitud = async (id) => {
    setMensaje('');
    try {
      const res = await fetch(`https://aso-esfot-backend.onrender.com/api/usuarios/aprobar-actualizacion/${id}`, {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok) {
        setMensaje('Solicitud aprobada y datos actualizados.');
        setSolicitudes(solicitudes.filter(s => s._id !== id));
      } else {
        setMensaje(data.mensaje || 'Error al aprobar solicitud.');
      }
    } catch {
      setMensaje('Error de red.');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* ENCABEZADO */}
      <header className="bg-esfot text-white py-3 px-4 d-flex justify-content-between align-items-center">
        <img src="/imagenes_asoesfot/logo.png" alt="ESFOT" style={{ height: '60px', marginRight: '16px' }} />
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
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="container flex-grow-1 py-5">
        <h2 className="text-center mb-4">Solicitudes de Actualización de Datos</h2>
        {mensaje && <div className="alert alert-info">{mensaje}</div>}
        {solicitudes.length === 0 ? (
          <div className="alert alert-success">No hay solicitudes pendientes.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Estudiante</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Carrera</th>
                  <th>Semestre</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map(s => (
                  <tr key={s._id}>
                    <td>{s.usuario?.nombre} {s.usuario?.apellido}</td>
                    <td>{s.usuario?.correo}</td>
                    <td>{s.telefono}</td>
                    <td>{s.carrera}</td>
                    <td>{s.semestre}</td>
                    <td>
                      <button
                        className="btn btn-dark btn-sm"
                        style={{ fontWeight: 'bold' }}
                        onClick={() => aprobarSolicitud(s._id)}
                      >
                        Aprobar y activar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* PIE DE PÁGINA */}
      <footer className="bg-esfot text-white text-center py-3 mt-auto">
        &copy; 2025 ASO-ESFOT. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default AdminSolicitudesPage;