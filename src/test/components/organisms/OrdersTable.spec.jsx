import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrdersTable from '../../../components/organisms/OrdersTable/OrdersTable';

describe('OrdersTable Organism', () => {
  const mockOrders = [
    {
      id: 'ORD-2026-001',
      fecha: '2026-03-10',
      customerName: 'Carlos Pinto',
      userRun: '11111111-1',
      estado: 'Completado',
      total: 35000,
      items: [{ id: 1, titulo: 'Camiseta Colo-Colo', cantidad: 1, precio: 35000 }]
    }
  ];

  it('renderiza mensaje cuando la lista de órdenes está vacía', () => {
    render(<OrdersTable orders={[]} onViewReceipt={() => {}} />);
    expect(screen.getByText('No se encontraron órdenes')).toBeTruthy();
  });

  it('renderiza la lista de órdenes con su ID, cliente y total', () => {
    render(<OrdersTable orders={mockOrders} onViewReceipt={() => {}} />);
    expect(screen.getByText('ORD-2026-001')).toBeTruthy();
    expect(screen.getByText('Carlos Pinto')).toBeTruthy();
    expect(screen.getAllByText('$35.000').length).toBeGreaterThanOrEqual(1);
  });

  it('llama a onViewReceipt al hacer clic en el botón "Ver Boleta"', () => {
    const handleViewReceipt = jasmine.createSpy('handleViewReceipt');
    render(<OrdersTable orders={mockOrders} onViewReceipt={handleViewReceipt} />);
    const viewBtn = screen.getByText(/Ver Boleta/);
    fireEvent.click(viewBtn);
    expect(handleViewReceipt).toHaveBeenCalledWith(mockOrders[0]);
  });
});
