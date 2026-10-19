import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../atoms/Button/Button.jsx'

export function Navbar({
  currentView,
  onNavigate,
  loggedUser,
  onLogout,
  cartCount = 0
}) {
  const [burgerActive, setBurgerActive] = useState(false)
  const navigate = useNavigate()

  const handleNav = (view) => {
    setBurgerActive(false)
    if (onNavigate) {
      onNavigate(view)
    } else {
      navigate(view === 'home' ? '/' : `/${view}`)
    }
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
          <Link
            to="/"
            className="navbar-item is-flex is-align-items-center"
            onClick={() => setBurgerActive(false)}
          >
            <img
              src="/assets/images/logo/logo.png"
              alt="Logo Tienda de Fútbol"
              className="mr-2"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            <strong className="has-text-primary is-size-5">
              TIENDA DE FÚTBOL
            </strong>
          </Link>

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
            <Link
              to="/"
              className={`navbar-item ${currentView === 'home' ? 'is-active' : ''}`}
              onClick={() => setBurgerActive(false)}
            >
              Inicio
            </Link>
            <Link
              to="/productos"
              className={`navbar-item ${currentView === 'productos' ? 'is-active' : ''}`}
              onClick={() => setBurgerActive(false)}
            >
              Productos
            </Link>
            <Link
              to="/categorias"
              className={`navbar-item ${currentView === 'categorias' ? 'is-active' : ''}`}
              onClick={() => setBurgerActive(false)}
            >
              Categorías
            </Link>
            <Link
              to="/ofertas"
              className={`navbar-item ${currentView === 'ofertas' ? 'is-active' : ''}`}
              onClick={() => setBurgerActive(false)}
            >
              Ofertas
            </Link>
            <Link
              to="/nosotros"
              className={`navbar-item ${currentView === 'nosotros' ? 'is-active' : ''}`}
              onClick={() => setBurgerActive(false)}
            >
              Nosotros
            </Link>
            <Link
              to="/blog"
              className={`navbar-item ${currentView === 'blog' ? 'is-active' : ''}`}
              onClick={() => setBurgerActive(false)}
            >
              Blog
            </Link>
            <Link
              to="/contacto"
              className={`navbar-item ${currentView === 'contacto' ? 'is-active' : ''}`}
              onClick={() => setBurgerActive(false)}
            >
              Contacto
            </Link>
            {isAdminOrSeller && (
              <Link
                to="/admin"
                className={`navbar-item has-text-warning ${currentView === 'admin' ? 'is-active' : ''}`}
                onClick={() => setBurgerActive(false)}
              >
                Panel Admin
              </Link>
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

export default Navbar

