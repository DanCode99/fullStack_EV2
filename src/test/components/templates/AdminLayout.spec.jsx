import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AdminLayout from '../../../components/templates/AdminLayout/AdminLayout';

describe('AdminLayout Template', () => {
  const mockUser = {
    nombre: 'Admin Master',
    tipoUsuario: 'Administrador'
  };

  it('renderiza el contenido hijo en el contenedor principal', () => {
    render(
      <AdminLayout
        currentAdminTab="dashboard"
        onSelectTab={() => {}}
        onNavigateHome={() => {}}
        onLogout={() => {}}
        loggedUser={mockUser}
      >
        <div data-testid="admin-content">Panel de Administración Activo</div>
      </AdminLayout>
    );
    expect(screen.getByTestId('admin-content')).toBeTruthy();
    expect(screen.getByText('Panel de Administración Activo')).toBeTruthy();
  });

  it('renderiza las opciones del menú lateral y la información del usuario', () => {
    render(
      <AdminLayout
        currentAdminTab="dashboard"
        onSelectTab={() => {}}
        onNavigateHome={() => {}}
        onLogout={() => {}}
        loggedUser={mockUser}
      >
        <div>Contenido</div>
      </AdminLayout>
    );
    expect(screen.getByText('Dashboard')).toBeTruthy();
    expect(screen.getByText('Órdenes')).toBeTruthy();
    expect(screen.getByText('Productos')).toBeTruthy();
    expect(screen.getByText('Sistema de administración')).toBeTruthy();
    expect(screen.getByText('Administrador')).toBeTruthy();
  });

  it('llama a onSelectTab al hacer clic en una opción del menú y a onLogout al presionar Salir', () => {
    const handleSelectTab = jasmine.createSpy('handleSelectTab');
    const handleLogout = jasmine.createSpy('handleLogout');

    render(
      <AdminLayout
        currentAdminTab="dashboard"
        onSelectTab={handleSelectTab}
        onNavigateHome={() => {}}
        onLogout={handleLogout}
        loggedUser={mockUser}
      >
        <div>Contenido</div>
      </AdminLayout>
    );

    const ordenesTab = screen.getByText('Órdenes');
    fireEvent.click(ordenesTab);
    expect(handleSelectTab).toHaveBeenCalledWith('ordenes');

    const salirBtn = screen.getByText('Salir');
    fireEvent.click(salirBtn);
    expect(handleLogout).toHaveBeenCalledTimes(1);
  });
});
