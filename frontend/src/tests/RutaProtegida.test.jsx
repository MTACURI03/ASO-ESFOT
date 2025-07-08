import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RutaProtegida from '../pages/RutaProtegida';

describe('RutaProtegida', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('redirecciona a /login si no se encuentra un usuario en localStorage', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/protegida']}>
        <Routes>
          <Route
            path="/protegida"
            element={
              <RutaProtegida>
                <div>Contenido Protegido</div>
              </RutaProtegida>
            }
          />
          <Route path="/login" element={<div>Página de Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(container.textContent).toBe('Página de Login');
  });

  test('redirecciona a /actualizar-datos si el usuario está inactivo', () => {
    localStorage.setItem('usuario', JSON.stringify({ activo: false }));

    const { container } = render(
      <MemoryRouter initialEntries={['/protegida']}>
        <Routes>
          <Route
            path="/protegida"
            element={
              <RutaProtegida>
                <div>Contenido Protegido</div>
              </RutaProtegida>
            }
          />
          <Route path="/actualizar-datos" element={<div>Página de Actualizar Datos</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(container.textContent).toBe('Página de Actualizar Datos');
  });

  test('renderiza los hijos si el usuario está activo', () => {
    localStorage.setItem('usuario', JSON.stringify({ activo: true }));

    const { container } = render(
      <MemoryRouter initialEntries={['/protegida']}>
        <Routes>
          <Route
            path="/protegida"
            element={
              <RutaProtegida>
                <div>Contenido Protegido</div>
              </RutaProtegida>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(container.textContent).toBe('Contenido Protegido');
  });
});