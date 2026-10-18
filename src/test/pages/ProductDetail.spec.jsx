import React, { Profiler } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProductDetailView from '../../views/ProductDetailView/ProductDetailView';

describe('ProductDetail Page', () => {
  let renderSpy;
  const mockProducts = [
    {
      id: 1,
      titulo: 'Camiseta Brasil 2026',
      precio: 49990,
      descripcion: 'Descripción del producto 1.',
      stock: 10,
      categoria: 'Selecciones',
      img: 'test.jpg'
    }
  ];

  beforeEach(() => {
    renderSpy = jasmine.createSpy('onRender');
  });

  it('muestra mensaje de error cuando el producto no existe', () => {
    render(
      <Profiler id="ProductDetail" onRender={renderSpy}>
        <MemoryRouter initialEntries={['/productos/999']}>
          <Routes>
            <Route path="/productos/:id" element={<ProductDetailView products={mockProducts} />} />
          </Routes>
        </MemoryRouter>
      </Profiler>
    );
    expect(screen.getByText('Producto no encontrado')).toBeTruthy();
  });

  it('mide el tiempo de renderizado del componente', () => {
    render(
      <Profiler id="ProductDetail" onRender={renderSpy}>
        <MemoryRouter initialEntries={['/productos/1']}>
          <Routes>
            <Route path="/productos/:id" element={<ProductDetailView products={mockProducts} />} />
          </Routes>
        </MemoryRouter>
      </Profiler>
    );
    expect(renderSpy).toHaveBeenCalled();
    const call = renderSpy.calls.mostRecent();
    const actualDuration = call.args[3]; // actualDuration de onRender
    console.log('Tiempo de renderizado de ProductDetail:', actualDuration, 'ms');
    expect(actualDuration).toBeLessThan(150);
  });

  it('renderiza la información completa del producto cuando el ID es válido', () => {
    render(
      <MemoryRouter initialEntries={['/productos/1']}>
        <Routes>
          <Route path="/productos/:id" element={<ProductDetailView products={mockProducts} />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Camiseta Brasil 2026')).toBeTruthy();
    expect(screen.getByText('Descripción del producto 1.')).toBeTruthy();
    expect(screen.getByText(/49\.990/)).toBeTruthy();
  });
});
