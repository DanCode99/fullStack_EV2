import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../atoms/Button/Button.jsx'
import { PromoAnnouncementBar } from '../../molecules/PromoAnnouncementBar/PromoAnnouncementBar.jsx'

export function Navbar({
  currentView,
  onNavigate,
  loggedUser,
  onLogout,
  cartCount = 0,
  onOpenCart
}) {
  const [burgerActive, setBurgerActive] = useState(false)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [megaTimer, setMegaTimer] = useState(null)
  const navigate = useNavigate()

  const handleMouseEnterMega = () => {
    if (megaTimer) clearTimeout(megaTimer)
    setIsMegaMenuOpen(true)
  }

  const handleMouseLeaveMega = () => {
    const timer = setTimeout(() => {
      setIsMegaMenuOpen(false)
    }, 180)
    setMegaTimer(timer)
  }

  const handleMegaLinkClick = () => {
    setIsMegaMenuOpen(false)
    setBurgerActive(false)
  }

  const handleNav = (view) => {
    setBurgerActive(false)
    setIsMegaMenuOpen(false)
    if (onNavigate) {
      onNavigate(view)
    } else {
      navigate(view === 'home' ? '/' : `/${view}`)
    }
  }

  const userRole = (loggedUser?.rol || loggedUser?.tipoUsuario || '').toUpperCase()
  const isAdminOrSeller = loggedUser && (
    userRole === 'ADMIN' ||
    userRole === 'VENDEDOR' ||
    userRole === 'ADMINISTRADOR'
  )

  return (
    <header className="main-sticky-header">
      <nav className="navbar is-dark pro-master-navbar" role="navigation" aria-label="main navigation">
        <div className="container">
          <div className="navbar-brand">
            <Link
              to="/"
              className="navbar-item is-flex is-align-items-center pro-brand-link"
              onClick={() => setBurgerActive(false)}
            >
              <img
                src="/assets/images/logo/logo.png"
                alt="Logo Tienda de Fútbol"
                className="mr-3 pro-brand-logo"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
              <strong className="has-text-primary pro-brand-title">
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
              <div
                className="navbar-item-mega-trigger-wrap is-flex"
                onMouseEnter={handleMouseEnterMega}
                onMouseLeave={handleMouseLeaveMega}
              >
                <Link
                  to="/productos"
                  className={`navbar-item ${currentView === 'productos' ? 'is-active' : ''}`}
                  onClick={() => {
                    setBurgerActive(false)
                    setIsMegaMenuOpen(false)
                  }}
                >
                  Productos
                </Link>
                <Link
                  to="/categorias"
                  className={`navbar-item ${currentView === 'categorias' ? 'is-active' : ''}`}
                  onClick={() => {
                    setBurgerActive(false)
                    setIsMegaMenuOpen(false)
                  }}
                >
                  Categorías
                </Link>
                <Link
                  to="/ofertas"
                  className={`navbar-item ${currentView === 'ofertas' ? 'is-active' : ''}`}
                  onClick={() => {
                    setBurgerActive(false)
                    setIsMegaMenuOpen(false)
                  }}
                >
                  Ofertas
                </Link>
              </div>
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
                  Panel Admin ({userRole})
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
                    onClick={() => {
                      if (onOpenCart) {
                        onOpenCart()
                      } else {
                        handleNav('carrito')
                      }
                    }}
                  >
                    Carrito ({cartCount})
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mega-Menú Desplegable al pasar el puntero (onMouseEnter) */}
      {isMegaMenuOpen && (
        <div
          className="mega-menu-wrapper"
          onMouseEnter={handleMouseEnterMega}
          onMouseLeave={handleMouseLeaveMega}
        >
          <div className="mega-menu-inner-grid">
            {/* Columna 1 — Selecciones Nacionales */}
            <div className="mega-menu-col">
              <div className="mega-menu-col-header">
                <h4 className="mega-menu-col-title">Selecciones Nacionales</h4>
              </div>
              <ul className="mega-menu-links">
                <li className="mega-menu-link-item">
                  <Link
                    to="/productos?buscar=Brasil"
                    className="mega-menu-link"
                    onClick={handleMegaLinkClick}
                  >
                    Brasil 2026
                  </Link>
                </li>
                <li className="mega-menu-link-item">
                  <Link
                    to="/productos?buscar=Argentina"
                    className="mega-menu-link"
                    onClick={handleMegaLinkClick}
                  >
                    Argentina Tres Estrellas
                  </Link>
                </li>
                <li className="mega-menu-link-item">
                  <Link
                    to="/productos?buscar=Francia"
                    className="mega-menu-link"
                    onClick={handleMegaLinkClick}
                  >
                    Francia Local 2026
                  </Link>
                </li>
                <li className="mega-menu-link-item">
                  <Link
                    to="/productos?buscar=Espa%C3%B1a"
                    className="mega-menu-link"
                    onClick={handleMegaLinkClick}
                  >
                    España Local 2026
                  </Link>
                </li>
              </ul>
            </div>

            {/* Columna 2 — Clubes Chilenos */}
            <div className="mega-menu-col">
              <div className="mega-menu-col-header">
                <h4 className="mega-menu-col-title">Clubes Chilenos</h4>
              </div>
              <ul className="mega-menu-links">
                <li className="mega-menu-link-item">
                  <Link
                    to="/productos?buscar=Universidad+de+Chile"
                    className="mega-menu-link"
                    onClick={handleMegaLinkClick}
                  >
                    Universidad de Chile Local
                    <span className="mega-menu-link-badge">-20%</span>
                  </Link>
                </li>
                <li className="mega-menu-link-item">
                  <Link
                    to="/productos?buscar=Colo-Colo"
                    className="mega-menu-link"
                    onClick={handleMegaLinkClick}
                  >
                    Colo-Colo Local 2026
                    <span className="mega-menu-link-badge">-25%</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Columna 3 — Marcas Oficiales */}
            <div className="mega-menu-col">
              <div className="mega-menu-col-header">
                <h4 className="mega-menu-col-title">Marcas Oficiales</h4>
              </div>
              <ul className="mega-menu-links">
                <li className="mega-menu-link-item">
                  <Link
                    to="/productos?marca=Nike"
                    className="mega-menu-link"
                    onClick={handleMegaLinkClick}
                  >
                    Nike
                    <span className="mega-menu-link-badge is-brand">Oficial</span>
                  </Link>
                </li>
                <li className="mega-menu-link-item">
                  <Link
                    to="/productos?marca=Adidas"
                    className="mega-menu-link"
                    onClick={handleMegaLinkClick}
                  >
                    Adidas
                    <span className="mega-menu-link-badge is-brand">Oficial</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Columna 4 — Destacados y Promociones */}
            <div className="mega-menu-col">
              <div className="mega-menu-col-header">
                <h4 className="mega-menu-col-title">Destacados y Promociones</h4>
              </div>
              <ul className="mega-menu-links">
                <li className="mega-menu-link-item">
                  <Link
                    to="/ofertas"
                    className="mega-menu-link"
                    onClick={handleMegaLinkClick}
                  >
                    Liquidación hasta 25% OFF
                    <span className="mega-menu-link-badge">OFERTA</span>
                  </Link>
                </li>
                <li className="mega-menu-link-item">
                  <Link
                    to="/productos?buscar=2026"
                    className="mega-menu-link"
                    onClick={handleMegaLinkClick}
                  >
                    Colección 2026
                    <span className="mega-menu-link-badge is-accent">Nuevo</span>
                  </Link>
                </li>
                <li className="mega-menu-link-item">
                  <Link
                    to="/productos"
                    className="mega-menu-link"
                    onClick={handleMegaLinkClick}
                  >
                    Ver Catálogo Completo &rarr;
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 2. Barra de Anuncios Rotativa debajo del Header */}
      <PromoAnnouncementBar onNavigate={onNavigate} />
    </header>
  )
}

export default Navbar
