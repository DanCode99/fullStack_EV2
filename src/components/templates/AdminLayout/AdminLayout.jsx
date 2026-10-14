
export function AdminLayout({
  children,
  currentAdminTab,
  onSelectTab,
  onNavigateHome,
  onLogout,
  loggedUser
}) {
  const isSeller = loggedUser && (loggedUser.tipoUsuario === 'Vendedor' || loggedUser.tipo === 'Vendedor')

  return (
    <section className="admin-section">
      <nav className="navbar is-dark is-hidden-desktop admin-mobile-nav" role="navigation">
        <div className="navbar-brand">
          <span className="navbar-item has-text-weight-bold">
            PANEL ADMINISTRADOR
          </span>
        </div>
      </nav>

      <div className="admin-container">
        <aside className="has-background-dark admin-sidebar">
          <p className="menu-label has-text-grey-light has-text-weight-bold is-size-7 admin-menu-label">
            ADMINISTRACIÓN
          </p>
          <ul className="menu-list admin-menu-list">
            <li className="admin-menu-item">
              <a
                className={`admin-menu-link ${currentAdminTab === 'dashboard' ? 'is-active has-background-primary has-text-white' : 'has-text-light'}`}
                onClick={() => onSelectTab('dashboard')}
              >
                Dashboard
              </a>
            </li>
            <li className="admin-menu-item">
              <a
                className={`admin-menu-link ${currentAdminTab === 'productos' ? 'is-active has-background-primary has-text-white' : 'has-text-light'}`}
                onClick={() => onSelectTab('productos')}
              >
                Productos
              </a>
            </li>
            {!isSeller && (
              <li className="admin-menu-item">
                <a
                  className={`admin-menu-link ${currentAdminTab === 'usuarios' ? 'is-active has-background-primary has-text-white' : 'has-text-light'}`}
                  onClick={() => onSelectTab('usuarios')}
                >
                  Usuarios
                </a>
              </li>
            )}
          </ul>

          <p className="menu-label has-text-grey-light has-text-weight-bold is-size-7 admin-menu-label">
            ACCESOS DIRECTOS
          </p>
          <ul className="menu-list admin-menu-list">
            <li className="admin-menu-item">
              <a
                className="has-text-light admin-menu-link"
                onClick={onNavigateHome}
              >
                Ir a la Tienda
              </a>
            </li>
            <li className="admin-menu-item">
              <a
                className="has-text-danger-light admin-menu-link"
                onClick={onLogout}
              >
                Cerrar Sesión
              </a>
            </li>
          </ul>
        </aside>

        <main className="admin-main has-background-light">
          {children}
        </main>
      </div>
    </section>
  )
}
