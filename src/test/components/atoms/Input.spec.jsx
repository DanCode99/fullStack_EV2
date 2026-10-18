import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../../../components/atoms/Input/Input';

describe('Input Component', () => {
  it('renderiza con el placeholder y tipo especificados', () => {
    render(<Input placeholder="Ingrese su correo" type="email" />);
    const input = screen.getByPlaceholderText('Ingrese su correo');
    expect(input).toBeTruthy();
    expect(input.getAttribute('type')).toBe('email');
  });

  it('emite el evento onChange al escribir en el campo', () => {
    const handleChange = jasmine.createSpy('handleChange');
    render(<Input placeholder="Nombre" onChange={handleChange} />);
    const input = screen.getByPlaceholderText('Nombre');
    fireEvent.change(input, { target: { value: 'Daniel' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('aplica la clase de error is-danger cuando hasError es true', () => {
    render(<Input placeholder="RUT" hasError={true} />);
    const input = screen.getByPlaceholderText('RUT');
    expect(input).toHaveClass('input');
    expect(input).toHaveClass('is-danger');
  });
});
