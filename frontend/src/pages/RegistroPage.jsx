import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const RegistroPage = () => {
  const [visible, setVisible] = useState([false, false, false]);
  const [secciones, setSecciones] = useState([]);

  const toggle = (index) => {
    const updated = [...visible];
    updated[index] = !updated[index];
    setVisible(updated);
  };

  const elegirPlan = async (nombrePlan, precio) => {
    const confirmar = window.confirm(`¿Estás seguro de elegir el ${nombrePlan}?`);
    if (confirmar) {
      try {
        const usuarioId = localStorage.getItem('usuarioId');
        const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Usuario';

        if (!usuarioId) {
          alert('No se encontró usuario autenticado');
          return;
        }
        const response = await fetch('https://aso-esfot-backend.onrender.com/api/planes/seleccionar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usuarioId, nombrePlan, precio }),
        });

        const data = await response.json();

        if (response.ok) {
          alert(
            `Has seleccionado el ${nombrePlan}.\n${nombreUsuario}\nSe te envió una notificación a tu correo revisalo por favor.`
          );
        } else {
          alert('Error al guardar el plan: ' + data.mensaje);
        }
      } catch (error) {
        alert('Error de red: ' + error.message);
      }
    }
  };

  useEffect(() => {
    fetch('https://aso-esfot-backend.onrender.com/api/planescrud')
      .then(res => res.json())
      .then(data => setSecciones(data));
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* ENCABEZADO */}
      <header className="bg-esfot text-white py-3 px-4 d-flex justify-content-between align-items-center">
        <img src="/imagenes_asoesfot/logo.png" alt="ESFOT" style={{ height: '60px' }} />
        <div>
          <Link to="/landing" className="btn btn-esfot me-2">Menú</Link>
          <Link to="/visualizar" className="btn btn-esfot me-2">Mis Aportaciones</Link>
        </div>
      </header>

      {/* CUERPO PRINCIPAL */}
      <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center p-4">
        <h2 className="mb-4 text-center">Planes de Aportaciones</h2>
        <p className="lead text-secondary fw-semibold">La Asociación de Estudiantes de la ESFOT cuenta con 3 diferentes planes que son los que se presentan a continuación:</p>
        <div className="container">
          <div className="row">
            {secciones.map((item, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card h-100">
                  <img src={item.imagen} className="card-img-top" alt={`Imagen ${index + 1}`} />
                  <div className="card-body text-center">
                    <p className="fw-bold mb-2">Precio: ${item.precio}.00</p>
                    <button className="btn btn-danger mb-2" onClick={() => toggle(index)}>
                      {visible[index] ? 'Ocultar' : 'Ver más'}
                    </button>
                    {visible[index] && (
                      <div className="mt-3 text-start">
                        <p><strong>{item.titulo}:</strong></p>
                        <ul>
                          {(item.beneficios || []).map((detalle, i) => (
                            <li key={i}>{detalle}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Botón Elegir Plan */}
                    <button
                      className="btn btn-primary mt-3"
                      onClick={() => elegirPlan(item.titulo, item.precio)}
                    >
                      Elegir plan
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* PIE DE PÁGINA */}
      <footer className="bg-esfot text-white text-center py-3">
        &copy; 2025 ASO-ESFOT. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default RegistroPage;


