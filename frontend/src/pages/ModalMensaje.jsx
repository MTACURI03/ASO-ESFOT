import React from 'react';

const ModalMensaje = ({ show, mensaje, tipo = 'success', onClose }) => {
  // Colores según tipo
  const colores = {
    success: { bg: '#e94c4c', text: '#fff' }, // Rojo ASO-ESFOT
    error: { bg: '#007bff', text: '#fff' },   // Azul ASO-ESFOT
    warning: { bg: '#ffc107', text: '#000' }
  };
  const color = colores[tipo] || colores.success;

  if (!show) return null;

  return (
    <div className="modal fade show" style={{display: 'block'}} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header" style={{ background: color.bg, color: color.text }}>
            <h5 className="modal-title">
              {tipo === 'success' && '¡Éxito!'}
              {tipo === 'error' && 'Error'}
              {tipo === 'warning' && 'Advertencia'}
            </h5>
          </div>
          <div className="modal-body">
            <p>{mensaje}</p>
          </div>
          <div className="modal-footer">
            <button className="btn" style={{ background: color.bg, color: color.text }} onClick={onClose} autoFocus>
              Cerrar
            </button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </div>
  );
};

export default ModalMensaje;