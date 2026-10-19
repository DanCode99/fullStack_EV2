
export function Footer({ onNavigate }) {
  const handleNav = (view) => {
    if (onNavigate) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      onNavigate(view)
    }
  }

  return (
    <footer className="has-background-dark custom-footer">
      <div className="container">
        <div className="columns is-multiline mb-5">
          <div className="column is-3">
            <h6 className="title is-6 has-text-weight-bold has-text-white mb-4">Nuestra Tienda</h6>
            <ul className="footer-list">
              <li>
                <a
                  className="has-text-grey-light footer-link cursor-pointer"
                  onClick={() => handleNav('home')}
                >
                  Inicio
                </a>
              </li>
              <li>
                <a
                  className="has-text-grey-light footer-link cursor-pointer"
                  onClick={() => handleNav('productos')}
                >
                  Catálogo
                </a>
              </li>
              <li>
                <a
                  className="has-text-grey-light footer-link cursor-pointer"
                  onClick={() => handleNav('carrito')}
                >
                  Carrito de Compras
                </a>
              </li>
              <li>
                <a
                  className="has-text-grey-light footer-link cursor-pointer"
                  onClick={() => handleNav('blog')}
                >
                  Blog / Historias
                </a>
              </li>
            </ul>
          </div>

          <div className="column is-3">
            <h6 className="title is-6 has-text-weight-bold has-text-white mb-4">Mi Cuenta</h6>
            <ul className="footer-list">
              <li>
                <a
                  className="has-text-grey-light footer-link cursor-pointer"
                  onClick={() => handleNav('login')}
                >
                  Iniciar Sesión
                </a>
              </li>
              <li>
                <a
                  className="has-text-grey-light footer-link cursor-pointer"
                  onClick={() => handleNav('registro')}
                >
                  Crear Cuenta
                </a>
              </li>
            </ul>
          </div>

          <div className="column is-3">
            <h6 className="title is-6 has-text-weight-bold has-text-white mb-4">Acerca de</h6>
            <ul className="footer-list">
              <li>
                <a
                  className="has-text-grey-light footer-link cursor-pointer"
                  onClick={() => handleNav('nosotros')}
                >
                  Nosotros
                </a>
              </li>
              <li>
                <a
                  className="has-text-grey-light footer-link cursor-pointer"
                  onClick={() => handleNav('contacto')}
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          <div className="column is-3 has-text-right-tablet">
            <div className="is-flex is-justify-content-flex-end-tablet is-align-items-center mb-4 footer-socials">
              <span className="has-background-grey-dark has-text-white is-flex is-justify-content-center is-align-items-center footer-social-link">X</span>
              <span className="has-background-grey-dark has-text-white is-flex is-justify-content-center is-align-items-center footer-social-link">f</span>
              <span className="has-background-grey-dark has-text-white is-flex is-justify-content-center is-align-items-center footer-social-link footer-social-link-small">YT</span>
              <span className="has-background-grey-dark has-text-white is-flex is-justify-content-center is-align-items-center footer-social-link footer-social-link-small">IG</span>
              <span className="has-text-weight-bold ml-4 has-text-white is-flex is-align-items-center">
                <span className="mr-2 is-size-5">🇨🇱</span> Chile
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 footer-bottom">
          <p className="has-text-grey-light is-size-7">
            &copy; 2026 Fútbol Store - Proyecto de Evaluación Frontend con React y Bulma.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

