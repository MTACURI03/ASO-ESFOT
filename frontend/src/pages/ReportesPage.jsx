import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ReportesPage = () => {
  const [busqueda, setBusqueda] = useState('');
  const [aportaciones, setAportaciones] = useState([]);
  const [modal, setModal] = useState({ show: false, id: null, estadoActual: '', loading: false });

  useEffect(() => {
    fetch('https://aso-esfot-backend.onrender.com/api/planes/aportaciones')
      .then(res => res.json())
      .then(data => setAportaciones(data))
      .catch(() => setAportaciones([]));
  }, []);

  const filtrados = aportaciones.filter(ap =>
    `${ap.usuarioId?.nombre || ''} ${ap.usuarioId?.apellido || ''}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Generar reporte PDF tipo factura con logo desde public/
  const generarReportePDF = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    // Dibuja margen rojo
    doc.setDrawColor(233, 76, 76); // Rojo
    doc.setLineWidth(3);
    doc.rect(8, 8, 194, 281, 'S'); // Margen para A4

    // Cargar logo desde public/
    const logoUrl = `${window.location.origin}/imagenes_asoesfot/logo.png`;
    const getImageDataUrl = (url) =>
      fetch(url)
        .then(r => r.blob())
        .then(blob => new Promise(resolve => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        }));

    const logoDataUrl = await getImageDataUrl(logoUrl);
    doc.addImage(logoDataUrl, 'PNG', 15, 10, 30, 30);

    doc.setFontSize(18);
    doc.text('Factura de Aportaciones ASO-ESFOT', 55, 22);
    doc.setFontSize(12);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 55, 30);

    let y = 50;
    const margenInferior = 270;

    filtrados.forEach((ap, idx) => {
      doc.setFontSize(13);
      doc.setTextColor(233, 76, 76);
      doc.text(`Usuario: ${ap.usuarioId?.nombre || ''} ${ap.usuarioId?.apellido || ''}`, 20, y);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.text(`Correo: ${ap.usuarioId?.correo || ''}`, 20, y + 7);
      doc.text(`Plan: ${ap.nombrePlan}`, 20, y + 14);
      doc.text(`Fecha de selección: ${new Date(ap.fechaSeleccion).toLocaleDateString()}`, 20, y + 21);
      doc.text(`Estado: ${ap.estado}`, 20, y + 28);

      y += 38;

      // Salto de página si es necesario
      if (y > margenInferior) {
        doc.addPage();
        // Redibuja margen y logo en nueva página
        doc.setDrawColor(233, 76, 76);
        doc.setLineWidth(3);
        doc.rect(8, 8, 194, 281, 'S');
        doc.addImage(logoDataUrl, 'PNG', 15, 10, 30, 30);
        y = 50;
      }
    });

    // Pie de página
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('ASO-ESFOT © 2025', 20, 285);

    doc.save('factura_aportaciones.pdf');
  };

  // Mostrar modal de confirmación
  const mostrarModal = (id, estadoActual) => {
    setModal({ show: true, id, estadoActual, loading: false });
  };

  // Confirmar cambio de estado
  const confirmarCambioEstado = () => {
    setModal(modal => ({ ...modal, loading: true }));
    const id = modal.id;
    const estadoActual = modal.estadoActual;
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
        setModal({ show: false, id: null, estadoActual: '', loading: false });
      });
  };

  // Cerrar modal
  const cerrarModal = () => setModal({ show: false, id: null, estadoActual: '', loading: false });

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Modal de confirmación */}
      {modal.show && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title">Confirmar cambio de estado</h5>
                <button type="button" className="btn-close" onClick={cerrarModal}></button>
              </div>
              <div className="modal-body">
                ¿El usuario ya realizó el pago de su plan?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cerrarModal} disabled={modal.loading}>No</button>
                <button className="btn btn-primary" onClick={confirmarCambioEstado} disabled={modal.loading}>
                  {modal.loading ? 'Cambiando...' : 'Sí'}
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
          <Link to="/adminpage" className="btn btn-esfot me-2">Menú</Link>
          <Link to="/adminpage/usuariospage" className="btn btn-esfot me-2">Gestionar Usuarios</Link>
          <Link to="/adminpage/crudpage" className="btn btn-esfot me-2">Gestionar Planes</Link>
          <Link to="/adminpage/finanzaspage" className="btn btn-esfot me-2">Finanzas</Link>
        </div>
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
                        onClick={() => mostrarModal(ap._id, ap.estado)}
                        disabled={ap.estado === 'Pagado'}
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
