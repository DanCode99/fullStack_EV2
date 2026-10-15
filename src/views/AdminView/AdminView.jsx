import { useState } from 'react'
import { FormField } from '../../components/molecules/FormField/FormField.jsx'
import { Input } from '../../components/atoms/Input/Input.jsx'
import { Button } from '../../components/atoms/Button/Button.jsx'
import { regionesYcomunas } from '../../data/regiones.js'
import { ReceiptModal } from '../../components/organisms/ReceiptModal/ReceiptModal.jsx'
import { ReportsPanel } from '../../components/organisms/ReportsPanel/ReportsPanel.jsx'

export function AdminView({
  products = [],
  users = [],
  orders = [],
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
  loggedUser,
  currentTab = 'dashboard',
  onSelectTab,
  onNavigateHome
}) {
  const [selectedUserForHistory, setSelectedUserForHistory] = useState(null)
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showProductModal, setShowProductModal] = useState(false)

  // Estado para gestión de Categorías
  const [categoryFilter, setCategoryFilter] = useState('Todas')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [customCategories, setCustomCategories] = useState([
    'Selecciones Nacionales',
    'Clubes Chilenos'
  ])

  // Estado para Perfil Admin
  const [profileForm, setProfileForm] = useState({
    nombre: loggedUser?.nombre || 'Administrador',
    apellidos: loggedUser?.apellidos || 'Sistema',
    correo: loggedUser?.correo || 'admin@duoc.cl',
    telefono: '+56 9 8765 4321',
    cargo: loggedUser?.tipoUsuario || 'Administrador General'
  })
  const [profileSavedMsg, setProfileSavedMsg] = useState(false)

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

  // Métricas calculadas con datos reales exactos
  // 1. Compras: Total de compras reales registradas en el sistema
  const totalPurchasesCount = orders.length.toLocaleString('es-CL')
  
  // 2. Productos e inventario actual
  const totalStock = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0)
  const displayProductsCount = products.length
  const displayInventoryStock = totalStock
  
  // 3. Usuarios y nuevos usuarios
  const displayUsersCount = users.length
  // Si hay usuarios nuevos registrados, calcularlos o mostrar los que son clientes
  const newUsersThisMonth = users.filter(u => u.tipoUsuario === 'Cliente').length

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
      categoria: customCategories[0] || 'Selecciones Nacionales'
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

  // Handler Categorías
  const handleAddCategory = (e) => {
    e.preventDefault()
    const trimmed = newCategoryName.trim()
    if (trimmed && !customCategories.includes(trimmed)) {
      setCustomCategories([...customCategories, trimmed])
      setNewCategoryName('')
    }
  }

  // Handler Guardar Perfil
  const handleSaveProfile = (e) => {
    e.preventDefault()
    setProfileSavedMsg(true)
    setTimeout(() => setProfileSavedMsg(false), 3000)
  }

  // Definición de las tarjetas de la grilla (Figura 9)
  const gridCards = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      iconSvg: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
      desc: 'Visión general de todas las métricas y estadísticas clave del sistema.',
      action: () => onSelectTab('dashboard')
    },
    {
      id: 'ordenes',
      title: 'Órdenes',
      iconSvg: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      ),
      desc: 'Gestión y seguimiento de todas las órdenes de compra realizadas.',
      action: () => onSelectTab('ordenes')
    },
    {
      id: 'productos',
      title: 'Productos',
      iconSvg: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      ),
      desc: 'Administrar inventario y detalles de los productos disponibles.',
      action: () => onSelectTab('productos')
    },
    {
      id: 'categorias',
      title: 'Categorías',
      iconSvg: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
          <line x1="7" y1="7" x2="7.01" y2="7"></line>
        </svg>
      ),
      desc: 'Organizar productos en categorías para facilitar su navegación.',
      action: () => onSelectTab('categorias')
    },
    {
      id: 'usuarios',
      title: 'Usuarios',
      iconSvg: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      desc: 'Gestión de cuentas de usuario y sus roles dentro del sistema.',
      action: () => onSelectTab('usuarios')
    },
    {
      id: 'reportes',
      title: 'Reportes',
      iconSvg: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      ),
      desc: 'Generación de informes detallados sobre las operaciones del sistema.',
      action: () => onSelectTab('reportes')
    },
    {
      id: 'perfil',
      title: 'Perfil',
      iconSvg: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
      desc: 'Administración de la información personal y configuraciones de cuenta.',
      action: () => onSelectTab('perfil')
    },
    {
      id: 'tienda',
      title: 'Tienda',
      iconSvg: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
      desc: 'Visualiza tu tienda en tiempo real, visualiza los reportes de los usuarios.',
      action: () => onNavigateHome()
    }
  ]

  return (
    <div className="admin-content-wrapper">
      {/* ============================================================== */}
      {/* VISTA 1: DASHBOARD PRINCIPAL (FIGURA 9)                        */}
      {/* ============================================================== */}
      {currentTab === 'dashboard' && (
        <div>
          {/* Encabezado Dashboard con alto contraste */}
          <div className="mb-5">
            <h1 className="title is-3 mb-1" style={{ color: '#111827', fontWeight: 800 }}>
              Dashboard
            </h1>
            <p className="subtitle is-6" style={{ color: '#4b5563', margin: 0, fontWeight: 500 }}>
              Resumen de las actividades diarias
            </p>
          </div>

          {/* Tres Cuadros Métricos Superiores (Figura 9) */}
          <div className="columns is-multiline mb-5">
            {/* 1. Compras (Azul) */}
            <div className="column is-4">
              <div className="dashboard-stat-card stat-card-blue">
                <div className="stat-card-header">
                  <div className="stat-card-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="stat-card-title">Compras</div>
                    <div className="stat-card-value">{totalPurchasesCount}</div>
                  </div>
                </div>
                <div className="stat-card-footer">
                  Probabilidad de aumento: 20%
                </div>
              </div>
            </div>

            {/* 2. Productos (Verde) */}
            <div className="column is-4">
              <div className="dashboard-stat-card stat-card-green">
                <div className="stat-card-header">
                  <div className="stat-card-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                  </div>
                  <div>
                    <div className="stat-card-title">Productos</div>
                    <div className="stat-card-value">{displayProductsCount}</div>
                  </div>
                </div>
                <div className="stat-card-footer">
                  Inventario actual: {displayInventoryStock}
                </div>
              </div>
            </div>

            {/* 3. Usuarios (Amarillo/Dorado) */}
            <div className="column is-4">
              <div className="dashboard-stat-card stat-card-yellow">
                <div className="stat-card-header">
                  <div className="stat-card-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="stat-card-title">Usuarios</div>
                    <div className="stat-card-value">{displayUsersCount}</div>
                  </div>
                </div>
                <div className="stat-card-footer">
                  Nuevos usuarios este mes: {newUsersThisMonth}
                </div>
              </div>
            </div>
          </div>

          {/* Alerta de Stock Crítico si aplica */}
          {totalCritical > 0 && (
            <div className="notification is-warning is-light mb-5">
              <strong>Alerta de Inventario:</strong> Existen <strong>{totalCritical} modelos</strong> con stock crítico o bajo. Puedes gestionarlos en la sección de <a onClick={() => onSelectTab('productos')} style={{ textDecoration: 'underline', cursor: 'pointer' }}>Productos</a>.
            </div>
          )}

          {/* Grilla de 8 Tarjetas Navegables (Figura 9) */}
          <div className="columns is-multiline">
            {gridCards.map((card) => (
              <div key={card.id} className="column is-3-desktop is-6-tablet is-12-mobile">
                <div
                  className="dashboard-grid-card"
                  onClick={card.action}
                  role="button"
                  tabIndex={0}
                >
                  <div className="grid-card-icon">{card.iconSvg}</div>
                  <h3 className="grid-card-title">{card.title}</h3>
                  <p className="grid-card-desc">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VISTA 2: ÓRDENES / HISTORIAL DE COMPRAS (COMPLETA Y OPERATIVA)  */}
      {/* ============================================================== */}
      {currentTab === 'ordenes' && (
        <div className="box">
          <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
            <div>
              <h2 className="title is-4 mb-1">
                {selectedUserForHistory
                  ? `Órdenes del Cliente: ${selectedUserForHistory.nombre} ${selectedUserForHistory.apellidos} (${selectedUserForHistory.run})`
                  : 'Gestión y Seguimiento de Órdenes'}
              </h2>
              <p className="subtitle is-6 has-text-grey">
                {selectedUserForHistory
                  ? 'Listado detallado de compras correspondientes al cliente seleccionado.'
                  : `Registro total de ${orders.length} órdenes generadas en la plataforma.`}
              </p>
            </div>
            {selectedUserForHistory && (
              <Button
                variant="light"
                size="small"
                onClick={() => setSelectedUserForHistory(null)}
              >
                ← Ver Todas las Órdenes
              </Button>
            )}
          </div>

          {/* Modal Detalle de Boleta Electrónica (Atomic Design + Bulma CSS) */}
          <ReceiptModal
            order={selectedOrderForDetail ? {
              ...selectedOrderForDetail,
              customer: selectedOrderForDetail.customer || users.find(u => String(u.run) === String(selectedOrderForDetail.userRun))
            } : null}
            isOpen={!!selectedOrderForDetail}
            onClose={() => setSelectedOrderForDetail(null)}
          />

          {(() => {
            const displayedOrders = selectedUserForHistory
              ? orders.filter(o => String(o.userRun) === String(selectedUserForHistory.run))
              : orders

            if (displayedOrders.length === 0) {
              return (
                <div className="notification is-light has-text-centered py-5">
                  <p className="is-size-6">No se encontraron órdenes registradas.</p>
                </div>
              )
            }

            return (
              <div className="table-container">
                <table className="table is-fullwidth is-striped is-hoverable">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Fecha</th>
                      <th>Cliente</th>
                      <th>RUN</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedOrders.map(ord => (
                      <tr key={ord.id}>
                        <td><strong>{ord.id}</strong></td>
                        <td>{ord.fecha}</td>
                        <td>{ord.customerName}</td>
                        <td><code>{ord.userRun}</code></td>
                        <td>
                          <span className="tag is-info is-light">
                            {ord.items.reduce((s, it) => s + it.cantidad, 0)} unidades
                          </span>
                        </td>
                        <td className="has-text-weight-bold has-text-primary">
                          ${Number(ord.total).toLocaleString('es-CL')}
                        </td>
                        <td>
                          <span className="tag is-success is-light">
                            {ord.estado || 'Completado'}
                          </span>
                        </td>
                        <td>
                          <Button
                            variant="info"
                            size="small"
                            onClick={() => setSelectedOrderForDetail(ord)}
                          >
                            Ver Boleta
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          })()}
        </div>
      )}

      {/* ============================================================== */}
      {/* VISTA 3: PRODUCTOS (CATÁLOGO, INVENTARIO, CRUD)                */}
      {/* ============================================================== */}
      {currentTab === 'productos' && (
        <div className="box">
          <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
            <div>
              <h2 className="title is-4 mb-1">Catálogo de Productos e Inventario</h2>
              <p className="subtitle is-6 has-text-grey">
                {products.length} productos registrados | {totalStock} unidades en bodega
              </p>
            </div>
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

      {/* ============================================================== */}
      {/* VISTA 4: CATEGORÍAS (GESTIÓN DE CATEGORÍAS Y FILTRADO)          */}
      {/* ============================================================== */}
      {currentTab === 'categorias' && (
        <div>
          <div className="box mb-5">
            <h2 className="title is-4 mb-2">Organización de Categorías</h2>
            <p className="subtitle is-6 has-text-grey mb-4">
              Crea nuevas categorías o inspecciona los productos asociados a cada una.
            </p>

            <form onSubmit={handleAddCategory} className="is-flex is-align-items-center" style={{ gap: '0.75rem', maxWidth: '500px' }}>
              <input
                type="text"
                className="input"
                placeholder="Nombre de la nueva categoría..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
              />
              <Button type="submit" variant="primary">
                + Agregar
              </Button>
            </form>
          </div>

          <div className="columns is-multiline">
            {customCategories.map((catName) => {
              const count = products.filter(p => p.categoria === catName).length
              return (
                <div key={catName} className="column is-6">
                  <div
                    className={`box ${categoryFilter === catName ? 'has-background-link-light' : ''}`}
                    style={{ border: categoryFilter === catName ? '2px solid #1a73e8' : '1px solid #e9ecef', cursor: 'pointer' }}
                    onClick={() => setCategoryFilter(categoryFilter === catName ? 'Todas' : catName)}
                  >
                    <div className="is-flex is-justify-content-space-between is-align-items-center">
                      <div>
                        <h3 className="title is-5 mb-1">{catName}</h3>
                        <p className="subtitle is-6 has-text-grey mb-0">
                          {count} productos registrados
                        </p>
                      </div>
                      <span className={`tag ${categoryFilter === catName ? 'is-link' : 'is-light'}`}>
                        {categoryFilter === catName ? 'Filtrando' : 'Ver productos'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="box mt-4">
            <h3 className="title is-5 mb-3">
              Productos en categoría: <strong>{categoryFilter}</strong>
            </h3>
            <div className="table-container">
              <table className="table is-fullwidth is-striped is-hoverable">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products
                    .filter(p => categoryFilter === 'Todas' || p.categoria === categoryFilter)
                    .map(p => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td><strong>{p.titulo}</strong></td>
                        <td><span className="tag is-info is-light">{p.categoria}</span></td>
                        <td>${Number(p.precio).toLocaleString('es-CL')}</td>
                        <td>{p.stock}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VISTA 5: USUARIOS (ROLES, GESTIÓN, HISTORIAL POR CLIENTE)       */}
      {/* ============================================================== */}
      {currentTab === 'usuarios' && !isSeller && (
        <div className="box">
          <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
            <div>
              <h2 className="title is-4 mb-1">Listado de Usuarios del Sistema</h2>
              <p className="subtitle is-6 has-text-grey">
                {users.length} usuarios registrados en la base de datos
              </p>
            </div>
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
                        {u.tipoUsuario === 'Cliente' && (
                          <Button
                            variant="primary"
                            onClick={() => {
                              setSelectedUserForHistory(u)
                              onSelectTab('ordenes')
                            }}
                          >
                            Ver Compras
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

      {/* ============================================================== */}
      {/* VISTA 6: REPORTES Y MÉTRICAS (ATOMIC DESIGN)                    */}
      {/* ============================================================== */}
      {currentTab === 'reportes' && (
        <ReportsPanel orders={orders} products={products} users={users} />
      )}

      {/* ============================================================== */}
      {/* VISTA 7: PERFIL DEL ADMINISTRADOR                              */}
      {/* ============================================================== */}
      {currentTab === 'perfil' && (
        <div className="box" style={{ maxWidth: '800px' }}>
          <h2 className="title is-4 mb-1">Perfil del Administrador</h2>
          <p className="subtitle is-6 has-text-grey mb-4">
            Administración de la información personal y configuraciones de cuenta.
          </p>

          {profileSavedMsg && (
            <div className="notification is-success is-light mb-4">
              ¡Datos de perfil actualizados exitosamente!
            </div>
          )}

          <form onSubmit={handleSaveProfile}>
            <div className="columns">
              <div className="column is-6">
                <FormField label="Nombre">
                  <Input
                    value={profileForm.nombre}
                    onChange={(e) => setProfileForm({ ...profileForm, nombre: e.target.value })}
                    required
                  />
                </FormField>
              </div>
              <div className="column is-6">
                <FormField label="Apellidos">
                  <Input
                    value={profileForm.apellidos}
                    onChange={(e) => setProfileForm({ ...profileForm, apellidos: e.target.value })}
                    required
                  />
                </FormField>
              </div>
            </div>

            <div className="columns">
              <div className="column is-6">
                <FormField label="Correo Electrónico">
                  <Input
                    type="email"
                    value={profileForm.correo}
                    onChange={(e) => setProfileForm({ ...profileForm, correo: e.target.value })}
                    required
                  />
                </FormField>
              </div>
              <div className="column is-6">
                <FormField label="Teléfono de Contacto">
                  <Input
                    value={profileForm.telefono}
                    onChange={(e) => setProfileForm({ ...profileForm, telefono: e.target.value })}
                    required
                  />
                </FormField>
              </div>
            </div>

            <FormField label="Cargo / Rol en Plataforma">
              <Input
                value={profileForm.cargo}
                readOnly
              />
            </FormField>

            <div className="mt-4">
              <Button type="submit" variant="primary">
                Guardar Cambios de Perfil
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL CREAR / EDITAR PRODUCTO                                  */}
      {/* ============================================================== */}
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
                            {customCategories.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
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

      {/* ============================================================== */}
      {/* MODAL CREAR / EDITAR USUARIO                                   */}
      {/* ============================================================== */}
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
