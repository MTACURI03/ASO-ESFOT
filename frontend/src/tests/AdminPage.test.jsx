import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminPage from '../pages/AdminPage';

describe('AdminPage', () => {
  beforeEach(() => {
    localStorage.setItem('usuario', JSON.stringify({ nombre: 'Admin', apellido: 'Test', rol: 'admin' }));
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('se renderiza correctamente y muestra el panel administrativo', () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/ADMINISTRACIÓN ASO-ESFOT/i)).toBeInTheDocument();
    expect(screen.getByText(/Panel de control para gestión financiera y administrativa/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cerrar sesión/i })).toBeInTheDocument();
    expect(screen.getByText(/Panel administrativo/i, { exact: false })).toBeInTheDocument();
  });

  test('cierra sesión correctamente', () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    // 1. Click en el botón principal (abre el modal)
    const btnCerrarSesion = screen.getByRole('button', { name: /Cerrar sesión/i });
    fireEvent.click(btnCerrarSesion);

    // 2. Click en el botón "Cerrar sesión" del modal de confirmación
    const btnConfirmar = screen.getAllByRole('button', { name: /Cerrar sesión/i })[1];
    fireEvent.click(btnConfirmar);

    // Verifica que el usuario fue eliminado del localStorage
    expect(localStorage.getItem('usuario')).toBeNull();
  });
});