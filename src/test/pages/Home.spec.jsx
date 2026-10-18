import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomeView from '../../views/HomeView/HomeView';

describe('Home Page', () => {
  const mockProducts = [
    { id: 1, titulo: 'Camiseta 1', precio: 10000, categoria: 'Selecciones Nacionales', img: 'img1.jpg', stock: 10 },
    { id: 2, titulo: 'Camiseta 2', precio: 20000, categoria: 'Clubes Chilenos', img: 'img2.jpg', stock: 5 }
  ];

  it('renderiza el título de la página de inicio', () => {
    render(
      <MemoryRouter>
        <HomeView products={mockProducts} />
      </MemoryRouter>
    );
    const title = screen.getByText('Colección Destacada 2026');
    expect(title).toBeTruthy();
  });

  it('renderiza el subtítulo descriptivo del catálogo', () => {
    render(
      <MemoryRouter>
        <HomeView products={mockProducts} />
      </MemoryRouter>
    );
    const paragraph = screen.getByText(/Camisetas oficiales de selecciones mundiales/);
    expect(paragraph).toBeTruthy();
  });

  it('renderiza los botones de filtrado por categoría y botón de catálogo', () => {
    render(
      <MemoryRouter>
        <HomeView products={mockProducts} />
      </MemoryRouter>
    );
    expect(screen.getByText('Todas')).toBeTruthy();
    expect(screen.getAllByText('Selecciones Nacionales').length).toBeGreaterThan(0);
    expect(screen.getByText(/Explorar Todo el Catálogo/)).toBeTruthy();
  });
});
