import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const FinanzasPage = () => {
  const [saldo, setSaldo] = useState(0);
  const [gastos, setGastos] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [nuevoGasto, setNuevoGasto] = useState({ descripcion: '', monto: '' });

  // Trae el saldo, los gastos y los pagos
  useEffect(() => {
    fetch('https://aso-esfot-backend.onrender.com/api/finanzas/saldo')
      .then(res => res.json())
      .then(data => setSaldo(data.saldo));
    fetch('https://aso-esfot-backend.onrender.com/api/finanzas/gastos')
      .then(res => res.json())
      .then(data => setGastos(data));
    fetch('https://aso-esfot-backend.onrender.com/api/planes/aportaciones')
      .then(res => res.json())
      .then(data => setPagos(data.filter(p => p.estado === 'Pagado')));
  }, []);

  // Registrar un gasto
  const handleAddGasto = (e) => {
    e.preventDefault();
    fetch('https://aso-esfot-backend.onrender.com/api/finanzas/gastar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoGasto),
    })
      .then(res => res.json())
      .then(data => {
        setSaldo(data.saldo);
        setGastos(prev => [...prev, { ...nuevoGasto, fecha: new Date().toISOString().split('T')[0] }]);
        setNuevoGasto({ descripcion: '', monto: '' });
      });
  };

  // Generar reporte PDF tipo factura con tabla doble (aportaciones y gastos)
  const generarReportePDF = () => {
    import('jspdf').then(jsPDF => {
      const doc = new jsPDF.jsPDF();

      // Dimensiones generales
      const xInicio = 15;
      const anchoTotal = 180;
      const alturaSeccion = 40; // Altura de cada sección
      const yInicio = 50;

      // Rectángulo general dividido en cinco secciones
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);
      doc.rect(xInicio, yInicio, anchoTotal, alturaSeccion * 5); // Rectángulo general

      // Líneas horizontales para dividir las secciones
      for (let i = 1; i <= 5; i++) {
        doc.line(xInicio, yInicio + alturaSeccion * i, xInicio + anchoTotal, yInicio + alturaSeccion * i);
      }

      // Primera sección: Título "Aportaciones"
      doc.setFontSize(14);
      doc.setTextColor(233, 76, 76);
      doc.text('Aportaciones', xInicio + 5, yInicio + 10);

      // Segunda sección: Lista de aportaciones
      let y = yInicio + alturaSeccion + 10;
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      pagos.forEach((pago, index) => {
        doc.text(
          `${index + 1}. ${pago.fechaSeleccion ? new Date(pago.fechaSeleccion).toLocaleDateString() : ''} - ${pago.usuarioId?.nombre || ''} - ${pago.nombrePlan} - $${pago.precio}`,
          xInicio + 5,
          y
        );
        y += 5;
      });

      // Tercera sección: Título "Gastos"
      doc.setFontSize(14);
      doc.setTextColor(233, 76, 76);
      doc.text('Gastos', xInicio + 5, yInicio + alturaSeccion * 2 + 10);

      // Cuarta sección: Lista de gastos
      y = yInicio + alturaSeccion * 3 + 10;
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      gastos.forEach((gasto, index) => {
        doc.text(
          `${index + 1}. ${gasto.fecha || ''} - ${gasto.descripcion} - $${gasto.monto}`,
          xInicio + 5,
          y
        );
        y += 5;
      });

      // Quinta sección: Saldo total
      doc.setFontSize(14);
      doc.setTextColor(40, 167, 69);
      doc.text(`Saldo total: $${saldo}`, xInicio + 5, yInicio + alturaSeccion * 4 + 20);

      // Pie de página
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text('ASO-ESFOT © 2025 | Este documento es solo informativo.', 20, 285);

      doc.save('factura_finanzas.pdf');
    });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* ENCABEZADO */}
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

      {/* CUERPO */}
      <main className="flex-grow-1 container py-4">
        <h2 className="text-center mb-4">Gestión Financiera - ASO ESFOT</h2>
        <div className="alert alert-info text-center fs-5 fw-bold">
          Saldo Total: ${saldo.toFixed(2)}
        </div>

        {/* Apartado de historial de pagos */}
        <h4 className="mt-4">Historial de Pagos (Aportaciones Pagadas)</h4>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Plan</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {pagos.length > 0 ? pagos.map((p, i) => (
              <tr key={i}>
                <td>{new Date(p.fechaSeleccion).toLocaleDateString()}</td>
                <td>{p.usuarioId?.nombre || ''}</td>
                <td>{p.usuarioId?.apellido || ''}</td>
                <td>{p.nombrePlan}</td>
                <td>${p.precio}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">No hay pagos registrados.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Formulario de gastos */}
        <form className="mb-4" onSubmit={handleAddGasto}>
          <div className="row g-2 align-items-end">
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Descripción del gasto"
                value={nuevoGasto.descripcion}
                onChange={e => setNuevoGasto({ ...nuevoGasto, descripcion: e.target.value })}
                required
              />
            </div>
            <div className="col">
              <input
                type="number"
                className="form-control"
                placeholder="Monto"
                value={nuevoGasto.monto}
                onChange={e => setNuevoGasto({ ...nuevoGasto, monto: e.target.value })}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="col-auto">
              <button className="btn btn-danger" type="submit">Registrar Gasto</button>
            </div>
            <div className="col-auto">
              <button className="btn btn-success" type="button" onClick={generarReportePDF}>Generar Reporte PDF</button>
            </div>
          </div>
        </form>

        <h4>Historial de Gastos</h4>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {gastos.map((g, i) => (
              <tr key={i}>
                <td>{g.fecha || ''}</td>
                <td>{g.descripcion}</td>
                <td>${g.monto}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      {/* PIE DE PÁGINA */}
      <footer className="bg-esfot text-white text-center py-3">
        &copy; 2025 ASO-ESFOT. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default FinanzasPage;
