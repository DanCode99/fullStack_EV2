import { useState } from 'react'
import { Button } from '../../components/atoms/Button/Button.jsx'
import { Badge } from '../../components/atoms/Badge/Badge.jsx'

export function ProductDetailView({
  product,
  onAddToCart,
  onBack
}) {
  const [selectedImage, setSelectedImage] = useState(product ? product.img : '')
  const [selectedSize, setSelectedSize] = useState('M')
  const [quantity, setQuantity] = useState(1)
  const [feedback, setFeedback] = useState('')

  if (!product) {
    return (
      <div className="section">
        <div className="container has-text-centered py-6">
          <p className="is-size-5 mb-4">No se ha seleccionado ningún producto.</p>
          <Button variant="dark" onClick={onBack}>Volver a la tienda</Button>
        </div>
      </div>
    )
  }

  const images = [product.img, product.img2].filter(Boolean)
  const sizes = ['S', 'M', 'L', 'XL']
  const isOutOfStock = product.stock <= 0

  const handleAdd = () => {
    if (quantity > product.stock) {
      setFeedback('La cantidad solicitada supera el stock disponible.')
      return
    }
    onAddToCart({ ...product, talla: selectedSize }, quantity)
    setFeedback('¡Camiseta agregada exitosamente al carrito!')
    setTimeout(() => setFeedback(''), 3000)
  }

  return (
    <div className="section">
      <div className="container">
        <Button
          variant="light"
          size="small"
          className="mb-4"
          onClick={onBack}
        >
          &larr; Volver
        </Button>

        <div className="columns is-variable is-8">
          {/* Galería interactiva con miniaturas */}
          <div className="column is-12-mobile is-6-tablet">
            <div className="galeria-contenedor">
              {images.length > 1 && (
                <div className="galeria-miniaturas">
                  {images.map((imgSrc, idx) => (
                    <div
                      key={idx}
                      className={`miniatura-item ${selectedImage === imgSrc ? 'activa' : ''}`}
                      onClick={() => setSelectedImage(imgSrc)}
                    >
                      <img src={imgSrc} alt={`Vista ${idx + 1}`} />
                    </div>
                  ))}
                </div>
              )}

              <div className="galeria-principal">
                <img
                  src={selectedImage || product.img}
                  alt={product.titulo}
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/500x500?text=Camiseta'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Información y compra */}
          <div className="column is-12-mobile is-6-tablet">
            <div className="mb-2">
              <span className="tag is-info is-light mr-2">{product.categoria}</span>
              {product.stock <= 0 ? (
                <Badge variant="danger">Sin Stock</Badge>
              ) : (
                <Badge variant="success">Stock disponible: {product.stock}</Badge>
              )}
            </div>

            <h1 className="title is-2 mb-3">{product.titulo}</h1>
            <p className="subtitle is-3 has-text-primary has-text-weight-bold mb-4">
              ${Number(product.precio).toLocaleString('es-CL')}
            </p>

            <p className="has-text-grey-dark mb-5" style={{ lineHeight: '1.7' }}>
              {product.descripcion}
            </p>

            <div className="mb-4">
              <label className="label is-small">Seleccionar Talla:</label>
              <div className="buttons">
                {sizes.map((sz) => (
                  <Button
                    key={sz}
                    variant={selectedSize === sz ? 'dark' : 'light'}
                    size="small"
                    onClick={() => setSelectedSize(sz)}
                  >
                    {sz}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="label is-small">Cantidad:</label>
              <div className="field has-addons">
                <p className="control">
                  <Button
                    variant="light"
                    size="small"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  >
                    -
                  </Button>
                </p>
                <p className="control">
                  <input
                    className="input is-small has-text-centered has-text-weight-bold w-42px"
                    type="text"
                    value={quantity}
                    readOnly
                  />
                </p>
                <p className="control">
                  <Button
                    variant="light"
                    size="small"
                    disabled={quantity >= product.stock}
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  >
                    +
                  </Button>
                </p>
              </div>
            </div>

            {feedback && (
              <div className="notification is-success is-light p-3 mb-4">
                {feedback}
              </div>
            )}

            <Button
              variant="primary"
              size="medium"
              className="is-fullwidth mb-3"
              disabled={isOutOfStock}
              onClick={handleAdd}
            >
              {isOutOfStock ? 'Producto Agotado' : 'Agregar al Carrito'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
