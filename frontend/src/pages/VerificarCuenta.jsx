import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const VerificarCuenta = () => {
  const { token } = useParams();
  const [mensaje, setMensaje] = useState('');
  const [verificado, setVerificado] = useState(false);
  const navigate = useNavigate();

  const handleVerificar = async () => {
    setMensaje('Verificando...');
    try {
      const res = await fetch(`https://aso-esfot-backend.onrender.com/api/usuarios/verificar/${token}`);
      const text = await res.text();
      setMensaje(text);
      if (res.ok) setVerificado(true);
    } catch {
      setMensaje('Error al verificar la cuenta.');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* CABECERA */}
      <header className="bg-esfot text-white py-3 px-4 d-flex justify-content-between align-items-center">
        <img src="/imagenes_asoesfot/logo.png" alt="ESFOT" style={{ height: '60px' }} />
        <div></div>
      </header>

      {/* CUERPO */}
      <main className="flex-grow-1 container py-5">
        <h2>Verificación de cuenta</h2>
        {!verificado ? (
          <>
            <button className="btn btn-success" onClick={handleVerificar}>
              Confirmar cuenta
            </button>
            {mensaje && <p className="mt-3">{mensaje}</p>}
          </>
        ) : (
          <>
            <p className="mt-3 text-success">¡Cuenta verificada! Ya puedes iniciar sesión.</p>
            <button className="btn btn-primary mt-2" onClick={() => navigate('/')}>
              Ir al Login
            </button>
          </>
        )}
      </main>

      {/* PIE DE PÁGINA */}
      <footer className="bg-esfot text-white text-center py-3">
        &copy; 2025 ASO-ESFOT. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default VerificarCuenta;