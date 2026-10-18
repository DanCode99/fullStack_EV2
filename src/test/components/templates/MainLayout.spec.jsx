import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MainLayout from '../../../components/templates/MainLayout/MainLayout';

describe('MainLayout Template', () => {
  it('renderiza el contenido hijo dentro del layout', () => {
    render(
      <MemoryRouter>
        <MainLayout currentView="home" cartCount={0}>
          <div data-testid="test-child">Contenido Principal de Prueba</div>
        </MainLayout>
      </MemoryRouter>
    );
    expect(screen.getByTestId('test-child')).toBeTruthy();
    expect(screen.getByText('Contenido Principal de Prueba')).toBeTruthy();
  });

  it('renderiza tanto el Navbar como el Footer', () => {
    render(
      <MemoryRouter>
        <MainLayout currentView="home" cartCount={0}>
          <div>Página</div>
        </MainLayout>
      </MemoryRouter>
    );
    expect(screen.getByText('TIENDA DE FÚTBOL')).toBeTruthy();
    expect(screen.getByText('Nuestra Tienda')).toBeTruthy();
  });

  it('propaga correctamente el conteo de items del carrito', () => {
    render(
      <MemoryRouter>
        <MainLayout currentView="home" cartCount={7}>
          <div>Página</div>
        </MainLayout>
      </MemoryRouter>
    );
    expect(screen.getByText('Carrito (7)')).toBeTruthy();
  });
});
