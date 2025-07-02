Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: (key) =>
      key === 'usuario'
        ? JSON.stringify({ id: 1, nombre: 'Test', apellido: 'User', activo: false })
        : null,
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import ActualizarPage from '../pages/ActualizarPage';
import { MemoryRouter } from 'react-router-dom';

describe('ActualizarPage', () => {
  test('funciona el formulario de actualización si el usuario está inactivo', () => {
    render(
      <MemoryRouter>
        <ActualizarPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Actualizar Datos Personales/i)).toBeInTheDocument();
    expect(screen.getByText(/Teléfono/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Carrera/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Semestre/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Solicitar actualización/i })).toBeInTheDocument();
  });
});