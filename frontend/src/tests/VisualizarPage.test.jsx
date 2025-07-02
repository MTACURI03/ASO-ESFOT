global.fetch = () =>
  Promise.resolve({
    json: () => Promise.resolve([]) // Simula que no hay aportaciones
  });

// Mock localStorage solo para la clave 'usuario'
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: (key) =>
      key === 'usuario'
        ? JSON.stringify({ id: 1, nombre: 'Test', apellido: 'User' })
        : null,
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import VisualizarPage from '../pages/VisualizarPage';
import { MemoryRouter } from 'react-router-dom';

describe('VisualizarPage', () => {
  test('renderiza el historial y el footer correctamente', async () => {
    render(
      <MemoryRouter>
        <VisualizarPage />
      </MemoryRouter>
    );

    // Espera a que desaparezca el "Cargando..."
    expect(await screen.findByText(/No tienes aportaciones registradas/i)).toBeInTheDocument();

    // Footer
    expect(screen.getByText(/ASO-ESFOT. Todos los derechos reservados/i)).toBeInTheDocument();

    // Botón de reporte deshabilitado
    expect(screen.getByRole('button', { name: /Generar reporte/i })).toBeDisabled();
  });
});