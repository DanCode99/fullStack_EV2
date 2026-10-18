import React from 'react';
import { render, screen } from '@testing-library/react';
import Badge from '../../../components/atoms/Badge/Badge';

describe('Badge Component', () => {
  it('renderiza el contenido del badge correctamente', () => {
    render(<Badge>Nuevo</Badge>);
    expect(screen.getByText('Nuevo')).toBeTruthy();
  });

  it('aplica la clase de variante is-success por defecto o prop', () => {
    render(<Badge variant="success">En Stock</Badge>);
    const badge = screen.getByText('En Stock');
    expect(badge).toHaveClass('is-success');
    expect(badge).toHaveClass('tag');
  });

  it('permite añadir clases adicionales mediante className', () => {
    render(<Badge className="custom-extra-class">Oferta</Badge>);
    const badge = screen.getByText('Oferta');
    expect(badge).toHaveClass('custom-extra-class');
  });
});
