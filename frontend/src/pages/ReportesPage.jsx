import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ReportesPage = () => {
  const [busqueda, setBusqueda] = useState('');
  const [aportaciones, setAportaciones] = useState([]);

  useEffect(() => {
    fetch('https://aso-esfot-backend.onrender.com/api/planes/aportaciones')
      .then(res => res.json())
      .then(data => setAportaciones(data))
      .catch(() => setAportaciones([]));
  }, []);

  const filtrados = aportaciones.filter(ap =>
    `${ap.usuarioId?.nombre || ''} ${ap.usuarioId?.apellido || ''}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Generar reporte PDF
  const generarReportePDF = () => {
    import('jspdf').then(jsPDF => {
      const doc = new jsPDF.jsPDF();
      doc.setFontSize(16);
      doc.text('Reporte de Aportaciones ASO-ESFOT', 20, 20);
      doc.setFontSize(12);
      let y = 35;
      filtrados.forEach((ap, i) => {
        doc.text(
          `${i + 1}. ${ap.usuarioId?.nombre || ''} ${ap.usuarioId?.apellido || ''} - ${ap.usuarioId?.correo || ''} - ${ap.nombrePlan} - ${new Date(ap.fechaSeleccion).toLocaleDateString()} - ${ap.estado}`,
          20,
          y
        );
        y += 8;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
      doc.save('reporte_aportaciones.pdf');
    });
  };

  const cambiarEstado = (id, estadoActual) => {
    const nuevoEstado = estadoActual === 'Pagado' ? 'Pendiente' : 'Pagado';
    fetch(`https://aso-esfot-backend.onrender.com/api/planes/aportaciones/${id}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado }),
    })
      .then(res => res.json())
      .then(() => {
        setAportaciones(aportaciones =>
          aportaciones.map(ap =>
            ap._id === id ? { ...ap, estado: nuevoEstado } : ap
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
        <h2 className="text-center mb-4">Gestion de Aportantes</h2>

        {/* Búsqueda y botón de reporte */}
        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o apellido"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button className="btn btn-danger" onClick={generarReportePDF}>
            Generar Reporte
          </button>
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
                <th>Plan</th>
                <th>Fecha de Registro</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length > 0 ? (
                filtrados.map((ap, i) => (
                  <tr key={ap._id}>
                    <td>{i + 1}</td>
                    <td>{ap.usuarioId?.nombre || ''}</td>
                    <td>{ap.usuarioId?.apellido || ''}</td>
                    <td>{ap.usuarioId?.correo || ''}</td>
                    <td>{ap.nombrePlan}</td>
                    <td>{new Date(ap.fechaSeleccion).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${ap.estado === 'Pagado' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {ap.estado}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => cambiarEstado(ap._id, ap.estado)}
                      >
                        Cambiar estado
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-muted">No se encontraron aportaciones.</td>
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

export default ReportesPage;
