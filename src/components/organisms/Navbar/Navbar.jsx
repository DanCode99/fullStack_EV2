import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  const [authMenuOpen, setAuthMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.retail-auth-dropdown')) {
        setAuthMenuOpen(false)
      }
    }
    if (authMenuOpen) {
      document.addEventListener('click', handleOutsideClick)
    }
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [authMenuOpen])

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
                <div className="retail-header-bar">
                  {/* 1. Hola, Inicia sesión / Hola, [Nombre] */}
                  <div className="retail-auth-dropdown">
                    <button
                      type="button"
                      className="retail-btn-auth"
                      onClick={() => setAuthMenuOpen(prev => !prev)}
                      aria-haspopup="true"
                      aria-expanded={authMenuOpen}
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <span>
                        {loggedUser ? `Hola, ${loggedUser.nombre || loggedUser.correo}` : 'Hola, Inicia sesión'}
                      </span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>

                    <div className={`retail-auth-menu ${authMenuOpen ? 'is-active' : ''}`}>
                      {loggedUser ? (
                        <>
                          <div className="px-3 py-2 border-bottom has-text-grey is-size-7">
                            Conectado como <strong>{loggedUser.nombre || loggedUser.correo}</strong>
                          </div>
                          {isAdminOrSeller && (
                            <button
                              type="button"
                              className="retail-auth-menu-item"
                              onClick={() => {
                                setAuthMenuOpen(false)
                                handleNav('admin')
                              }}
                            >
                              Panel de Administración
                            </button>
                          )}
                          <button
                            type="button"
                            className="retail-auth-menu-item is-logout"
                            onClick={() => {
                              setAuthMenuOpen(false)
                              if (onLogout) onLogout()
                            }}
                          >
                            Cerrar Sesión
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="retail-auth-menu-item"
                            onClick={() => {
                              setAuthMenuOpen(false)
                              handleNav('login')
                            }}
                          >
                            Iniciar Sesión
                          </button>
                          <button
                            type="button"
                            className="retail-auth-menu-item"
                            onClick={() => {
                              setAuthMenuOpen(false)
                              handleNav('registro')
                            }}
                          >
                            Registro
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Separador vertical | */}
                  <span className="retail-divider" aria-hidden="true"></span>

                  {/* 2. Mi cuenta */}
                  <button
                    type="button"
                    className="retail-account-link"
                    onClick={() => {
                      if (!loggedUser) {
                        handleNav('login')
                      } else if (isAdminOrSeller) {
                        handleNav('admin')
                      } else {
                        handleNav('home')
                      }
                    }}
                  >
                    Mi cuenta
                  </button>

                  {/* Separador vertical | */}
                  <span className="retail-divider" aria-hidden="true"></span>

                  {/* 3. Icono de Corazón (Favoritos) */}
                  <button
                    type="button"
                    className="retail-icon-btn"
                    title="Mis Favoritos"
                    aria-label="Favoritos"
                    onClick={() => {
                      if (!loggedUser) {
                        handleNav('login')
                      } else {
                        handleNav('productos')
                      }
                    }}
                  >
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>

                  {/* Separador vertical | */}
                  <span className="retail-divider" aria-hidden="true"></span>

                  {/* 4. Icono de Carrito con contador circular */}
                  <button
                    type="button"
                    className="retail-cart-btn"
                    title="Abrir Carrito"
                    aria-label={`Carrito con ${cartCount} productos`}
                    onClick={() => {
                      if (onOpenCart) {
                        onOpenCart()
                      } else {
                        handleNav('carrito')
                      }
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    <span>Carrito ({cartCount})</span>
                    <span className="retail-cart-badge">{cartCount}</span>
                  </button>
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
