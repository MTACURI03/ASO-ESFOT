import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import VerificarCuenta from '../pages/VerificarCuenta';

describe('VerificarCuenta', () => {
  test('funcionamiento correcto', () => {
    render(
      <MemoryRouter>
        <VerificarCuenta />
      </MemoryRouter>
    );

    // Verificar que los elementos principales se renderizan correctamente
    expect(screen.getByText(/Verificación de cuenta/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Confirmar cuenta/i })).toBeInTheDocument();
  });
});