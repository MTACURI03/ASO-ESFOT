global.fetch = jest.fn((...args) => {
  let url = '';
  if (args.length > 0) {
    if (typeof args[0] === 'string') url = args[0];
    else if (args[0] && typeof args[0].url === 'string') url = args[0].url;
  }
  // Para depuración, puedes ver qué url llega:
  // console.log('MOCK FETCH URL:', url);

  if (typeof url !== 'string') url = '';
  if (url.includes('/api/finanzas/saldo')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ saldo: 1234.56 })
    });
  }
  if (url.includes('/api/finanzas/gastos')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { descripcion: 'Compra de materiales', monto: 100, fecha: '2024-06-01' },
        { descripcion: 'Pago de servicios', monto: 200, fecha: '2024-06-10' }
      ])
    });
  }
  if (url.includes('/api/planes/aportaciones')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        {
          usuarioId: { nombre: 'Juan', apellido: 'Pérez' },
          nombrePlan: 'Plan Oro',
          fechaSeleccion: '2024-06-05T00:00:00.000Z',
          precio: 50,
          estado: 'Pagado'
        },
        {
          usuarioId: { nombre: 'Ana', apellido: 'García' },
          nombrePlan: 'Plan Plata',
          fechaSeleccion: '2024-06-07T00:00:00.000Z',
          precio: 30,
          estado: 'Pendiente'
        }
      ])
    });
  }
  // Siempre retorna una promesa válida con .then
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve([])
  });
});

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FinanzasPage from '../pages/FinanzasPage';

describe('FinanzasPage', () => {
  beforeEach(() => {
    global.fetch = jest.fn((...args) => {
      let url = '';
      if (args.length > 0) {
        if (typeof args[0] === 'string') url = args[0];
        else if (args[0] && typeof args[0].url === 'string') url = args[0].url;
      }
      if (typeof url !== 'string') url = '';
      if (url.includes('/api/finanzas/saldo')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ saldo: 1234.56 })
        });
      }
      if (url.includes('/api/finanzas/gastos')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { descripcion: 'Compra de materiales', monto: 100, fecha: '2024-06-01' },
            { descripcion: 'Pago de servicios', monto: 200, fecha: '2024-06-10' }
          ])
        });
      }
      if (url.includes('/api/planes/aportaciones')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            {
              usuarioId: { nombre: 'Juan', apellido: 'Pérez' },
              nombrePlan: 'Plan Oro',
              fechaSeleccion: '2024-06-05T00:00:00.000Z',
              precio: 50,
              estado: 'Pagado'
            },
            {
              usuarioId: { nombre: 'Ana', apellido: 'García' },
              nombrePlan: 'Plan Plata',
              fechaSeleccion: '2024-06-07T00:00:00.000Z',
              precio: 30,
              estado: 'Pendiente'
            }
          ])
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

  test('renderiza correctamente la gestión financiera', async () => {
    render(
      <MemoryRouter>
        <FinanzasPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Gestión Financiera - ASO ESFOT/i)).toBeInTheDocument();

    // Espera a que se cargue el saldo y los datos mockeados
    await waitFor(() => {
      expect(screen.getByText(/Saldo Total: \$1234\.56/i)).toBeInTheDocument();
      expect(screen.getByText('Juan')).toBeInTheDocument();
      expect(screen.getByText('Pérez')).toBeInTheDocument();
      expect(screen.getByText('Plan Oro')).toBeInTheDocument();
      expect(screen.getByText('$50')).toBeInTheDocument();
      expect(screen.getByText('Compra de materiales')).toBeInTheDocument();
      expect(screen.getByText('Pago de servicios')).toBeInTheDocument();
      expect(screen.getByText('$100')).toBeInTheDocument();
      expect(screen.getByText('$200')).toBeInTheDocument();
    });

    // Verifica que los botones principales existen
    expect(screen.getByRole('button', { name: /Registrar Gasto/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generar Reporte PDF/i })).toBeInTheDocument();
  });
});