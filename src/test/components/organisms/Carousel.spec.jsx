import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Carousel from '../../../components/organisms/Carousel/Carousel';

describe('Carousel Organism', () => {
  const mockItems = [
    {
      id: 1,
      titulo: 'Camiseta Brasil Local',
      precio: 49990,
      img: 'brasil.jpg'
    },
    {
      id: 2,
      titulo: 'Camiseta Francia Local',
      precio: 52990,
      img: 'francia.jpg'
    }
  ];

  it('renderiza el primer item del carrusel con su título y precio', () => {
    render(<Carousel items={mockItems} />);
    expect(screen.getByText('Camiseta Brasil Local')).toBeTruthy();
    expect(screen.getByText(/49\.990/)).toBeTruthy();
  });

  it('avanza al siguiente item al hacer click en el botón siguiente', () => {
    render(<Carousel items={mockItems} />);
    const nextBtn = screen.getByLabelText('Siguiente');
    fireEvent.click(nextBtn);
    expect(screen.getByText('Camiseta Francia Local')).toBeTruthy();
  });

  it('llama a onSelectItem con el item actual al hacer click en la diapositiva', () => {
    const handleSelect = jasmine.createSpy('handleSelect');
    render(<Carousel items={mockItems} onSelectItem={handleSelect} />);
    const slideLink = screen.getByText('Camiseta Brasil Local').closest('.carrusel-slide-link');
    fireEvent.click(slideLink);
    expect(handleSelect).toHaveBeenCalledWith(mockItems[0]);
  });
});
