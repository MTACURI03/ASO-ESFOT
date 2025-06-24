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
    <div className="d-flex flex-column min-vh-100" style={{ background: '#f8f9fa' }}>
      <header className="bg-esfot text-white py-3 px-4 d-flex justify-content-between align-items-center" style={{ background: '#e94c4c' }}>
        <img src="/imagenes_asoesfot/logo.png" alt="ESFOT" style={{ height: '60px' }} />
        <h3 className="mb-0" style={{ color: '#fff', fontWeight: 'bold', letterSpacing: 1 }}>ASO-ESFOT</h3>
      </header>
      <main className="flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="card shadow" style={{ maxWidth: 420, width: '100%', borderTop: '5px solid #2986f5' }}>
          <div className="card-body">
            <h2 className="mb-4 text-center" style={{ color: '#e94c4c', fontWeight: 'bold' }}>Actualizar Contraseña</h2>
            <form onSubmit={handleActualizar}>
              <div className="mb-3">
                <label className="form-label" style={{ color: '#2986f5', fontWeight: 'bold' }}>Correo institucional</label>
                <input type="email" className="form-control" value={correo} onChange={e => setCorreo(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: '#2986f5', fontWeight: 'bold' }}>Contraseña actual</label>
                <input type="password" className="form-control" value={passwordActual} onChange={e => setPasswordActual(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: '#2986f5', fontWeight: 'bold' }}>Nueva contraseña</label>
                <input type="password" className="form-control" value={nuevoPassword} onChange={e => setNuevoPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn w-100" style={{ background: '#e94c4c', color: '#fff', fontWeight: 'bold' }}>Actualizar</button>
              {mensaje && <div className="mt-3 alert alert-info text-center">{mensaje}</div>}
            </form>
          </div>
        </div>
      </main>
      <footer className="bg-esfot text-white text-center py-3" style={{ background: '#2986f5' }}>
        &copy; 2025 ASO-ESFOT. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default ActualizarPasswordPage;