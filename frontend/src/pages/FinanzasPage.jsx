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

  // Generar reporte PDF tipo factura con logo y detalles
  const generarReportePDF = () => {
    import('jspdf').then(jsPDF => {
      const doc = new jsPDF.jsPDF();

      // Dibuja margen rojo
      doc.setDrawColor(233, 76, 76); // Rojo
      doc.setLineWidth(3);
      doc.rect(8, 8, 194, 281, 'S'); // Margen para A4

      // Logo (usa una URL pública o base64 para máxima compatibilidad)
      const logoUrl = window.location.origin + '/imagenes_asoesfot/logo.png';
      const img = new window.Image();
      img.crossOrigin = '';
      img.src = logoUrl;
      img.onload = () => {
        doc.addImage(img, 'PNG', 15, 10, 30, 30);

        // Encabezado de factura
        doc.setFontSize(18);
        doc.text('Factura de Finanzas ASO-ESFOT', 55, 22);
        doc.setFontSize(12);
        doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 55, 30);

        // Datos de la "empresa"
        doc.setFontSize(10);
        doc.text('ASOCIACIÓN DE ESTUDIANTES DE LA ESFOT', 55, 36);
        doc.text('Quito, Ecuador', 55, 41);

        let y = 55;
        const margenInferior = 270;

        // Detalle de Pagos
        doc.setFontSize(13);
        doc.setTextColor(233, 76, 76);
        doc.text('Detalle de Pagos:', 20, y);
        doc.setTextColor(0, 0, 0);
        y += 8;
        pagos.forEach((p, i) => {
          doc.setFontSize(11);
          doc.text(
            `${i + 1}. ${new Date(p.fechaSeleccion).toLocaleDateString()} - ${p.usuarioId?.nombre || ''} ${p.usuarioId?.apellido || ''} - ${p.nombrePlan}: $${p.precio}`,
            25,
            y
          );
          y += 7;
          if (y > margenInferior) {
            doc.addPage();
            // Redibuja margen y logo en nueva página
            doc.setDrawColor(233, 76, 76);
            doc.setLineWidth(3);
            doc.rect(8, 8, 194, 281, 'S');
            doc.addImage(img, 'PNG', 15, 10, 30, 30);
            y = 55;
          }
        });

        y += 8;
        doc.setFontSize(13);
        doc.setTextColor(233, 76, 76);
        doc.text('Detalle de Gastos:', 20, y);
        doc.setTextColor(0, 0, 0);
        y += 8;
        gastos.forEach((g, i) => {
          doc.setFontSize(11);
          doc.text(`${i + 1}. ${g.fecha || ''} - ${g.descripcion}: $${g.monto}`, 25, y);
          y += 7;
          if (y > margenInferior) {
            doc.addPage();
            // Redibuja margen y logo en nueva página
            doc.setDrawColor(233, 76, 76);
            doc.setLineWidth(3);
            doc.rect(8, 8, 194, 281, 'S');
            doc.addImage(img, 'PNG', 15, 10, 30, 30);
            y = 55;
          }
        });

        y += 10;
        doc.setFontSize(13);
        doc.setTextColor(40, 167, 69);
        doc.text(`Saldo actual: $${saldo}`, 20, y);

        // Pie de página
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text('ASO-ESFOT © 2025 | Este documento es solo informativo.', 20, 285);

        doc.save('factura_finanzas.pdf');
      };
    });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="bg-esfot text-white py-3 px-4 d-flex justify-content-between align-items-center">
        <img src="/imagenes_asoesfot/logo.png" alt="Logo" style={{ height: '60px' }} />
        <div>
          <Link to="/adminpage" className="btn btn-esfot me-2">Menú</Link>
          <Link to="/adminpage/usuariospage" className="btn btn-esfot me-2">Gestionar Usuarios</Link>
          <Link to="/adminpage/reportespage" className="btn btn-esfot me-2">Gestionar Aportantes</Link>
          <Link to="/adminpage/crudpage" className="btn btn-esfot me-2">Gestionar Gastos</Link>
        </div>
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
