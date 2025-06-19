import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const FinanzasPage = () => {
  const [saldo, setSaldo] = useState(0);
  const [gastos, setGastos] = useState([]);
  const [pagos, setPagos] = useState([]); // <-- Nuevo estado para pagos
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

  // Generar reporte PDF
  const generarReportePDF = () => {
  import('jspdf').then(jsPDF => {
    const doc = new jsPDF.jsPDF();
    doc.setFontSize(16);
    doc.text('Reporte de Finanzas ASO-ESFOT', 20, 20);
    doc.setFontSize(12);
    let y = 35;
    doc.text('Pagos:', 20, y);
    y += 7;
    pagos.forEach((p, i) => {
      doc.text(
        `${i + 1}. ${new Date(p.fechaSeleccion).toLocaleDateString()} - ${p.usuarioId?.nombre || ''} ${p.usuarioId?.apellido || ''} - ${p.nombrePlan}: $${p.precio}`,
        25,
        y
      );
      y += 7;
    });
    y += 10;
    doc.text('Gastos:', 20, y);
    y += 7;
    gastos.forEach((g, i) => {
      doc.text(`${i + 1}. ${g.fecha || ''} - ${g.descripcion}: $${g.monto}`, 25, y);
      y += 7;
    });
    doc.text(`Saldo actual: $${saldo}`, 20, y + 10);
    doc.save('reporte_finanzas.pdf');
  });
};

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="bg-esfot text-white py-3 px-4 d-flex justify-content-between align-items-center">
        <img src="/imagenes_asoesfot/logo.png" alt="Logo" style={{ height: '60px' }} />
        <Link to="/adminpage" className="btn btn-light">Inicio</Link>
      </header>
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
      <footer className="bg-esfot text-white text-center py-3">
        &copy; 2025 ASO-ESFOT. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default FinanzasPage;
