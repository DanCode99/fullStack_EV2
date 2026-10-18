import React from 'react';
import { render, screen } from '@testing-library/react';
import Heading from '../../../components/atoms/Heading/Heading';

describe('Heading Component', () => {
  it('renderiza el texto proporcionado como hijo', () => {
    render(<Heading level={1}>Título Principal</Heading>);
    expect(screen.getByText('Título Principal')).toBeTruthy();
  });

  it('renderiza la etiqueta HTML correspondiente al nivel indicado', () => {
    const { container } = render(<Heading level={1}>Encabezado H1</Heading>);
    const headingEl = container.querySelector('h1');
    expect(headingEl).not.toBeNull();
    expect(headingEl.tagName.toLowerCase()).toBe('h1');
  });

  it('aplica las clases Bulma de título y tamaño is-size adecuadas', () => {
    render(<Heading level={3}>Subtítulo</Heading>);
    const headingEl = screen.getByText('Subtítulo');
    expect(headingEl).toHaveClass('title');
    expect(headingEl).toHaveClass('is-size-3');
  });
});
