import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const VerificarCuenta = () => {
  const { token } = useParams();
  const [mensaje, setMensaje] = useState('');
  const [verificado, setVerificado] = useState(false);

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
    <div className="container py-5">
      <h2>Verificación de cuenta</h2>
      {!verificado ? (
        <>
          <button className="btn btn-success" onClick={handleVerificar}>
            Confirmar cuenta
          </button>
          {mensaje && <p className="mt-3">{mensaje}</p>}
        </>
      ) : (
        <p className="mt-3 text-success">¡Cuenta verificada! Ya puedes iniciar sesión.</p>
      )}
    </div>
  );
};

export default VerificarCuenta;