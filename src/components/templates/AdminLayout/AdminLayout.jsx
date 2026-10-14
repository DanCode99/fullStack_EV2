
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
        <div className="admin-topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img
            src="/assets/images/logo/logo.png"
            alt="Logo Tienda"
            style={{ maxHeight: '30px', objectFit: 'contain', cursor: 'pointer' }}
            onClick={onNavigateHome}
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
          <span style={{ fontWeight: 700, letterSpacing: '0.5px', color: '#ffffff', fontSize: '1rem', cursor: 'pointer' }} onClick={onNavigateHome}>
            TIENDA DE FÚTBOL
          </span>

          {/* Input Buscador */}
          <div className="admin-search-wrapper" style={{ marginLeft: '1rem', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.7, pointerEvents: 'none' }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Buscar en panel admin..."
              className="admin-search-input"
              style={{
                backgroundColor: '#1b1e22',
                border: '1px solid #343a40',
                borderRadius: '20px',
                padding: '0.4rem 1rem 0.4rem 2.2rem',
                color: '#ced4da',
                fontSize: '0.85rem',
                width: '260px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#00b89c'}
              onBlur={(e) => e.target.style.borderColor = '#343a40'}
            />
          </div>
        </div>

        {/* Zona Derecha: Usuario y Botón Salir */}
        <div className="admin-topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: '#00b89c',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.9rem',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}
            >
              {loggedUser?.nombre ? loggedUser.nombre.charAt(0).toUpperCase() : 'A'}
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                Sistema de administración
              </div>
              <div style={{ fontSize: '0.75rem', color: '#adb5bd' }}>
                {loggedUser?.tipoUsuario || 'Administrador'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #e63946',
              color: '#e63946',
              borderRadius: '6px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#e63946'
              e.currentTarget.style.color = '#ffffff'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#e63946'
            }}
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
