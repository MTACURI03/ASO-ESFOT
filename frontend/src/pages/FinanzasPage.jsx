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

      // Margen y tabla
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);
      doc.rect(15, 50, 180, 7 + 7 * Math.max(pagos.length, gastos.length) + 14); // Rectángulo de la tabla

      // Logo y encabezado
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

        // Encabezados
        doc.setFontSize(13);
        doc.setTextColor(233, 76, 76);
        doc.text('Aportaciones', 20, y);
        doc.text('Gastos', 120, y);

        y += 7;
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);

        // Encabezados de columnas
        doc.text('Fecha', 18, y);
        doc.text('Nombre', 38, y);
        doc.text('Plan', 80, y);
        doc.text('Monto', 100, y);

        doc.text('Fecha', 120, y);
        doc.text('Descripción', 140, y);
        doc.text('Monto', 180, y);

        // Líneas verticales (ajustadas)
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.line(15, 50, 15, y + 7 * Math.max(pagos.length, gastos.length) + 7);    // Borde izquierdo
        doc.line(115, 50, 115, y + 7 * Math.max(pagos.length, gastos.length) + 7);  // Centro
        doc.line(195, 50, 195, y + 7 * Math.max(pagos.length, gastos.length) + 7);  // Borde derecho

        // Líneas verticales internas
        doc.line(35, y - 6, 35, y + 7 * Math.max(pagos.length, gastos.length) + 7); // Nombre
        doc.line(75, y - 6, 75, y + 7 * Math.max(pagos.length, gastos.length) + 7); // Plan
        doc.line(110, y - 6, 110, y + 7 * Math.max(pagos.length, gastos.length) + 7); // Monto izq
        doc.line(135, y - 6, 135, y + 7 * Math.max(pagos.length, gastos.length) + 7); // Fecha gasto
        doc.line(175, y - 6, 175, y + 7 * Math.max(pagos.length, gastos.length) + 7); // Descripción gasto

        // Línea horizontal bajo encabezados
        doc.line(15, y + 2, 195, y + 2);

        y += 8;

        const maxFilas = Math.max(pagos.length, gastos.length);

        for (let i = 0; i < maxFilas; i++) {
          // Aportaciones (izquierda)
          if (pagos[i]) {
            doc.text(
              pagos[i].fechaSeleccion ? new Date(pagos[i].fechaSeleccion).toLocaleDateString() : '',
              18, y
            );
            doc.text(
              (pagos[i].usuarioId?.nombre || '').slice(0, 12),
              38, y
            );
            doc.text(
              (pagos[i].nombrePlan || '').slice(0, 12), // Recorta para evitar cruces
              70, y // Ajusta posición para más espacio
            );
            doc.text(
              `$${pagos[i].precio}`,
              95, y
            );
          }

          // Gastos (derecha)
          if (gastos[i]) {
            doc.text(
              gastos[i].fecha || '',
              120, y
            );
            doc.text(
              (gastos[i].descripcion || '').slice(0, 15), // Recorta para evitar cruces
              150, y // Ajusta posición para más espacio
            );
            doc.text(
              `$${gastos[i].monto}`,
              180, y
            );
          }

          // Línea horizontal por fila
          doc.line(15, y + 2, 195, y + 2);

          y += 7;
          if (y > margenInferior) {
            doc.addPage();
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.3);
            doc.rect(15, 50, 180, 7 + 7 * Math.max(pagos.length, gastos.length) + 14);
            y = 55;
          }
        }

        // --- SALDO TOTAL ---
        y += 5;
        doc.setFontSize(12);
        doc.setTextColor(40, 167, 69);
        doc.text(`Saldo total: $${saldo}`, 120, y);

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
