
export function AdminLayout({
  children,
  currentAdminTab,
  onSelectTab,
  onNavigateHome,
  onLogout,
  loggedUser
}) {
  const isSeller = loggedUser && (loggedUser.tipoUsuario === 'Vendedor' || loggedUser.tipo === 'Vendedor')

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'ordenes', label: 'Órdenes' },
    { id: 'productos', label: 'Productos' },
    { id: 'categorias', label: 'Categorías' },
    ...(!isSeller ? [{ id: 'usuarios', label: 'Usuarios' }] : []),
    { id: 'reportes', label: 'Reportes' },
    { id: 'perfil', label: 'Perfil' }
  ]

  return (
    <section className="admin-section">
      {/* Barra superior con Buscador, Sistema de Administración, Usuario y Botón Salir */}
      <div className="admin-topbar">
        <div className="admin-topbar-left">
          <img
            src="/assets/images/logo/logo.png"
            alt="Logo Tienda"
            className="admin-topbar-logo"
            onClick={onNavigateHome}
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
          <span className="admin-topbar-brand" onClick={onNavigateHome}>
            TIENDA DE FÚTBOL
          </span>

          {/* Input Buscador */}
          <div className="admin-search-wrapper">
            <span className="admin-search-icon">
              🔍
            </span>
            <input
              type="text"
              placeholder="Buscar en panel admin..."
              className="admin-search-input"
            />
          </div>
        </div>

        {/* Zona Derecha: Usuario y Botón Salir */}
        <div className="admin-topbar-right">
          <div className="admin-user-profile">
            <div className="admin-user-avatar">
              {loggedUser?.nombre ? loggedUser.nombre.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="admin-user-info">
              <div className="admin-user-name">
                Sistema de administración
              </div>
              <div className="admin-user-role">
                {loggedUser?.tipoUsuario || 'Administrador'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="admin-btn-logout-outline"
          >
            Salir
          </button>
        </div>
      </div>

      <div className="admin-container">
        <aside className="admin-sidebar">
          <ul className="admin-nav-list">
            {menuItems.map((item) => {
              const isActive = currentAdminTab === item.id
              return (
                <li key={item.id} className="admin-nav-item">
                  <button
                    type="button"
                    className={`admin-nav-link ${isActive ? 'is-active' : ''}`}
                    onClick={() => onSelectTab(item.id)}
                  >
                    <span className="admin-nav-indicator"></span>
                    <span className="admin-nav-text">{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="admin-sidebar-bottom">
            <button
              type="button"
              className="admin-action-btn admin-btn-tienda"
              onClick={onNavigateHome}
            >
              <span>Tienda</span>
            </button>
            <button
              type="button"
              className="admin-action-btn admin-btn-logout"
              onClick={onLogout}
            >
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </aside>

        <main className="admin-main">
          {children}
        </main>
      </div>
    </section>
  )
}

export default AdminLayout

