import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CartItem from '../../../components/molecules/CartItem/CartItem';

describe('CartItem Molecule', () => {
  const mockItem = {
    id: 1,
    titulo: 'Camiseta Francia 2026',
    talla: 'M',
    precio: 49990,
    cantidad: 2,
    img: 'francia.png'
  };

  it('renderiza el título, talla y subtotal correctamente', () => {
    render(
      <CartItem
        item={mockItem}
        index={0}
        onIncrement={() => {}}
        onDecrement={() => {}}
        onRemove={() => {}}
      />
    );
    expect(screen.getByText('Camiseta Francia 2026')).toBeTruthy();
    expect(screen.getByText(/Talla: M/)).toBeTruthy();
    // Subtotal: 49990 * 2 = 99980
    expect(screen.getByText(/99\.980/)).toBeTruthy();
  });

  it('llama a onIncrement al hacer click en el botón "+"', () => {
    const handleIncrement = jasmine.createSpy('handleIncrement');
    render(
      <CartItem
        item={mockItem}
        index={2}
        onIncrement={handleIncrement}
        onDecrement={() => {}}
        onRemove={() => {}}
      />
    );
    const incBtn = screen.getByText('+');
    fireEvent.click(incBtn);
    expect(handleIncrement).toHaveBeenCalledWith(2);
  });

  it('llama a onRemove al hacer click en el botón "Eliminar"', () => {
    const handleRemove = jasmine.createSpy('handleRemove');
    render(
      <CartItem
        item={mockItem}
        index={1}
        onIncrement={() => {}}
        onDecrement={() => {}}
        onRemove={handleRemove}
      />
    );
    const removeBtn = screen.getByText('Eliminar');
    fireEvent.click(removeBtn);
    expect(handleRemove).toHaveBeenCalledWith(1);
  });
});
