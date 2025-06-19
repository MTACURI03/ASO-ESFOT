import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';

// Detalles de los planes
const PLANES_DETALLE = {
  'Plan Tianlong': [
    '4 horas de billar',
    '2 horas en consolas',
    'Stickers',
    'Descuento en casilleros',
    'Colada morada con guagua',
  ],
  'Plan Colacuerno': [
    '8 horas de billar',
    '6 horas en consolas',
    'Stickers',
    '50% en casilleros',
    'Termo',
    '1 almuerzo',
    'Gorra',
    'Descuento del 20% en chompas o camisetas',
    'Descuento en cursos ESFOT',
    'Funda de caramelos',
    'Colada morada con guagua',
    'Carnet especial',
    'Canelazo',
  ],
  'Plan Celestial': [
    '10 horas de billar en el semestre',
    '10 horas en consolas',
    'Stickers',
    'Pin',
    'Casillero gratis',
    'Termo',
    '3 almuerzos en el semestre',
    'Gorra',
    'Camiseta',
    'Descuento del 35% en chompas o camisetas',
    'Descuento en cursos ESFOT',
    'Descuento en tienda',
    'Funda de caramelos',
    'Tarrina de colada morada con su guagua',
    'Regalo sorpresa en Navidad',
    'Entrada a fiestas ESFOT',
    'Carnet especial',
    'Canelazo',
  ],
};

const VisualizarPage = () => {
  const [aportaciones, setAportaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuarioId = localStorage.getItem('usuarioId');
    if (!usuarioId) {
      setAportaciones([]);
      setLoading(false);
      return;
    }
    fetch(`http://localhost:5000/api/planes/usuario/${usuarioId}`)
      .then(res => res.json())
      .then(data => {
        const planes = data.map(plan => ({
          fecha: new Date(plan.fechaSeleccion).toISOString().split('T')[0],
          plan: plan.nombrePlan,
          estado: plan.estado || 'Pendiente',
        }));
        setAportaciones(planes);
        setLoading(false);
      })
      .catch(() => {
        setAportaciones([]);
        setLoading(false);
      });
  }, []);

  // Función para generar el PDF
  const generarReporte = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Factura de Aportaciones ASO-ESFOT', 20, 20);
    doc.setFontSize(12);

    let y = 35;
    aportaciones.forEach((item, idx) => {
      doc.text(`Plan: ${item.plan}`, 20, y);
      doc.text(`Fecha: ${item.fecha}`, 20, y + 7);
      doc.text(`Estado: ${item.estado}`, 20, y + 14);
      doc.text('Detalles:', 20, y + 21);
      (PLANES_DETALLE[item.plan] || []).forEach((detalle, i) => {
        doc.text(`- ${detalle}`, 30, y + 28 + i * 7);
      });
      y += 28 + (PLANES_DETALLE[item.plan]?.length || 0) * 7 + 10;
      if (y > 270) { // Salto de página si es necesario
        doc.addPage();
        y = 20;
      }
    });

    doc.save('factura_aportaciones.pdf');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* ENCABEZADO */}
      <header className="bg-esfot text-white py-3 px-4 d-flex justify-content-between align-items-center">
        <img src="/imagenes_asoesfot/logo.png" alt="ESFOT" style={{ height: '60px' }} />
        <Link to="/landing" className="btn btn-light">Inicio</Link>
      </header>

      {/* CUERPO */}
      <main className="flex-grow-1 container py-5">
        <h2 className="text-center mb-4">Historial de Aportaciones</h2>
        <div className="mb-3 text-end">
          <button className="btn btn-success" onClick={generarReporte} disabled={aportaciones.length === 0}>
            Generar reporte
          </button>
        </div>
        {loading ? (
          <p className="text-center">Cargando...</p>
        ) : aportaciones.length > 0 ? (
          <table className="table table-striped shadow">
            <thead className="table-dark">
              <tr>
                <th>Fecha</th>
                <th>Plan</th>
                <th>Estado</th>
                <th>Detalles del Plan</th>
              </tr>
            </thead>
            <tbody>
              {aportaciones.map((item, index) => (
                <tr key={index}>
                  <td>{item.fecha}</td>
                  <td>{item.plan}</td>
                  <td>{item.estado}</td>
                  <td>
                    <ul style={{marginBottom: 0}}>
                      {(PLANES_DETALLE[item.plan] || []).map((detalle, i) => (
                        <li key={i}>{detalle}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-muted">No tienes aportaciones registradas.</p>
        )}
      </main>

      {/* PIE DE PÁGINA */}
      <footer className="bg-esfot text-white text-center py-3">
        &copy; 2025 ASO-ESFOT. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default VisualizarPage;
