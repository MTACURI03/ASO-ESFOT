global.fetch = () =>
  Promise.resolve({
    json: () => Promise.resolve([
      {
        titulo: 'Plan Básico',
        precio: 10,
        imagen: '/img/plan1.jpg',
        beneficios: ['Beneficio 1', 'Beneficio 2']
      },
      {
        titulo: 'Plan Estándar',
        precio: 20,
        imagen: '/img/plan2.jpg',
        beneficios: ['Beneficio 3', 'Beneficio 4']
      },
      {
        titulo: 'Plan Premium',
        precio: 30,
        imagen: '/img/plan3.jpg',
        beneficios: ['Beneficio 5', 'Beneficio 6']
      }
    ])
  });

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegistroPage from '../pages/RegistroPage';
import { MemoryRouter } from 'react-router-dom';

describe('RegistroPage', () => {
  test('puede elegir un plan y muestra el modal de confirmación', async () => {
    render(
      <MemoryRouter>
        <RegistroPage />
      </MemoryRouter>
    );

    // Espera a que se rendericen los botones "Elegir plan"
    const elegirBtns = await screen.findAllByRole('button', { name: /Elegir plan/i });
    expect(elegirBtns.length).toBe(3);

    // Haz clic en el primer botón "Elegir plan"
    await userEvent.click(elegirBtns[0]);

    // Espera a que aparezca el modal de confirmación
    expect(await screen.findByText(/Confirmar selección/i)).toBeInTheDocument();
    expect(screen.getByText(/¿Estás seguro de elegir el/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sí, elegir/i })).toBeInTheDocument();
  });
});