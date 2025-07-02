import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminSolicitudesPage from '../pages/AdminSolicitudesPage';

const mockSolicitudes = [
  {
    _id: '1',
    usuario: {
      nombre: 'Carlos',
      apellido: 'Ramírez',
      correo: 'carlos@ejemplo.com'
    },
    telefono: '0999999999',
    carrera: 'Software',
    semestre: 'Tercero'
  }
];

beforeEach(() => {
  global.fetch = jest.fn((...args) => {
    const url = typeof args[0] === 'string'
      ? args[0]
      : (args[0] && typeof args[0].url === 'string' ? args[0].url : '');

    if (url.includes('/api/solicitudes')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSolicitudes)
      });
    }
    if (url.includes('/api/usuarios/aprobar-actualizacion/')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ mensaje: 'Solicitud aprobada y datos actualizados.' })
      });
    }
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

describe('AdminSolicitudesPage', () => {
  test('muestra la tabla de solicitudes y permite aprobar', async () => {
    render(
      <MemoryRouter>
        <AdminSolicitudesPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Solicitudes de Actualizacion de Datos/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Carlos Ramírez')).toBeInTheDocument();
      expect(screen.getByText('carlos@ejemplo.com')).toBeInTheDocument();
      expect(screen.getByText('0999999999')).toBeInTheDocument();
      expect(screen.getByText('Software')).toBeInTheDocument();
      expect(screen.getByText('Tercero')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Aprobar y activar/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Aprobar y activar/i }));

    await waitFor(() => {
      expect(screen.getByText(/Solicitud aprobada y datos actualizados/i)).toBeInTheDocument();
      expect(screen.getByText(/No hay solicitudes pendientes/i)).toBeInTheDocument();
    });
  });

  test('muestra mensaje cuando no hay solicitudes', async () => {
    // Cambia el mock para este test
    global.fetch = jest.fn((...args) => {
      const url = typeof args[0] === 'string'
        ? args[0]
        : (args[0] && typeof args[0].url === 'string' ? args[0].url : '');

      if (url.includes('/api/solicitudes')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([])
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      });
    });

    render(
      <MemoryRouter>
        <AdminSolicitudesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No hay solicitudes pendientes/i)).toBeInTheDocument();
    });
  });
});