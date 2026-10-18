import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import ProductCard from '../../../components/molecules/ProductCard/ProductCard';

// Componente envolvente para mockear useNavigate
const MockRouter = ({ children, mockNavigate }) => {
  const router = createMemoryRouter(
    [{ path: '*', element: children }],
    { initialEntries: ['/'] }
  );
  router.navigate = mockNavigate;
  return <RouterProvider router={router} />;
};

describe('ProductCard Component', () => {
  let mockNavigate;
  const mockProduct = {
    id: 1,
    titulo: 'Camiseta Brasil Local 2026',
    name: 'Camiseta Brasil Local 2026',
    descripcion: 'Polera oficial de la selección brasileña.',
    description: 'Polera oficial de la selección brasileña.',
    precio: 10000,
    price: 10000,
    stock: 10,
    categoria: 'Selecciones Nacionales',
    img: 'test.jpg',
    image: 'test.jpg'
  };

  beforeEach(() => {
    mockNavigate = jasmine.createSpy('navigate');
  });

  it('renderiza el título y la categoría del producto', () => {
    render(
      <MockRouter mockNavigate={mockNavigate}>
        <ProductCard product={mockProduct} />
      </MockRouter>
    );
    expect(screen.getByText(mockProduct.titulo)).toBeTruthy();
    expect(screen.getByText(mockProduct.categoria)).toBeTruthy();
  });

  it('renderiza el precio formateado y el botón de detalles', () => {
    render(
      <MockRouter mockNavigate={mockNavigate}>
        <ProductCard product={mockProduct} />
      </MockRouter>
    );
    expect(screen.getByText(/10\.000/)).toBeTruthy();
    const button = screen.getByText('Ver detalles');
    expect(button).toBeTruthy();
    expect(button).toHaveClass('btn-primary');
  });

  it('navega a detalles al hacer click en el botón', () => {
    render(
      <MockRouter mockNavigate={mockNavigate}>
        <ProductCard product={mockProduct} />
      </MockRouter>
    );
    const button = screen.getByText('Ver detalles');
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/products/1', jasmine.any(Object));
  });
});
