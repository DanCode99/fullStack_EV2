
import { useState } from 'react'

export function AdminLayout({
  children,
  currentAdminTab,
  onSelectTab,
  onNavigateHome,
  onLogout,
  loggedUser
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isSeller = loggedUser && (loggedUser.tipoUsuario === 'Vendedor' || loggedUser.tipo === 'Vendedor')

  const handleTabClick = (tabKey) => {
    onSelectTab(tabKey)
    setMobileMenuOpen(false)
  }

  return (
    <section className="admin-section">
      {/* Barra móvil */}
      <nav className="navbar is-dark is-hidden-desktop admin-mobile-nav" role="navigation" aria-label="admin mobile navigation">
        <div className="navbar-brand">
          <span className="navbar-item has-text-weight-bold has-text-primary">
            ⚽ PANEL ADMINISTRADOR
          </span>
          <button
            className={`navbar-burger burger ${mobileMenuOpen ? 'is-active' : ''}`}
            aria-label="menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>
      </nav>

      <div className="admin-container">
        {/* Sidebar Administrador */}
        <aside className={`has-background-dark admin-sidebar ${mobileMenuOpen ? 'is-active' : ''}`}>
          <div className="mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <p className="has-text-white has-text-weight-bold is-size-6 mb-1">
              ⚽ FÚTBOL STORE
            </p>
            {loggedUser && (
              <p className="is-size-7 has-text-grey-light mb-0">
                👤 {loggedUser.nombre} ({loggedUser.tipoUsuario || 'Admin'})
              </p>
            )}
          </div>

          <p className="menu-label has-text-grey-light has-text-weight-bold is-size-7 admin-menu-label">
            ADMINISTRACIÓN
          </p>
          <ul className="menu-list admin-menu-list">
            <li className="admin-menu-item">
              <a
                className={`admin-menu-link ${currentAdminTab === 'dashboard' ? 'is-active has-background-primary has-text-white' : 'has-text-light'}`}
                onClick={() => handleTabClick('dashboard')}
                id="admin-nav-dashboard"
              >
                <span className="mr-2">📊</span> Dashboard
              </a>
            </li>
            <li className="admin-menu-item">
              <a
                className={`admin-menu-link ${currentAdminTab === 'ordenes' ? 'is-active has-background-primary has-text-white' : 'has-text-light'}`}
                onClick={() => handleTabClick('ordenes')}
                id="admin-nav-ordenes"
              >
                <span className="mr-2">🧾</span> Órdenes / Boletas
              </a>
            </li>
            <li className="admin-menu-item">
              <a
                className={`admin-menu-link ${currentAdminTab === 'productos' ? 'is-active has-background-primary has-text-white' : 'has-text-light'}`}
                onClick={() => handleTabClick('productos')}
                id="admin-nav-productos"
              >
                <span className="mr-2">👕</span> Productos
              </a>
            </li>
            {!isSeller && (
              <li className="admin-menu-item">
                <a
                  className={`admin-menu-link ${currentAdminTab === 'usuarios' ? 'is-active has-background-primary has-text-white' : 'has-text-light'}`}
                  onClick={() => handleTabClick('usuarios')}
                  id="admin-nav-usuarios"
                >
                  <span className="mr-2">👥</span> Usuarios
                </a>
              </li>
            )}
            <li className="admin-menu-item">
              <a
                className={`admin-menu-link ${currentAdminTab === 'reportes' ? 'is-active has-background-primary has-text-white' : 'has-text-light'}`}
                onClick={() => handleTabClick('reportes')}
                id="admin-nav-reportes"
              >
                <span className="mr-2">📈</span> Reportes y Métricas
              </a>
            </li>
          </ul>

          <p className="menu-label has-text-grey-light has-text-weight-bold is-size-7 admin-menu-label">
            ACCESOS DIRECTOS
          </p>
          <ul className="menu-list admin-menu-list">
            <li className="admin-menu-item">
              <a
                className="has-text-light admin-menu-link"
                onClick={onNavigateHome}
                id="admin-nav-store"
              >
                <span className="mr-2">🏪</span> Ir a la Tienda
              </a>
            </li>
            <li className="admin-menu-item">
              <a
                className="has-text-danger-light admin-menu-link"
                onClick={onLogout}
                id="admin-nav-logout"
              >
                <span className="mr-2">🚪</span> Cerrar Sesión
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

