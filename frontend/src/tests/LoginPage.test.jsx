import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

describe('LoginPage', () => {
  test('La pantalla de login se renderiza correctamente con la opción de rol administrador', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Bienvenido ASO-ESFOT/i)).toBeInTheDocument();
    expect(screen.getByText(/Inicia sesión/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo institucional/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Rol/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ingresar/i })).toBeInTheDocument();
    // Verifica que la opción "Administrador" está presente en el select de rol
    expect(screen.getByRole('option', { name: /Administrador/i })).toBeInTheDocument();
  });
});