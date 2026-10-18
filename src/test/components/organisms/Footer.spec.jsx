import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Footer from '../../../components/organisms/Footer/Footer';

describe('Footer Organism', () => {
  it('renderiza los encabezados de las secciones del footer', () => {
    render(<Footer onNavigate={() => {}} />);
    expect(screen.getByText('Nuestra Tienda')).toBeTruthy();
    expect(screen.getByText('Mi Cuenta')).toBeTruthy();
    expect(screen.getByText('Acerca de')).toBeTruthy();
  });

  it('renderiza la mención del país y el copyright del proyecto', () => {
    render(<Footer onNavigate={() => {}} />);
    expect(screen.getByText(/Chile/)).toBeTruthy();
    expect(screen.getByText(/Fútbol Store - Proyecto de Evaluación Frontend/)).toBeTruthy();
  });

  it('llama a onNavigate al hacer click en un enlace como "Catálogo"', () => {
    const handleNavigate = jasmine.createSpy('handleNavigate');
    render(<Footer onNavigate={handleNavigate} />);
    const catalogoLink = screen.getByText('Catálogo');
    fireEvent.click(catalogoLink);
    expect(handleNavigate).toHaveBeenCalledWith('productos');
  });
});
