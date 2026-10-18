import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MetricCard from '../../../components/molecules/MetricCard/MetricCard';

describe('MetricCard Molecule', () => {
  it('renderiza el título y el valor numérico principal', () => {
    render(<MetricCard title="Ventas Totales" value="$250.000" />);
    expect(screen.getByText('Ventas Totales')).toBeTruthy();
    expect(screen.getByText('$250.000')).toBeTruthy();
  });

  it('renderiza el subtítulo y la etiqueta de tendencia', () => {
    render(
      <MetricCard
        title="Pedidos"
        value="45"
        subtitle="Últimos 30 días"
        trend="+15%"
      />
    );
    expect(screen.getByText('Últimos 30 días')).toBeTruthy();
    expect(screen.getByText('+15%')).toBeTruthy();
  });

  it('ejecuta la función onClick cuando el usuario hace clic', () => {
    const handleClick = jasmine.createSpy('handleClick');
    render(
      <MetricCard
        title="Usuarios"
        value="120"
        onClick={handleClick}
      />
    );
    const card = screen.getByText('Usuarios').closest('.box');
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
