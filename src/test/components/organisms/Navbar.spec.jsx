import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../../../components/organisms/Navbar/Navbar';

describe('Navbar Organism', () => {
  it('renderiza la marca de la tienda y los enlaces principales', () => {
    render(
      <MemoryRouter>
        <Navbar currentView="home" cartCount={2} />
      </MemoryRouter>
    );
    expect(screen.getByText('TIENDA DE FÚTBOL')).toBeTruthy();
    expect(screen.getByText('Inicio')).toBeTruthy();
    expect(screen.getByText('Productos')).toBeTruthy();
    expect(screen.getByText('Categorías')).toBeTruthy();
    expect(screen.getByText('Ofertas')).toBeTruthy();
  });

  it('muestra botones de inicio de sesión, registro y total del carrito', () => {
    render(
      <MemoryRouter>
        <Navbar currentView="home" cartCount={5} loggedUser={null} />
      </MemoryRouter>
    );
    expect(screen.getByText('Iniciar Sesión')).toBeTruthy();
    expect(screen.getByText('Registro')).toBeTruthy();
    expect(screen.getByText('Carrito (5)')).toBeTruthy();
  });

  it('muestra el nombre del usuario y permite cerrar sesión al estar autenticado', () => {
    const handleLogout = jasmine.createSpy('handleLogout');
    const mockUser = { nombre: 'Daniel', correo: 'daniel@test.cl' };

    render(
      <MemoryRouter>
        <Navbar
          currentView="home"
          loggedUser={mockUser}
          onLogout={handleLogout}
        />
      </MemoryRouter>
    );
    expect(screen.getByText(/Hola, Daniel/)).toBeTruthy();
    const logoutBtn = screen.getByText('Cerrar Sesión');
    fireEvent.click(logoutBtn);
    expect(handleLogout).toHaveBeenCalledTimes(1);
  });
});
