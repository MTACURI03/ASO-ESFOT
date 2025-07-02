import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import LandingPage from '../pages/LandingPage';

describe('LandingPage', () => {
  beforeEach(() => {
    // Simula un usuario activo en localStorage
    localStorage.setItem('usuario', JSON.stringify({ activo: true }));
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('se renderiza correctamente y muestra los elementos principales', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    // Títulos principales
    expect(screen.getByText(/APORTACIONES ASO-ESFOT/i)).toBeInTheDocument();
    expect(screen.getByText(/Facilitando la gestión de aportes estudiantiles/i)).toBeInTheDocument();

    // Imágenes principales
    expect(screen.getByAltText('ESFOT')).toBeInTheDocument();
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByAltText('Directiva')).toBeInTheDocument();
    expect(screen.getByAltText('Finalistas')).toBeInTheDocument();
    expect(screen.getByAltText('img1')).toBeInTheDocument();
    expect(screen.getByAltText('img2')).toBeInTheDocument();
    expect(screen.getByAltText('img3')).toBeInTheDocument();

    // Botones y enlaces principales
    expect(screen.getByRole('button', { name: /Cerrar sesión/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Actualizar datos/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Mis Aportaciones/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Planes de Aportaciones/i })).toBeInTheDocument();

    // Footer
    expect(screen.getByText(/ASO-ESFOT. Todos los derechos reservados/i)).toBeInTheDocument();
  });

  test('cierra sesión correctamente ', async () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    // Abre el modal de cierre de sesión
    const cerrarSesionBtn = screen.getByRole('button', { name: /Cerrar sesión/i });
    await userEvent.click(cerrarSesionBtn);

    // Ahora haz clic en el botón de confirmación dentro del modal
    const confirmarBtn = screen.getAllByRole('button', { name: /Cerrar sesión/i })[1];
    await userEvent.click(confirmarBtn);

    const usuario = localStorage.getItem('usuario');
    expect([null, '', 'null', '{}']).toContain(usuario);

    // Opcional: verifica que se redirige o muestra el login
    // expect(screen.getByText(/Iniciar sesión/i)).toBeInTheDocument();
  });
});