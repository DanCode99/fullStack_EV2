import { Button } from '../../atoms/Button/Button.jsx'

export function CartItem({
  item,
  index,
  onIncrement,
  onDecrement,
  onRemove
}) {
  const subtotal = item.precio * item.cantidad

  return (
    <div className="box mb-3">
      <div className="columns is-vcentered is-mobile is-multiline">
        <div className="column is-3-mobile is-2-tablet has-text-centered">
          <img
            src={item.img}
            alt={item.titulo}
            className="img-carrito"
            onError={(e) => {
              e.target.src = 'https://placehold.co/100x100?text=Item'
            }}
          />
        </div>

        <div className="column is-9-mobile is-4-tablet">
          <h3 className="has-text-weight-bold is-size-6">{item.titulo}</h3>
          {item.talla && (
            <p className="has-text-info has-text-weight-semibold is-size-7">
              Talla: {item.talla}
            </p>
          )}
          <p className="has-text-grey is-size-7">
            Precio unidad: ${Number(item.precio).toLocaleString('es-CL')}
          </p>
        </div>

        <div className="column is-6-mobile is-3-tablet has-text-centered">
          <div className="field has-addons is-justify-content-center">
            <p className="control">
              <Button
                variant="light"
                size="small"
                onClick={() => onDecrement(index)}
              >
                -
              </Button>
            </p>
            <p className="control">
              <input
                className="input is-small has-text-centered has-text-weight-bold w-42px"
                type="text"
                value={item.cantidad}
                readOnly
              />
            </p>
            <p className="control">
              <Button
                variant="light"
                size="small"
                onClick={() => onIncrement(index)}
              >
                +
              </Button>
            </p>
          </div>
        </div>

        <div className="column is-6-mobile is-3-tablet has-text-right-tablet has-text-centered-mobile">
          <p className="is-size-6 has-text-weight-bold mb-2">
            ${Number(subtotal).toLocaleString('es-CL')}
          </p>
          <Button
            variant="danger"
            size="small"
            onClick={() => onRemove(index)}
          >
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CartItem

