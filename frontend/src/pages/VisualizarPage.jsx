import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import StudentHeader from '../components/StudentHeader';

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
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const usuarioId = usuario?.id;
    if (!usuarioId) {
      setAportaciones([]);
      setLoading(false);
      return;
    }
    fetch(`https://aso-esfot-backend.onrender.com/api/planes/usuario/${usuarioId}`)
      .then(res => res.json())
      .then(data => {
        // Filtra solo los planes activos
        const planesActivos = data.filter(plan => plan.activo || plan.estado === 'Activo');
        const planes = planesActivos.map(plan => ({
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
  const generarReporte = async () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Margen rojo
    doc.setDrawColor(233, 76, 76);
    doc.setLineWidth(3);
    doc.rect(8, 8, 194, 281, 'S');

    // Logo ESFOT
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
    doc.addImage(logoDataUrl, 'PNG', 15, 12, 30, 30);

    // Título y datos
    doc.setFontSize(18);
    doc.text('Factura de Aportaciones ASO-ESFOT', 55, 22);
    doc.setFontSize(12);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 55, 30);

    let y = 50;
    const margenInferior = 270;

    for (const item of aportaciones) {
      // Encabezado del plan (solo una vez)
      doc.setFontSize(13);
      doc.setTextColor(233, 76, 76);
      doc.text(`Plan: ${item.plan}`, 20, y);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.text(`Fecha de selección: ${item.fecha}`, 20, y + 7);
      doc.text(`Estado: ${item.estado}`, 20, y + 14);
      doc.text('Detalles:', 20, y + 21);

      const detalles = PLANES_DETALLE[item.plan] || [];
      let detalleY = y + 28;

      for (let i = 0; i < detalles.length; i++) {
        // Si el siguiente detalle se sale del margen inferior, salta de página
        if (detalleY > margenInferior) {
          doc.addPage();
          doc.setDrawColor(233, 76, 76);
          doc.setLineWidth(3);
          doc.rect(8, 8, 194, 281, 'S');
          doc.addImage(logoDataUrl, 'PNG', 15, 12, 30, 30);
          // Solo continuar con los detalles, sin repetir encabezado
          detalleY = 50;
        }
        doc.text(`- ${detalles[i]}`, 30, detalleY);
        detalleY += 6;
      }

      y = detalleY + 10;
      // Si el siguiente bloque se sale del margen inferior, salta de página
      if (y > margenInferior) {
        doc.addPage();
        doc.setDrawColor(233, 76, 76);
        doc.setLineWidth(3);
        doc.rect(8, 8, 194, 281, 'S');
        doc.addImage(logoDataUrl, 'PNG', 15, 12, 30, 30);
        y = 50;
      }
    }

    doc.save('factura_aportaciones.pdf');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <StudentHeader />

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
