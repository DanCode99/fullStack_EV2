import React from 'react';
import { render, screen } from '@testing-library/react';
import ReportsPanel from '../../../components/organisms/ReportsPanel/ReportsPanel';

describe('ReportsPanel Organism', () => {
  const mockProducts = [
    {
      id: 1,
      titulo: 'Camiseta Chile',
      precio: 50000,
      stock: 2,
      stockCritico: 5,
      categoria: 'Selecciones Nacionales'
    },
    {
      id: 2,
      titulo: 'Camiseta Argentina',
      precio: 60000,
      stock: 15,
      stockCritico: 5,
      categoria: 'Selecciones Nacionales'
    }
  ];

  const mockOrders = [
    {
      id: 'ORD-1',
      fecha: '2026-03-01',
      total: 50000,
      userRun: '12345678-9',
      items: [{ id: 1, titulo: 'Camiseta Chile', cantidad: 1, precio: 50000 }]
    }
  ];

  const mockUsers = [
    { run: '12345678-9', nombre: 'Daniel', apellidos: 'Soto', region: 'Metropolitana' }
  ];

  it('renderiza el título del panel y los KPIs principales', () => {
    render(<ReportsPanel orders={mockOrders} products={mockProducts} users={mockUsers} />);
    expect(screen.getByText('Panel de Reportes y Estadísticas')).toBeTruthy();
    expect(screen.getByText('Ventas Totales')).toBeTruthy();
    expect(screen.getByText('Órdenes Registradas')).toBeTruthy();
    expect(screen.getByText('Ticket Promedio')).toBeTruthy();
  });

  it('muestra la alerta de stock crítico para productos con stock bajo', () => {
    render(<ReportsPanel orders={mockOrders} products={mockProducts} users={mockUsers} />);
    expect(screen.getByText(/Alerta de Inventario:/)).toBeTruthy();
    expect(screen.getAllByText('Camiseta Chile').length).toBeGreaterThanOrEqual(1);
  });

  it('renderiza el ranking de productos más vendidos con su porcentaje e ingresos', () => {
    render(<ReportsPanel orders={mockOrders} products={mockProducts} users={mockUsers} />);
    expect(screen.getByText('Productos Más Vendidos (Ranking Oficial)')).toBeTruthy();
    expect(screen.getByText('1 unid.')).toBeTruthy();
  });
});
