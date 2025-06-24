import React, { useState } from 'react';

const ActualizarPasswordPage = () => {
  const [correo, setCorreo] = useState('');
  const [passwordActual, setPasswordActual] = useState('');
  const [nuevoPassword, setNuevoPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleActualizar = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
      const res = await fetch('https://aso-esfot-backend.onrender.com/api/usuarios/actualizar-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, passwordActual, nuevoPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMensaje('Contraseña actualizada correctamente.');
      } else {
        setMensaje(data.mensaje || 'Error al actualizar la contraseña.');
      }
    } catch (err) {
      setMensaje('Error de red.');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Actualizar Contraseña</h2>
      <form onSubmit={handleActualizar} style={{ maxWidth: 400 }}>
        <div className="mb-3">
          <label className="form-label">Correo institucional</label>
          <input type="email" className="form-control" value={correo} onChange={e => setCorreo(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña actual</label>
          <input type="password" className="form-control" value={passwordActual} onChange={e => setPasswordActual(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Nueva contraseña</label>
          <input type="password" className="form-control" value={nuevoPassword} onChange={e => setNuevoPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Actualizar</button>
        {mensaje && <div className="mt-3 alert alert-info">{mensaje}</div>}
      </form>
    </div>
  );
};

export default ActualizarPasswordPage;