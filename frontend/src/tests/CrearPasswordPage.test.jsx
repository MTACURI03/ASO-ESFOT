import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CrearPasswordPage from '../pages/CrearPasswordPage';

describe('CrearPasswordPage', () => {
  test('renders registration form', () => {
    render(
      <MemoryRouter>
        <CrearPasswordPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Registro/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Crear contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Repetir contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Guardar/i })).toBeInTheDocument();
  });

  test('shows error if passwords do not match', () => {
    render(
      <MemoryRouter>
        <CrearPasswordPage />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/Crear contraseña/i), { target: { value: 'Password123' } });
    fireEvent.change(screen.getByLabelText(/Repetir contraseña/i), { target: { value: 'Password321' } });
    expect(screen.getByText(/Las contraseñas no coinciden/i)).toBeInTheDocument();
  });

  test('shows error if email is not institutional', () => {
    render(
      <MemoryRouter>
        <CrearPasswordPage />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'test@gmail.com' } });
    expect(screen.getByText(/El correo debe ser institucional/i)).toBeInTheDocument();
  });
});