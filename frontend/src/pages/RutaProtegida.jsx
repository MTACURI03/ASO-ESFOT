import React from 'react';
import { Navigate } from 'react-router-dom';

const RutaProtegida = ({ children }) => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario) return <Navigate to="/login" />;
  if (usuario.activo === false) return <Navigate to="/actualizar-datos" />;
  return children;
};

export default RutaProtegida;