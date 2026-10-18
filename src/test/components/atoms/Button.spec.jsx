import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../../components/atoms/Button/Button';

describe('Button Component', () => {
  it('renderiza el botón con su contenido de texto correctamente', () => {
    render(<Button>Haz click</Button>);
    expect(screen.getByText('Haz click')).toBeTruthy();
  });

  it('aplica los props de variante correctamente', () => {
    render(<Button variant="primary">Haz click</Button>);
    const button = screen.getByText('Haz click');
    expect(button).toHaveClass('btn-primary');
    expect(button).toHaveClass('is-primary');
  });

  it('ejecuta la función onClick cuando el usuario hace clic', () => {
    const handleClick = jasmine.createSpy('handleClick');
    render(<Button onClick={handleClick}>Acción</Button>);
    const button = screen.getByText('Acción');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
