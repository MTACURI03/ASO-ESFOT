import React, { useEffect, useState } from 'react';

const AdminSolicitudesPage = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [mensaje, setMensaje] = useState('');

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
    <div className="container py-5">
      <h2 className="mb-4" style={{ color: '#e94c4c' }}>Solicitudes de Actualización de Datos</h2>
      {mensaje && <div className="alert alert-info">{mensaje}</div>}
      {solicitudes.length === 0 ? (
        <div className="alert alert-success">No hay solicitudes pendientes.</div>
      ) : (
        <table className="table table-bordered">
          <thead>
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
                    className="btn btn-success btn-sm"
                    onClick={() => aprobarSolicitud(s._id)}
                  >
                    Aprobar y activar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminSolicitudesPage;