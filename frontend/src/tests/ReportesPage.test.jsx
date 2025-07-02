beforeEach(() => {
  global.fetch = jest.fn((...args) => {
    const url = typeof args[0] === 'string' ? args[0] : '';
    if (url.includes('/api/planes/aportaciones')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            _id: '1',
            usuarioId: { nombre: 'Carlos', apellido: 'Ramírez', correo: 'carlos@ejemplo.com' },
            nombrePlan: 'Plan Oro',
            fechaSeleccion: new Date().toISOString(),
            estado: 'Pagado'
          },
          {
            _id: '2',
            usuarioId: { nombre: 'Lucía', apellido: 'Gómez', correo: 'lucia@ejemplo.com' },
            nombrePlan: 'Plan Plata',
            fechaSeleccion: new Date().toISOString(),
            estado: 'Pendiente'
          }
        ])
      });
    }
    // Mock genérico para cualquier otra ruta o llamada sin URL
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([])
    });
  });
});

afterAll(() => {
  global.fetch.mockClear();
  delete global.fetch;
});

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ReportesPage from '../pages/ReportesPage';

describe('ReportesPage', () => {
  test('se renderiza correctamente la gestión de aportantes', async () => {
    render(
      <MemoryRouter>
        <ReportesPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Gestion de Aportantes/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Buscar por nombre o apellido/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generar Reporte/i })).toBeInTheDocument();

    // Espera a que se carguen los datos mockeados
    await waitFor(() => {
      expect(screen.getByText('Carlos')).toBeInTheDocument();
      expect(screen.getByText('Lucía')).toBeInTheDocument();
      expect(screen.getByText('Plan Oro')).toBeInTheDocument();
      expect(screen.getByText('Plan Plata')).toBeInTheDocument();
      expect(screen.getByText('Pagado')).toBeInTheDocument();
      expect(screen.getByText('Pendiente')).toBeInTheDocument();
    });
  });
});