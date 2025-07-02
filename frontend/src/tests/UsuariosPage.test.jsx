import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UsuariosPage from '../pages/UsuariosPage';

const mockUsuarios = [
  {
    _id: '1',
    nombre: 'Juan',
    apellido: 'Pérez',
    correo: 'juan@ejemplo.com',
    semestre: 'Tercer semestre',
    rol: 'estudiante',
    activo: true,
  }
];

beforeEach(() => {
  global.fetch = jest.fn((url, options) => {
    if (url.includes('/api/usuarios/1/activo') && options && options.method === 'PUT') {
      // Simula respuesta de cambio de estado
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });
    }
    // Simula carga de usuarios
    if (url.includes('/api/usuarios')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUsuarios)
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

describe('UsuariosPage', () => {
  test('se renderiza correctamente la gestión de usuarios', async () => {
    render(
      <MemoryRouter>
        <UsuariosPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Gestión de Usuarios/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Filtrar por semestre/i)).toBeInTheDocument();

    // Espera a que se carguen los usuarios mockeados
    await waitFor(() => {
      expect(screen.getByText('Juan')).toBeInTheDocument();
      // Busca la celda específica en la tabla
      expect(screen.getAllByRole('cell', { name: 'Tercer semestre' }).length).toBeGreaterThanOrEqual(1);
    });

    // Prueba el filtro por semestre
    fireEvent.change(screen.getByLabelText(/Filtrar por semestre/i), { target: { value: 'Tercer semestre' } });

    await waitFor(() => {
      expect(screen.getByText('Juan')).toBeInTheDocument();
    });
  });

  test('envía notificación de cambio de estado (activar/inactivar usuario)', async () => {
    render(
      <MemoryRouter>
        <UsuariosPage />
      </MemoryRouter>
    );

    // Espera a que se muestre el usuario
    await waitFor(() => {
      expect(screen.getByText('Juan')).toBeInTheDocument();
      expect(screen.getByText('Pérez')).toBeInTheDocument();
      // Busca el badge de estado, no el encabezado
      const badges = screen.getAllByText('Activo');
      expect(badges.some(badge => badge.className.includes('badge'))).toBe(true);
      expect(screen.getByRole('button', { name: /Desactivar/i })).toBeInTheDocument();
    });

    // Haz click en "Desactivar"
    fireEvent.click(screen.getByRole('button', { name: /Desactivar/i }));

    // Aparece el modal de confirmación
    expect(screen.getByText(/Confirmar inactivación/i)).toBeInTheDocument();

    // Haz click en "Sí" para confirmar
    fireEvent.click(screen.getByRole('button', { name: 'Sí' }));

    // Espera a que el estado cambie a "Inactivo"
    await waitFor(() => {
      expect(screen.getByText('Inactivo')).toBeInTheDocument();
    });

    // Verifica que se llamó al endpoint correcto
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/usuarios/1/activo'),
      expect.objectContaining({ method: 'PUT' })
    );
  });
});