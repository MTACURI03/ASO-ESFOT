global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([])
  })
);

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CrudPlanesPage from '../pages/CrudPlanesPage';

beforeEach(() => {
  // Asegura que el mock esté limpio antes de cada test
  global.fetch.mockClear();
  global.fetch.mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([])
    })
  );
});

afterAll(() => {
  global.fetch.mockClear();
  delete global.fetch;
});

describe('CrudPlanesPage', () => {
  test('se renderiza correctamente la gestion de planes', () => {
    render(
      <MemoryRouter>
        <CrudPlanesPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Gestión de Planes de Aportaciones/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Título del Plan/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Beneficios/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Imagen/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Precio/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Agregar Plan|Actualizar Plan/i })).toBeInTheDocument();
    expect(screen.getByText(/No hay planes registrados/i)).toBeInTheDocument();
  });
});