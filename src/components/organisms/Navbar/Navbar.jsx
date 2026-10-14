import { useState } from 'react'
import { Button } from '../../atoms/Button/Button.jsx'

export function Navbar({
  currentView,
  onNavigate,
  loggedUser,
  onLogout,
  cartCount = 0
}) {
  const [burgerActive, setBurgerActive] = useState(false)

  const handleNav = (view) => {
    setBurgerActive(false)
    onNavigate(view)
  }

  const isAdminOrSeller = loggedUser && (
    loggedUser.tipoUsuario === 'Administrador' ||
    loggedUser.tipoUsuario === 'Vendedor' ||
    loggedUser.tipo === 'Administrador' ||
    loggedUser.tipo === 'Vendedor'
  )

  return (
    <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
      <div className="container">
        <div className="navbar-brand">
          <a
            className="navbar-item"
            onClick={() => handleNav('home')}
            style={{ cursor: 'pointer' }}
          >
            <img
              src="/assets/images/logo/logo.png"
              alt="Logo Tienda"
              className="img-cover"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            <strong className="has-text-primary ml-2 is-size-5">FÚTBOL STORE</strong>
          </a>

          <a
            role="button"
            className={`navbar-burger ${burgerActive ? 'is-active' : ''}`}
            aria-label="menu"
            aria-expanded="false"
            onClick={() => setBurgerActive(!burgerActive)}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div className={`navbar-menu ${burgerActive ? 'is-active' : ''}`}>
          <div className="navbar-start">
            <a
              className={`navbar-item ${currentView === 'home' ? 'is-active' : ''}`}
              onClick={() => handleNav('home')}
            >
              Inicio
            </a>
            <a
              className={`navbar-item ${currentView === 'productos' ? 'is-active' : ''}`}
              onClick={() => handleNav('productos')}
            >
              Productos
            </a>
            <a
              className={`navbar-item ${currentView === 'categorias' ? 'is-active' : ''}`}
              onClick={() => handleNav('categorias')}
            >
              Categorías
            </a>
            <a
              className={`navbar-item ${currentView === 'ofertas' ? 'is-active' : ''}`}
              onClick={() => handleNav('ofertas')}
            >
              Ofertas
            </a>
            <a
              className={`navbar-item ${currentView === 'nosotros' ? 'is-active' : ''}`}
              onClick={() => handleNav('nosotros')}
            >
              Nosotros
            </a>
            <a
              className={`navbar-item ${currentView === 'blog' ? 'is-active' : ''}`}
              onClick={() => handleNav('blog')}
            >
              Blog
            </a>
            <a
              className={`navbar-item ${currentView === 'contacto' ? 'is-active' : ''}`}
              onClick={() => handleNav('contacto')}
            >
              Contacto
            </a>
            {isAdminOrSeller && (
              <a
                className={`navbar-item has-text-warning ${currentView === 'admin' ? 'is-active' : ''}`}
                onClick={() => handleNav('admin')}
              >
                Panel Admin
              </a>
            )}
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                {loggedUser ? (
                  <>
                    <span className="navbar-item has-text-white is-size-7">
                      Hola, {loggedUser.nombre || loggedUser.correo}
                    </span>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={onLogout}
                    >
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="light"
                      size="small"
                      onClick={() => handleNav('login')}
                    >
                      Iniciar Sesión
                    </Button>
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => handleNav('registro')}
                    >
                      Registro
                    </Button>
                  </>
                )}
                <Button
                  variant="primary"
                  size="small"
                  className="is-outlined"
                  onClick={() => handleNav('carrito')}
                >
                  Carrito ({cartCount})
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
