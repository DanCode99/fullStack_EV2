import { useState, useMemo } from 'react'
import { FormField } from '../../components/molecules/FormField/FormField.jsx'
import { Input } from '../../components/atoms/Input/Input.jsx'
import { Button } from '../../components/atoms/Button/Button.jsx'
import { MetricCard } from '../../components/molecules/MetricCard/MetricCard.jsx'
import { OrdersTable } from '../../components/organisms/OrdersTable/OrdersTable.jsx'
import { ReceiptModal } from '../../components/organisms/ReceiptModal/ReceiptModal.jsx'
import { ReportsPanel } from '../../components/organisms/ReportsPanel/ReportsPanel.jsx'
import { regionesYcomunas } from '../../data/regiones.js'

export function AdminView({
  products = [],
  users = [],
  orders = [],
  currentTab = 'dashboard',
  onSelectTab,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
  loggedUser
}) {
  // Estado interno sincronizado con prop opcional
  const [internalTab, setInternalTab] = useState('dashboard')
  const activeTab = currentTab || internalTab

  const handleTabChange = (newTab) => {
    setInternalTab(newTab)
    if (typeof onSelectTab === 'function') {
      onSelectTab(newTab)
    }
  }

  // Estado para el modal de Detalle de Boleta
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState(null)
  const [showReceiptModal, setShowReceiptModal] = useState(false)

  // Filtro de usuario para la vista de Órdenes
  const [selectedUserForOrders, setSelectedUserForOrders] = useState(null)

  // Estados para CRUD de Productos
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

  // Estados para CRUD de Usuarios
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

  // Métricas generales
  const totalStock = useMemo(() => products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0), [products])
  const totalCritical = useMemo(() => products.filter(p => Number(p.stock) <= (Number(p.stockCritico) || 5)).length, [products])
  const totalVentas = useMemo(() => orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0), [orders])

  // Enriquecer orden con datos del cliente para la Boleta
  const handleOpenReceipt = (order) => {
    let enriched = { ...order }
    if (!enriched.customer || !enriched.customer.nombre) {
      const found = users.find(u => String(u.run) === String(order.userRun))
      if (found) {
        enriched.customer = {
          nombre: found.nombre,
          apellidos: found.apellidos,
          correo: found.correo,
          direccion: found.direccion,
          comuna: found.comuna,
          region: found.region
        }
      }
    }
    setSelectedOrderForReceipt(enriched)
    setShowReceiptModal(true)
  }

  // Handlers CRUD Productos
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

  // Handlers CRUD Usuarios
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
    <div className="admin-view-wrapper">
      {/* Botones de navegación interna (Tabs horizontales) */}
      <div className="tabs is-boxed mb-5">
        <ul>
          <li className={activeTab === 'dashboard' ? 'is-active' : ''}>
            <a onClick={() => handleTabChange('dashboard')} id="tab-btn-dashboard">
              <span className="icon is-small">📊</span>
              <span>Dashboard</span>
            </a>
          </li>
          <li className={activeTab === 'ordenes' ? 'is-active' : ''}>
            <a onClick={() => { setSelectedUserForOrders(null); handleTabChange('ordenes'); }} id="tab-btn-ordenes">
              <span className="icon is-small">🧾</span>
              <span>Órdenes / Boletas ({orders.length})</span>
            </a>
          </li>
          <li className={activeTab === 'productos' ? 'is-active' : ''}>
            <a onClick={() => handleTabChange('productos')} id="tab-btn-productos">
              <span className="icon is-small">👕</span>
              <span>Productos ({products.length})</span>
            </a>
          </li>
          {!isSeller && (
            <li className={activeTab === 'usuarios' ? 'is-active' : ''}>
              <a onClick={() => handleTabChange('usuarios')} id="tab-btn-usuarios">
                <span className="icon is-small">👥</span>
                <span>Usuarios ({users.length})</span>
              </a>
            </li>
          )}
          <li className={activeTab === 'reportes' ? 'is-active' : ''}>
            <a onClick={() => handleTabChange('reportes')} id="tab-btn-reportes">
              <span className="icon is-small">📈</span>
              <span>Reportes y Métricas</span>
            </a>
          </li>
        </ul>
      </div>

      {/* Alerta de Inventario Crítico si existe */}
      {totalCritical > 0 && activeTab !== 'reportes' && (
        <div className="notification is-danger is-light mb-5" style={{ borderRadius: '8px' }}>
          <div className="is-flex is-align-items-center">
            <span className="is-size-3 mr-3">⚠️</span>
            <div>
              <p className="has-text-weight-bold is-size-6 mb-1">
                ¡Alerta de Inventario Crítico en Bodega!
              </p>
              <p className="is-size-7 mb-0">
                Hay <strong>{totalCritical} modelos</strong> con stock igual o inferior a su umbral mínimo. Revisa la sección de productos para reposición.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          1. TAB DASHBOARD
          ======================================================== */}
      {activeTab === 'dashboard' && (
        <div>
          {/* Header Dashboard */}
          <div className="mb-5">
            <h1 className="title is-3 mb-1 has-text-weight-bold">
              Panel Principal de Control
            </h1>
            <p className="subtitle is-6 has-text-grey">
              Resumen ejecutivo del estado del negocio, inventario y ventas.
            </p>
          </div>

          {/* Tarjetas Métricas Principales */}
          <div className="columns is-multiline mb-5">
            <div className="column is-3-desktop is-6-tablet">
              <MetricCard
                title="Ventas Totales"
                value={`$${totalVentas.toLocaleString('es-CL')}`}
                subtitle={`${orders.length} compras concretadas`}
                icon="💰"
                variant="primary"
                onClick={() => handleTabChange('reportes')}
              />
            </div>
            <div className="column is-3-desktop is-6-tablet">
              <MetricCard
                title="Órdenes Emitidas"
                value={orders.length}
                subtitle="Ver historial y boletas"
                icon="🧾"
                variant="info"
                onClick={() => handleTabChange('ordenes')}
              />
            </div>
            <div className="column is-3-desktop is-6-tablet">
              <MetricCard
                title="Modelos en Catálogo"
                value={products.length}
                subtitle={`${totalStock} unidades en stock`}
                icon="👕"
                variant="success"
                onClick={() => handleTabChange('productos')}
              />
            </div>
            <div className="column is-3-desktop is-6-tablet">
              <MetricCard
                title="Stock Crítico"
                value={totalCritical}
                subtitle="Modelos bajo el mínimo"
                icon="⚠️"
                variant="danger"
                onClick={() => handleTabChange('productos')}
              />
            </div>
          </div>

          {/* Accesos Directos a Módulos (Propuesta Figura 9 del documento) */}
          <div className="box p-5 mb-5" style={{ borderRadius: '12px' }}>
            <h3 className="title is-5 mb-3 has-text-weight-bold">
              ⚡ Accesos Rápidos a Módulos del Sistema
            </h3>
            <div className="columns is-multiline">
              <div className="column is-3-desktop is-6-tablet">
                <div
                  className="box has-background-white-bis p-4 has-text-centered is-clickable"
                  onClick={() => handleTabChange('ordenes')}
                  style={{ border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}
                >
                  <span className="is-size-2 mb-2 is-block">🧾</span>
                  <p className="has-text-weight-bold is-size-6 mb-1">Órdenes / Boletas</p>
                  <p className="is-size-7 has-text-grey mb-0">Revisar compras y emitir comprobantes</p>
                </div>
              </div>

              <div className="column is-3-desktop is-6-tablet">
                <div
                  className="box has-background-white-bis p-4 has-text-centered is-clickable"
                  onClick={() => handleTabChange('reportes')}
                  style={{ border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}
                >
                  <span className="is-size-2 mb-2 is-block">📈</span>
                  <p className="has-text-weight-bold is-size-6 mb-1">Reportes y Estadísticas</p>
                  <p className="is-size-7 has-text-grey mb-0">Métricas comerciales y productos top</p>
                </div>
              </div>

              <div className="column is-3-desktop is-6-tablet">
                <div
                  className="box has-background-white-bis p-4 has-text-centered is-clickable"
                  onClick={() => handleTabChange('productos')}
                  style={{ border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}
                >
                  <span className="is-size-2 mb-2 is-block">👕</span>
                  <p className="has-text-weight-bold is-size-6 mb-1">Catálogo de Productos</p>
                  <p className="is-size-7 has-text-grey mb-0">Agregar modelos, stock y precios</p>
                </div>
              </div>

              {!isSeller && (
                <div className="column is-3-desktop is-6-tablet">
                  <div
                    className="box has-background-white-bis p-4 has-text-centered is-clickable"
                    onClick={() => handleTabChange('usuarios')}
                    style={{ border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    <span className="is-size-2 mb-2 is-block">👥</span>
                    <p className="has-text-weight-bold is-size-6 mb-1">Gestión de Usuarios</p>
                    <p className="is-size-7 has-text-grey mb-0">Cuentas, roles e historial de cliente</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modelos Críticos y Acciones Rápidas */}
          <div className="columns">
            <div className="column is-7">
              <div className="box p-5" style={{ borderRadius: '12px' }}>
                <h3 className="title is-5 mb-3 has-text-weight-bold">
                  📦 Modelos con Stock Crítico
                </h3>
                {totalCritical === 0 ? (
                  <p className="has-text-grey is-size-6">
                    ✅ Todos los productos cuentan con inventario por sobre el umbral mínimo.
                  </p>
                ) : (
                  <div className="table-container">
                    <table className="table is-fullwidth is-striped is-narrow is-vcentered">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Categoría</th>
                          <th className="has-text-centered">Stock Actual</th>
                          <th className="has-text-centered">Mínimo</th>
                          <th className="has-text-right">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products
                          .filter(p => Number(p.stock) <= (Number(p.stockCritico) || 5))
                          .map(p => (
                            <tr key={p.id}>
                              <td><strong>{p.titulo}</strong></td>
                              <td><span className="tag is-light is-size-7">{p.categoria}</span></td>
                              <td className="has-text-centered">
                                <span className="tag is-danger has-text-weight-bold">{p.stock}</span>
                              </td>
                              <td className="has-text-centered">{p.stockCritico || 5}</td>
                              <td className="has-text-right">
                                <Button
                                  variant="info"
                                  size="small"
                                  onClick={() => handleOpenEditProduct(p)}
                                >
                                  Editar Stock
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="column is-5">
              <div className="box p-5" style={{ borderRadius: '12px' }}>
                <h3 className="title is-5 mb-3 has-text-weight-bold">
                  🚀 Acciones Operativas
                </h3>
                <p className="is-size-7 has-text-grey mb-4">
                  Crea nuevos registros directos para nutrir la tienda y los usuarios autorizados.
                </p>
                <div className="buttons">
                  <Button variant="primary" onClick={handleOpenNewProduct} id="btn-dashboard-new-product">
                    + Registrar Nuevo Producto
                  </Button>
                  {!isSeller && (
                    <Button variant="info" onClick={handleOpenNewUser} id="btn-dashboard-new-user">
                      + Registrar Nuevo Usuario
                    </Button>
                  )}
                  <Button variant="light" onClick={() => handleTabChange('ordenes')} id="btn-dashboard-go-orders">
                    🧾 Ver Historial de Órdenes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          2. TAB ÓRDENES / HISTORIAL DE COMPRAS (Componente Requerido)
          ======================================================== */}
      {activeTab === 'ordenes' && (
        <OrdersTable
          orders={orders}
          onViewReceipt={handleOpenReceipt}
          selectedUserFilter={selectedUserForOrders}
          onClearUserFilter={() => setSelectedUserForOrders(null)}
        />
      )}

      {/* ========================================================
          3. TAB PRODUCTOS (CRUD)
          ======================================================== */}
      {activeTab === 'productos' && (
        <div className="box p-5" style={{ borderRadius: '12px' }}>
          <div className="is-flex is-justify-content-space-between is-align-items-center mb-4 is-flex-wrap-wrap gap-2">
            <div>
              <h2 className="title is-4 mb-1 has-text-weight-bold">Catálogo de Productos</h2>
              <p className="subtitle is-6 has-text-grey mb-0">Gestión de inventario, precios y stock crítico.</p>
            </div>
            <Button variant="primary" size="small" onClick={handleOpenNewProduct} id="btn-new-product">
              + Nuevo Producto
            </Button>
          </div>

          <div className="table-container">
            <table className="table is-fullwidth is-striped is-hoverable is-vcentered">
              <thead>
                <tr className="has-background-light">
                  <th>ID</th>
                  <th>Foto</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Categoría</th>
                  <th className="has-text-centered">Stock</th>
                  <th className="has-text-centered">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td><code>{p.id}</code></td>
                    <td>
                      <img
                        src={p.img}
                        alt={p.titulo}
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                        onError={(e) => { e.target.src = '/assets/images/brasil/brasil1.jpeg' }}
                      />
                    </td>
                    <td><strong>{p.titulo}</strong></td>
                    <td className="has-text-weight-semibold">${Number(p.precio).toLocaleString('es-CL')}</td>
                    <td><span className="tag is-light">{p.categoria}</span></td>
                    <td className="has-text-centered">
                      <span className={`tag has-text-weight-bold ${Number(p.stock) <= (Number(p.stockCritico) || 5) ? 'is-danger' : 'is-success'}`}>
                        {p.stock} {Number(p.stock) <= (Number(p.stockCritico) || 5) ? '⚠️' : ''}
                      </span>
                    </td>
                    <td className="has-text-centered">
                      <div className="buttons are-small is-centered">
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

      {/* ========================================================
          4. TAB USUARIOS (CRUD)
          ======================================================== */}
      {activeTab === 'usuarios' && !isSeller && (
        <div className="box p-5" style={{ borderRadius: '12px' }}>
          <div className="is-flex is-justify-content-space-between is-align-items-center mb-4 is-flex-wrap-wrap gap-2">
            <div>
              <h2 className="title is-4 mb-1 has-text-weight-bold">Listado de Usuarios</h2>
              <p className="subtitle is-6 has-text-grey mb-0">Gestión de cuentas de clientes, vendedores y administradores.</p>
            </div>
            <Button variant="primary" size="small" onClick={handleOpenNewUser} id="btn-new-user">
              + Nuevo Usuario
            </Button>
          </div>

          <div className="table-container">
            <table className="table is-fullwidth is-striped is-hoverable is-vcentered">
              <thead>
                <tr className="has-background-light">
                  <th>RUN</th>
                  <th>Nombre y Apellidos</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Comuna / Región</th>
                  <th className="has-text-centered">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.run}>
                    <td><code>{u.run}</code></td>
                    <td><strong>{u.nombre} {u.apellidos}</strong></td>
                    <td>{u.correo}</td>
                    <td>
                      <span className={`tag has-text-weight-semibold ${u.tipoUsuario === 'Administrador' ? 'is-danger' : u.tipoUsuario === 'Vendedor' ? 'is-warning' : 'is-info is-light'}`}>
                        {u.tipoUsuario}
                      </span>
                    </td>
                    <td className="is-size-7">{u.comuna}, {u.region}</td>
                    <td className="has-text-centered">
                      <div className="buttons are-small is-centered">
                        {u.tipoUsuario === 'Cliente' && (
                          <Button
                            variant="primary"
                            onClick={() => {
                              setSelectedUserForOrders(u)
                              handleTabChange('ordenes')
                            }}
                          >
                            🧾 Ver Compras
                          </Button>
                        )}
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

      {/* ========================================================
          5. TAB REPORTES Y MÉTRICAS (Componente Requerido)
          ======================================================== */}
      {activeTab === 'reportes' && (
        <ReportsPanel
          orders={orders}
          products={products}
          users={users}
        />
      )}

      {/* ========================================================
          MODAL DETALLE DE BOLETA (Componente Requerido)
          ======================================================== */}
      <ReceiptModal
        isOpen={showReceiptModal}
        order={selectedOrderForReceipt}
        onClose={() => {
          setShowReceiptModal(false)
          setSelectedOrderForReceipt(null)
        }}
      />

      {/* ========================================================
          MODAL CREAR / EDITAR PRODUCTO
          ======================================================== */}
      {showProductModal && (
        <div className="modal is-active" id="product-modal">
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

      {/* ========================================================
          MODAL CREAR / EDITAR USUARIO
          ======================================================== */}
      {showUserModal && (
        <div className="modal is-active" id="user-modal">
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
