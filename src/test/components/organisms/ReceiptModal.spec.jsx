import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ReceiptModal from '../../../components/organisms/ReceiptModal/ReceiptModal';

describe('ReceiptModal Organism', () => {
  const mockOrder = {
    id: 'ORD-1234',
    fecha: '2026-03-15',
    customerName: 'Daniel Soto',
    userRun: '12345678-9',
    estado: 'Completado',
    total: 50000,
    items: [
      {
        id: 1,
        titulo: 'Camiseta Chile Local',
        precio: 50000,
        cantidad: 1,
        talla: 'L'
      }
    ]
  };

  it('no renderiza nada en el DOM cuando isOpen es false', () => {
    const { container } = render(
      <ReceiptModal order={mockOrder} isOpen={false} onClose={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renderiza la información de la boleta, cliente y total cuando isOpen es true', () => {
    render(
      <ReceiptModal order={mockOrder} isOpen={true} onClose={() => {}} />
    );
    expect(screen.getByText('BOLETA ELECTRÓNICA')).toBeTruthy();
    expect(screen.getByText('Daniel Soto')).toBeTruthy();
    expect(screen.getByText('Camiseta Chile Local')).toBeTruthy();
    expect(screen.getAllByText('$50.000').length).toBeGreaterThanOrEqual(1);
  });

  it('ejecuta la función onClose al hacer clic en el botón Cerrar', () => {
    const handleClose = jasmine.createSpy('handleClose');
    render(
      <ReceiptModal order={mockOrder} isOpen={true} onClose={handleClose} />
    );
    const closeBtn = screen.getByText('Cerrar');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
