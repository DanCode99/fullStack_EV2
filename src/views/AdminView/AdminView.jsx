import { useState } from 'react'
import { FormField } from '../../components/molecules/FormField/FormField.jsx'
import { Input } from '../../components/atoms/Input/Input.jsx'
import { Button } from '../../components/atoms/Button/Button.jsx'
import { regionesYcomunas } from '../../data/regiones.js'

export function AdminView({
  products = [],
  users = [],
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
  loggedUser
}) {
  const [tab, setTab] = useState('dashboard') // 'dashboard', 'productos', 'usuarios'
  const [editingProduct, setEditingProduct] = useState(null)
  const [showProductModal, setShowProductModal] = useState(false)
  const [productForm, setProductForm] = useState({
    titulo: '',
    precio: '',
    descripcion: '',
    img: '',
    img2: '',
    stock: '',
    stockCritico: '',
    categoria: 'Selecciones Nacionales'
  })

  const [editingUser, setEditingUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [userForm, setUserForm] = useState({
    run: '',
    nombre: '',
    apellidos: '',
    correo: '',
    fechaNacimiento: '',
    tipoUsuario: 'Cliente',
    region: regionesYcomunas[0]?.region || '',
    comuna: regionesYcomunas[0]?.comunas[0] || '',
    direccion: '',
    password: '123456'
  })

  const isSeller = loggedUser && (loggedUser.tipoUsuario === 'Vendedor' || loggedUser.tipo === 'Vendedor')

  // Métricas
  const totalStock = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0)
  const totalCritical = products.filter(p => Number(p.stock) <= (Number(p.stockCritico) || 5)).length

  // Handlers Productos
  const handleOpenNewProduct = () => {
    setEditingProduct(null)
    setProductForm({
      titulo: '',
      precio: '',
      descripcion: '',
      img: '/assets/images/brasil/brasil1.jpeg',
      img2: '',
      stock: 10,
      stockCritico: 3,
      categoria: 'Selecciones Nacionales'
    })
    setShowProductModal(true)
  }

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod)
    setProductForm({ ...prod })
    setShowProductModal(true)
  }

  const handleSaveProduct = (e) => {
    e.preventDefault()
    const payload = {
      ...productForm,
      precio: Number(productForm.precio),
      stock: Number(productForm.stock),
      stockCritico: Number(productForm.stockCritico)
    }

    if (editingProduct) {
      onUpdateProduct(editingProduct.id, payload)
    } else {
      onCreateProduct(payload)
    }
    setShowProductModal(false)
  }

  // Handlers Usuarios
  const handleOpenNewUser = () => {
    setEditingUser(null)
    setUserForm({
      run: '',
      nombre: '',
      apellidos: '',
      correo: '',
      fechaNacimiento: '1995-01-01',
      tipoUsuario: 'Cliente',
      region: regionesYcomunas[0]?.region || '',
      comuna: regionesYcomunas[0]?.comunas[0] || '',
      direccion: '',
      password: '123456'
    })
    setShowUserModal(true)
  }

  const handleOpenEditUser = (u) => {
    setEditingUser(u)
    setUserForm({ ...u })
    setShowUserModal(true)
  }

  const handleSaveUser = (e) => {
    e.preventDefault()
    if (editingUser) {
      onUpdateUser(editingUser.run, userForm)
    } else {
      onCreateUser(userForm)
    }
    setShowUserModal(false)
  }

  return (
    <div className="p-4">
      {/* Botones de navegación interna */}
      <div className="tabs is-boxed mb-5">
        <ul>
          <li className={tab === 'dashboard' ? 'is-active' : ''}>
            <a onClick={() => setTab('dashboard')}>
              <span className="icon is-small">📊</span>
              <span>Dashboard</span>
            </a>
          </li>
          <li className={tab === 'productos' ? 'is-active' : ''}>
            <a onClick={() => setTab('productos')}>
              <span className="icon is-small">👕</span>
              <span>Gestión de Productos ({products.length})</span>
            </a>
          </li>
          {!isSeller && (
            <li className={tab === 'usuarios' ? 'is-active' : ''}>
              <a onClick={() => setTab('usuarios')}>
                <span className="icon is-small">👥</span>
                <span>Gestión de Usuarios ({users.length})</span>
              </a>
            </li>
          )}
        </ul>
      </div>

      {/* VISTA 1: DASHBOARD METRICAS (Figura 9 del PDF) */}
      {tab === 'dashboard' && (
        <div>
          <div className="columns is-multiline mb-5">
            <div className="column is-4">
              <div className="box has-background-info has-text-white p-5">
                <h3 className="is-size-6 has-text-weight-bold">PRODUCTOS EN CATÁLOGO</h3>
                <p className="is-size-2 has-text-weight-bold">{products.length}</p>
                <p className="is-size-7">Total de modelos registrados</p>
              </div>
            </div>

            <div className="column is-4">
              <div className="box has-background-primary has-text-white p-5">
                <h3 className="is-size-6 has-text-weight-bold">STOCK TOTAL EN BODEGA</h3>
                <p className="is-size-2 has-text-weight-bold">{totalStock}</p>
                <p className="is-size-7">Unidades totales disponibles</p>
              </div>
            </div>

            <div className="column is-4">
              <div className="box has-background-warning-dark has-text-white p-5">
                <h3 className="is-size-6 has-text-weight-bold">STOCK CRÍTICO</h3>
                <p className="is-size-2 has-text-weight-bold">{totalCritical}</p>
                <p className="is-size-7">Modelos que requieren reposición</p>
              </div>
            </div>
          </div>

          <div className="columns">
            <div className="column is-6">
              <div className="box">
                <h3 className="title is-5 mb-3">Modelos con Stock Crítico</h3>
                {totalCritical === 0 ? (
                  <p className="has-text-grey">Todos los productos cuentan con stock suficiente.</p>
                ) : (
                  <table className="table is-fullwidth is-striped is-narrow">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Stock Actual</th>
                        <th>Mínimo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products
                        .filter(p => Number(p.stock) <= (Number(p.stockCritico) || 5))
                        .map(p => (
                          <tr key={p.id}>
                            <td>{p.titulo}</td>
                            <td><span className="tag is-danger">{p.stock}</span></td>
                            <td>{p.stockCritico || 5}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="column is-6">
              <div className="box">
                <h3 className="title is-5 mb-3">Accesos Rápidos de Administración</h3>
                <div className="buttons">
                  <Button variant="primary" onClick={handleOpenNewProduct}>
                    + Registrar Nuevo Producto
                  </Button>
                  {!isSeller && (
                    <Button variant="info" onClick={handleOpenNewUser}>
                      + Registrar Nuevo Usuario
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 2: GESTION DE PRODUCTOS */}
      {tab === 'productos' && (
        <div className="box">
          <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
            <h2 className="title is-4 mb-0">Catálogo de Productos</h2>
            <Button variant="primary" size="small" onClick={handleOpenNewProduct}>
              + Nuevo Producto
            </Button>
          </div>

          <div className="table-container">
            <table className="table is-fullwidth is-striped is-hoverable">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Foto</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Categoría</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>
                      <img
                        src={p.img}
                        alt={p.titulo}
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    </td>
                    <td><strong>{p.titulo}</strong></td>
                    <td>${Number(p.precio).toLocaleString('es-CL')}</td>
                    <td><span className="tag is-light">{p.categoria}</span></td>
                    <td>
                      <span className={`tag ${Number(p.stock) <= (Number(p.stockCritico) || 5) ? 'is-danger' : 'is-success'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td>
                      <div className="buttons are-small">
                        <Button variant="info" onClick={() => handleOpenEditProduct(p)}>
                          Editar
                        </Button>
                        <Button variant="danger" onClick={() => onDeleteProduct(p.id)}>
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VISTA 3: GESTION DE USUARIOS */}
      {tab === 'usuarios' && !isSeller && (
        <div className="box">
          <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
            <h2 className="title is-4 mb-0">Listado de Usuarios</h2>
            <Button variant="primary" size="small" onClick={handleOpenNewUser}>
              + Nuevo Usuario
            </Button>
          </div>

          <div className="table-container">
            <table className="table is-fullwidth is-striped is-hoverable">
              <thead>
                <tr>
                  <th>RUN</th>
                  <th>Nombre y Apellidos</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Región / Comuna</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.run}>
                    <td><code>{u.run}</code></td>
                    <td>{u.nombre} {u.apellidos}</td>
                    <td>{u.correo}</td>
                    <td>
                      <span className={`tag ${u.tipoUsuario === 'Administrador' ? 'is-danger' : u.tipoUsuario === 'Vendedor' ? 'is-warning' : 'is-info'}`}>
                        {u.tipoUsuario}
                      </span>
                    </td>
                    <td>{u.comuna}, {u.region}</td>
                    <td>
                      <div className="buttons are-small">
                        <Button variant="info" onClick={() => handleOpenEditUser(u)}>
                          Editar
                        </Button>
                        <Button variant="danger" onClick={() => onDeleteUser(u.run)}>
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL PRODUCTO (CREAR / EDITAR) */}
      {showProductModal && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setShowProductModal(false)}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">
                {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
              </p>
              <button className="delete" aria-label="close" onClick={() => setShowProductModal(false)}></button>
            </header>
            <form onSubmit={handleSaveProduct}>
              <section className="modal-card-body">
                <FormField label="Título del Producto">
                  <Input
                    value={productForm.titulo}
                    onChange={(e) => setProductForm({ ...productForm, titulo: e.target.value })}
                    required
                  />
                </FormField>

                <div className="columns">
                  <div className="column is-6">
                    <FormField label="Precio ($ CLP)">
                      <Input
                        type="number"
                        value={productForm.precio}
                        onChange={(e) => setProductForm({ ...productForm, precio: e.target.value })}
                        required
                      />
                    </FormField>
                  </div>
                  <div className="column is-6">
                    <div className="field">
                      <label className="label">Categoría</label>
                      <div className="control">
                        <div className="select is-fullwidth">
                          <select
                            value={productForm.categoria}
                            onChange={(e) => setProductForm({ ...productForm, categoria: e.target.value })}
                          >
                            <option value="Selecciones Nacionales">Selecciones Nacionales</option>
                            <option value="Clubes Chilenos">Clubes Chilenos</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="columns">
                  <div className="column is-6">
                    <FormField label="Stock">
                      <Input
                        type="number"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                        required
                      />
                    </FormField>
                  </div>
                  <div className="column is-6">
                    <FormField label="Stock Crítico">
                      <Input
                        type="number"
                        value={productForm.stockCritico}
                        onChange={(e) => setProductForm({ ...productForm, stockCritico: e.target.value })}
                        required
                      />
                    </FormField>
                  </div>
                </div>

                <FormField label="Ruta de la Imagen Principal">
                  <Input
                    value={productForm.img}
                    onChange={(e) => setProductForm({ ...productForm, img: e.target.value })}
                    placeholder="/assets/images/brasil/brasil1.jpeg"
                    required
                  />
                </FormField>

                <FormField label="Descripción">
                  <textarea
                    className="textarea"
                    value={productForm.descripcion}
                    onChange={(e) => setProductForm({ ...productForm, descripcion: e.target.value })}
                    required
                  />
                </FormField>
              </section>
              <footer className="modal-card-foot">
                <Button type="submit" variant="primary">Guardar</Button>
                <Button variant="light" onClick={() => setShowProductModal(false)}>Cancelar</Button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* MODAL USUARIO (CREAR / EDITAR) */}
      {showUserModal && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setShowUserModal(false)}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">
                {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
              </p>
              <button className="delete" aria-label="close" onClick={() => setShowUserModal(false)}></button>
            </header>
            <form onSubmit={handleSaveUser}>
              <section className="modal-card-body">
                <FormField label="RUN">
                  <Input
                    value={userForm.run}
                    onChange={(e) => setUserForm({ ...userForm, run: e.target.value })}
                    readOnly={!!editingUser}
                    required
                  />
                </FormField>

                <div className="columns">
                  <div className="column is-6">
                    <FormField label="Nombre">
                      <Input
                        value={userForm.nombre}
                        onChange={(e) => setUserForm({ ...userForm, nombre: e.target.value })}
                        required
                      />
                    </FormField>
                  </div>
                  <div className="column is-6">
                    <FormField label="Apellidos">
                      <Input
                        value={userForm.apellidos}
                        onChange={(e) => setUserForm({ ...userForm, apellidos: e.target.value })}
                        required
                      />
                    </FormField>
                  </div>
                </div>

                <div className="columns">
                  <div className="column is-6">
                    <FormField label="Correo">
                      <Input
                        type="email"
                        value={userForm.correo}
                        onChange={(e) => setUserForm({ ...userForm, correo: e.target.value })}
                        required
                      />
                    </FormField>
                  </div>
                  <div className="column is-6">
                    <div className="field">
                      <label className="label">Tipo de Usuario</label>
                      <div className="control">
                        <div className="select is-fullwidth">
                          <select
                            value={userForm.tipoUsuario}
                            onChange={(e) => setUserForm({ ...userForm, tipoUsuario: e.target.value })}
                          >
                            <option value="Cliente">Cliente</option>
                            <option value="Vendedor">Vendedor</option>
                            <option value="Administrador">Administrador</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <FormField label="Dirección">
                  <Input
                    value={userForm.direccion}
                    onChange={(e) => setUserForm({ ...userForm, direccion: e.target.value })}
                    required
                  />
                </FormField>
              </section>
              <footer className="modal-card-foot">
                <Button type="submit" variant="primary">Guardar</Button>
                <Button variant="light" onClick={() => setShowUserModal(false)}>Cancelar</Button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
