import React from 'react';
import { render, screen } from '@testing-library/react';
import FormField from '../../../components/molecules/FormField/FormField';

describe('FormField Molecule', () => {
  it('renderiza la etiqueta label asociada al id del control', () => {
    render(
      <FormField label="Correo Electrónico" id="email-field">
        <input id="email-field" />
      </FormField>
    );
    const label = screen.getByText('Correo Electrónico');
    expect(label).toBeTruthy();
    expect(label.getAttribute('for')).toBe('email-field');
  });

  it('muestra el mensaje de error cuando se le pasa la prop error', () => {
    render(
      <FormField label="Correo" error="El correo es obligatorio">
        <input />
      </FormField>
    );
    const errorText = screen.getByText('El correo es obligatorio');
    expect(errorText).toBeTruthy();
    expect(errorText).toHaveClass('is-danger');
  });

  it('renderiza el componente hijo dentro del contenedor del campo', () => {
    render(
      <FormField label="Nombre">
        <button type="button">Botón Hijo</button>
      </FormField>
    );
    expect(screen.getByText('Botón Hijo')).toBeTruthy();
  });
});
