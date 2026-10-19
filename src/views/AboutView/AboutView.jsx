
export function AboutView() {
  return (
    <div className="section min-vh-70">
      <div className="container container-max-900">
        <div className="has-text-centered mb-6">
          <h1 className="title is-2">Nuestra Historia y Pasión</h1>
          <p className="subtitle is-6 has-text-grey">
            Más de 10 años vistiendo a los fanáticos del fútbol en todo Chile.
          </p>
        </div>

        <div className="box p-5 mb-5">
          <div className="columns is-vcentered">
            <div className="column is-7">
              <h2 className="title is-4 mb-3">La casa de la camiseta futbolera</h2>
              <p className="has-text-grey-dark mb-4 line-height-1-8">
                Nacimos como un proyecto apasionado entre amigos y coleccionistas que buscaban democratizar el acceso a camisetas originales, tanto históricas como contemporáneas. Desde ediciones conmemorativas de selecciones mundiales hasta las equipaciones oficiales del fútbol nacional.
              </p>
              <p className="has-text-grey-dark line-height-1-8">
                Nos enorgullece certificar la calidad de cada una de nuestras piezas y garantizar despachos rápidos y seguros a todas las regiones de Chile.
              </p>
            </div>
            <div className="column is-5 has-text-centered">
              <img
                src="/assets/images/logo/logo.png"
                alt="Logo"
                className="img-max-h-200"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>
          </div>
        </div>

        <div className="columns">
          <div className="column is-4">
            <div className="box has-text-centered h-100 p-5">
              <h3 className="title is-5 mb-2">100% Oficiales</h3>
              <p className="is-size-7 has-text-grey">
                Trabajamos con indumentaria oficial y licencias autorizadas de cada institución deportiva.
              </p>
            </div>
          </div>
          <div className="column is-4">
            <div className="box has-text-centered h-100 p-5">
              <h3 className="title is-5 mb-2">Envíos Rápidos</h3>
              <p className="is-size-7 has-text-grey">
                Despachamos de Arica a Punta Arenas con seguimiento en línea de tu paquete.
              </p>
            </div>
          </div>
          <div className="column is-4">
            <div className="box has-text-centered h-100 p-5">
              <h3 className="title is-5 mb-2">Compra Segura</h3>
              <p className="is-size-7 has-text-grey">
                Protección al consumidor y múltiples medios de pago verificados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
