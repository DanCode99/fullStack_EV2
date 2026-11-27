import { useState, useEffect } from 'react'
import { FormField } from '../../components/molecules/FormField/FormField.jsx'
import { Input } from '../../components/atoms/Input/Input.jsx'
import { Button } from '../../components/atoms/Button/Button.jsx'
import { ReceiptModal } from '../../components/organisms/ReceiptModal/ReceiptModal.jsx'
import { ReportsPanel } from '../../components/organisms/ReportsPanel/ReportsPanel.jsx'
import { userService } from '../../services/userService.js'

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
  const isSeller = loggedUser?.rol === 'VENDEDOR' || loggedUser?.tipoUsuario === 'Vendedor' || loggedUser?.tipo === 'Vendedor'

  const [selectedUserForHistory, setSelectedUserForHistory] = useState(null)
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showProductModal, setShowProductModal] = useState(false)
  const [productActionLoading, setProductActionLoading] = useState(false)
  const [productActionError, setProductActionError] = useState('')

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
    cargo: loggedUser?.rol || loggedUser?.tipoUsuario || 'ADMIN'
  })
  const [profileSavedMsg, setProfileSavedMsg] = useState(false)

  // Formulario Producto: Contrato { titulo, precio, stock, stockCritico, talla, idMarca, img, img2, categoriasIds }
  const [productForm, setProductForm] = useState({
    titulo: '',
    precio: '',
    stock: '',
    stockCritico: 5,
    talla: 'M',
    idMarca: 1,
    img: '',
    img2: '',
    categoriasIds: [1],
    categoria: 'Selecciones Nacionales',
    descripcion: ''
  })

  // Formulario Usuario: Contrato { run, nombre, apellidos, correo, nombreRol, idComuna, direccion }
  const [editingUser, setEditingUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [userActionLoading, setUserActionLoading] = useState(false)
  const [userActionError, setUserActionError] = useState('')
  const [userForm, setUserForm] = useState({
    run: '',
    nombre: '',
    apellidos: '',
    correo: '',
    password: '',
    nombreRol: 'CLIENTE',
    idRegion: '',
    idComuna: '',
    direccion: ''
  })

  // Ubicaciones dinámicas para modales de administración
  const [regiones, setRegiones] = useState([])
  const [comunas, setComunas] = useState([])

  useEffect(() => {
    let isMounted = true
    const loadRegiones = async () => {
      try {
        const data = await userService.getRegiones()
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setRegiones(data)
        }
      } catch {
        if (isMounted) {
          setRegiones([
            { idRegion: 1, nombreRegion: 'Región Metropolitana de Santiago' },
            { idRegion: 2, nombreRegion: 'Región de Valparaíso' },
            { idRegion: 3, nombreRegion: 'Región del Biobío' }
          ])
        }
      }
    }
    loadRegiones()
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    if (!userForm.idRegion) return
    let isMounted = true
    const loadComunas = async () => {
      try {
        const data = await userService.getComunasByRegion(userForm.idRegion)
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setComunas(data)
          setUserForm(prev => ({
            ...prev,
            idComuna: prev.idComuna || data[0].idComuna || data[0].id
          }))
        }
      } catch {
        if (isMounted) {
          const fallback = [
            { idComuna: 1, nombreComuna: 'Santiago Centro', idRegion: 1 },
            { idComuna: 2, nombreComuna: 'Providencia', idRegion: 1 }
          ]
          setComunas(fallback)
        }
      }
    }
    loadComunas()
    return () => { isMounted = false }
  }, [userForm.idRegion])

  // Conversión de archivo seleccionado a Base64 mediante FileReader
  const handleFileChange = (e, field) => {
    const file = e.target.files && e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProductForm(prev => ({
          ...prev,
          [field]: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Métricas calculadas
  const totalPurchasesCount = orders.length.toLocaleString('es-CL')
  const totalStock = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0)
  const displayProductsCount = products.length
  const displayInventoryStock = totalStock
  const displayUsersCount = users.length
  const newUsersThisMonth = users.filter(u => (u.nombreRol || u.tipoUsuario) === 'CLIENTE' || (u.nombreRol || u.tipoUsuario) === 'Cliente').length
  const totalCritical = products.filter(p => Number(p.stock) <= (Number(p.stockCritico) || 5)).length

  // Handlers Productos (Admin)
  const handleOpenNewProduct = () => {
    if (isSeller) return
    setEditingProduct(null)
    setProductActionError('')
    setProductForm({
      titulo: '',
      precio: '',
      stock: 10,
      stockCritico: 5,
      talla: 'M',
      idMarca: 1,
      img: '',
      img2: '',
      categoriasIds: [1],
      categoria: 'Selecciones Nacionales',
      descripcion: ''
    })
    setShowProductModal(true)
  }

  const handleOpenEditProduct = (prod) => {
    if (isSeller) return
    setEditingProduct(prod)
    setProductActionError('')
    setProductForm({
      titulo: prod.titulo || '',
      precio: prod.precio || '',
      stock: prod.stock || 0,
      stockCritico: prod.stockCritico || 5,
      talla: prod.talla || 'M',
      idMarca: prod.idMarca || 1,
      img: prod.img || '',
      img2: prod.img2 || '',
      categoriasIds: prod.categoriasIds || [1],
      categoria: prod.categoria || 'Selecciones Nacionales',
      descripcion: prod.descripcion || ''
    })
    setShowProductModal(true)
  }

  const handleSaveProduct = async (e) => {
    e.preventDefault()
    if (isSeller) return

    setProductActionError('')
    const payload = {
      titulo: productForm.titulo.trim(),
      precio: Number(productForm.precio),
      stock: Number(productForm.stock),
      stockCritico: Number(productForm.stockCritico || 5),
      talla: productForm.talla || 'M',
      idMarca: Number(productForm.idMarca || 1),
      img: productForm.img,
      img2: productForm.img2 || '',
      categoriasIds: Array.isArray(productForm.categoriasIds)
        ? productForm.categoriasIds.map(Number)
        : [1]
    }

    try {
      setProductActionLoading(true)
      if (editingProduct) {
        await onUpdateProduct(editingProduct.id, payload)
      } else {
        await onCreateProduct(payload)
      }
      setShowProductModal(false)
    } catch (err) {
      setProductActionError(err.message || 'Error al guardar el producto.')
    } finally {
      setProductActionLoading(false)
    }
  }

  const handleDeleteProduct = async (id) => {
    if (isSeller) return
    if (!window.confirm('¿Estás seguro de eliminar este producto del catálogo?')) return
    try {
      await onDeleteProduct(id)
    } catch (err) {
      alert(`Error al eliminar producto: ${err.message}`)
    }
  }

  // Handlers Usuarios (Admin)
  const handleOpenNewUser = () => {
    if (isSeller) return
    setEditingUser(null)
    setUserActionError('')
    setUserForm({
      run: '',
      nombre: '',
      apellidos: '',
      correo: '',
      password: '',
      nombreRol: 'CLIENTE',
      idRegion: regiones[0]?.idRegion || regiones[0]?.id || 1,
      idComuna: comunas[0]?.idComuna || comunas[0]?.id || 1,
      direccion: ''
    })
    setShowUserModal(true)
  }

  const handleOpenEditUser = (u) => {
    if (isSeller) return
    setEditingUser(u)
    setUserActionError('')
    setUserForm({
      run: u.run,
      nombre: u.nombre,
      apellidos: u.apellidos,
      correo: u.correo,
      password: '',
      nombreRol: u.nombreRol || u.tipoUsuario || 'CLIENTE',
      idRegion: u.idRegion || regiones[0]?.idRegion || 1,
      idComuna: u.idComuna || 1,
      direccion: u.direccion || ''
    })
    setShowUserModal(true)
  }

  const handleSaveUser = async (e) => {
    e.preventDefault()
    if (isSeller) return

    setUserActionError('')
    const payload = {
      run: userForm.run.trim(),
      nombre: userForm.nombre.trim(),
      apellidos: userForm.apellidos.trim(),
      correo: userForm.correo.trim(),
      password: userForm.password || '123456',
      nombreRol: (userForm.nombreRol || 'CLIENTE').toUpperCase(),
      idComuna: Number(userForm.idComuna || 1),
      direccion: userForm.direccion.trim()
    }

    try {
      setUserActionLoading(true)
      if (editingUser) {
        if (onUpdateUser) await onUpdateUser(editingUser.run, payload)
      } else {
        await onCreateUser(payload)
      }
      setShowUserModal(false)
    } catch (err) {
      setUserActionError(err.message || 'Error al guardar usuario.')
    } finally {
      setUserActionLoading(false)
    }
  }

  const handleDeleteUser = async (run) => {
    if (isSeller) return
    if (!window.confirm(`¿Estás seguro de eliminar al usuario con RUN ${run}?`)) return
    try {
      await onDeleteUser(run)
    } catch (err) {
      alert(`Error al eliminar usuario: ${err.message}`)
    }
  }

  // Handler Categorías
  const handleAddCategory = (e) => {
    e.preventDefault()
    if (isSeller) return
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

  // Tarjetas del Dashboard
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
      desc: 'Consulta e inventario de los productos disponibles.',
      action: () => onSelectTab('productos')
    },
    ...(!isSeller ? [
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
      }
    ] : []),
    {
      id: 'tienda',
      title: 'Tienda',
      iconSvg: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
      desc: 'Visualiza la tienda en tiempo real.',
      action: () => onNavigateHome()
    }
  ]

  return (
    <div className="admin-content-wrapper">
      {/* ============================================================== */}
      {/* VISTA 1: DASHBOARD PRINCIPAL (Solo Admin)                      */}
      {/* ============================================================== */}
      {currentTab === 'dashboard' && !isSeller && (
        <div>
          <div className="mb-5">
            <h1 className="title is-3 mb-1">Dashboard</h1>
            <p className="subtitle is-6">Resumen de las actividades diarias del sistema</p>
          </div>

          <div className="columns is-multiline mb-5">
            <div className="column is-4">
              <div className="dashboard-stat-card stat-card-blue">
                <div className="stat-card-header">
                  <div className="stat-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                  </div>
                  <div>
                    <div className="stat-card-title">Compras</div>
                    <div className="stat-card-value">{totalPurchasesCount}</div>
                  </div>
                </div>
                <div className="stat-card-footer">Total de órdenes registradas</div>
              </div>
            </div>

            <div className="column is-4">
              <div className="dashboard-stat-card stat-card-green">
                <div className="stat-card-header">
                  <div className="stat-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                  </div>
                  <div>
                    <div className="stat-card-title">Productos</div>
                    <div className="stat-card-value">{displayProductsCount}</div>
                  </div>
                </div>
                <div className="stat-card-footer">Inventario en bodega: {displayInventoryStock}</div>
              </div>
            </div>

            <div className="column is-4">
              <div className="dashboard-stat-card stat-card-yellow">
                <div className="stat-card-header">
                  <div className="stat-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div>
                    <div className="stat-card-title">Usuarios</div>
                    <div className="stat-card-value">{displayUsersCount}</div>
                  </div>
                </div>
                <div className="stat-card-footer">Clientes activos: {newUsersThisMonth}</div>
              </div>
            </div>
          </div>

          {totalCritical > 0 && (
            <div className="notification is-warning is-light mb-5">
              <strong>Alerta de Inventario:</strong> Existen <strong>{totalCritical} modelos</strong> con stock crítico o bajo.
            </div>
          )}

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
      {/* VISTA 2: ÓRDENES / SEGUIMIENTO (Admin y Vendedor)              */}
      {/* ============================================================== */}
      {currentTab === 'ordenes' && (
        <div className="box">
          <div className="is-flex is-justify-content-space-between is-align-items-center mb-4 is-flex-wrap-wrap gap-2">
            <div>
              <h2 className="title is-4 mb-1">
                {selectedUserForHistory
                  ? `Órdenes del Cliente: ${selectedUserForHistory.nombre} ${selectedUserForHistory.apellidos} (${selectedUserForHistory.run})`
                  : 'Gestión y Seguimiento de Órdenes'}
              </h2>
              <p className="subtitle is-6 has-text-grey mb-0">
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

          {isSeller && (
            <div className="notification is-info is-light p-3 mb-4">
              <strong>Modo Consulta (VENDEDOR):</strong> Tienes acceso de solo lectura para revisar el estado y emitir boletas de las compras.
            </div>
          )}

          <ReceiptModal
            order={selectedOrderForDetail}
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
                  <p className="is-size-6">No se encontraron órdenes registradas en la API.</p>
                </div>
              )
            }

            return (
              <div className="table-container">
                <table className="table is-fullwidth is-striped is-hoverable is-vcentered">
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
                    {displayedOrders.map(ord => {
                      const orderId = ord.idOrden || ord.id
                      const itemsCount = Array.isArray(ord.items)
                        ? ord.items.reduce((s, it) => s + (Number(it.cantidad) || 1), 0)
                        : 0

                      return (
                        <tr key={orderId}>
                          <td><strong>{orderId}</strong></td>
                          <td>{ord.fecha || 'N/A'}</td>
                          <td>{ord.customerName || 'Cliente'}</td>
                          <td><code>{ord.userRun || 'N/A'}</code></td>
                          <td>
                            <span className="tag is-info is-light">
                              {itemsCount} unidades
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
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
          })()}
        </div>
      )}

      {/* ============================================================== */}
      {/* VISTA 3: PRODUCTOS (Admin: CRUD | Vendedor: Solo Consulta)     */}
      {/* ============================================================== */}
      {currentTab === 'productos' && (
        <div className="box">
          <div className="is-flex is-justify-content-space-between is-align-items-center mb-4 is-flex-wrap-wrap gap-2">
            <div>
              <h2 className="title is-4 mb-1">Catálogo de Productos e Inventario</h2>
              <p className="subtitle is-6 has-text-grey mb-0">
                {products.length} productos registrados | {totalStock} unidades en inventario
              </p>
            </div>

            {/* Restricción: ocultar botón de crear si es VENDEDOR */}
            {!isSeller && (
              <Button variant="primary" size="small" onClick={handleOpenNewProduct}>
                + Nuevo Producto
              </Button>
            )}
          </div>

          {isSeller && (
            <div className="notification is-info is-light p-3 mb-4">
              <strong>Modo Consulta (VENDEDOR):</strong> Visualización de catálogo y stock. La creación, edición y eliminación de productos están restringidas al Administrador.
            </div>
          )}

          <div className="table-container">
            <table className="table is-fullwidth is-striped is-hoverable is-vcentered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Foto</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Categoría</th>
                  <th>Stock</th>
                  {!isSeller && <th>Acciones</th>}
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
                        className="thumb-40"
                        onError={(e) => { e.target.src = 'https://placehold.co/40x40?text=Camiseta' }}
                      />
                    </td>
                    <td><strong>{p.titulo}</strong></td>
                    <td>${Number(p.precio).toLocaleString('es-CL')}</td>
                    <td><span className="tag is-light">{p.categoria || p.nombreMarca || 'Deportes'}</span></td>
                    <td>
                      <span className={`tag ${Number(p.stock) <= (Number(p.stockCritico) || 5) ? 'is-danger' : 'is-success'}`}>
                        {p.stock}
                      </span>
                    </td>
                    {/* Restricción: ocultar botones de editar y eliminar si es VENDEDOR */}
                    {!isSeller && (
                      <td>
                        <div className="buttons are-small">
                          <Button variant="info" onClick={() => handleOpenEditProduct(p)}>
                            Editar
                          </Button>
                          <Button variant="danger" onClick={() => handleDeleteProduct(p.id)}>
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VISTA 4: CATEGORÍAS (Solo Admin)                              */}
      {/* ============================================================== */}
      {currentTab === 'categorias' && !isSeller && (
        <div>
          <div className="box mb-5">
            <h2 className="title is-4 mb-2">Organización de Categorías</h2>
            <p className="subtitle is-6 has-text-grey mb-4">
              Crea nuevas categorías o inspecciona los productos asociados a cada una.
            </p>

            <form onSubmit={handleAddCategory} className="is-flex is-align-items-center admin-cat-form">
              <input
                type="text"
                className="input mr-2"
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
                    className={`box category-filter-card cursor-pointer ${categoryFilter === catName ? 'has-background-link-light is-active' : ''}`}
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
      {/* VISTA 5: USUARIOS (Solo Admin)                                 */}
      {/* ============================================================== */}
      {currentTab === 'usuarios' && !isSeller && (
        <div className="box">
          <div className="is-flex is-justify-content-space-between is-align-items-center mb-4 is-flex-wrap-wrap gap-2">
            <div>
              <h2 className="title is-4 mb-1">Listado de Usuarios del Sistema</h2>
              <p className="subtitle is-6 has-text-grey mb-0">
                {users.length} usuarios registrados en la API
              </p>
            </div>
            <Button variant="primary" size="small" onClick={handleOpenNewUser}>
              + Nuevo Usuario
            </Button>
          </div>

          <div className="table-container">
            <table className="table is-fullwidth is-striped is-hoverable is-vcentered">
              <thead>
                <tr>
                  <th>RUN</th>
                  <th>Nombre y Apellidos</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Comuna ID</th>
                  <th>Dirección</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const rol = u.nombreRol || u.tipoUsuario || 'CLIENTE'
                  return (
                    <tr key={u.run}>
                      <td><code>{u.run}</code></td>
                      <td>{u.nombre} {u.apellidos}</td>
                      <td>{u.correo}</td>
                      <td>
                        <span className={`tag ${rol === 'ADMIN' || rol === 'Administrador' ? 'is-danger' : rol === 'VENDEDOR' || rol === 'Vendedor' ? 'is-warning' : 'is-info'}`}>
                          {rol}
                        </span>
                      </td>
                      <td>{u.idComuna || u.comuna || 'N/A'}</td>
                      <td>{u.direccion || 'N/A'}</td>
                      <td>
                        <div className="buttons are-small">
                          {rol === 'CLIENTE' && (
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
                          <Button variant="danger" onClick={() => handleDeleteUser(u.run)}>
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VISTA 6: REPORTES Y MÉTRICAS (Solo Admin)                      */}
      {/* ============================================================== */}
      {currentTab === 'reportes' && !isSeller && (
        <ReportsPanel orders={orders} products={products} users={users} />
      )}

      {/* ============================================================== */}
      {/* VISTA 7: PERFIL DEL ADMINISTRADOR                              */}
      {/* ============================================================== */}
      {currentTab === 'perfil' && !isSeller && (
        <div className="box container-max-800">
          <h2 className="title is-4 mb-1">Perfil del Usuario</h2>
          <p className="subtitle is-6 has-text-grey mb-4">
            Información de la cuenta autenticada con JWT.
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

            <FormField label="Rol en Plataforma">
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
      {/* MODAL CREAR / EDITAR PRODUCTO (FileReader a Base64)           */}
      {/* ============================================================== */}
      {showProductModal && !isSeller && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => !productActionLoading && setShowProductModal(false)}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">
                {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
              </p>
              <button
                className="delete"
                aria-label="close"
                disabled={productActionLoading}
                onClick={() => setShowProductModal(false)}
              ></button>
            </header>
            <form onSubmit={handleSaveProduct}>
              <section className="modal-card-body">
                {productActionError && (
                  <div className="notification is-danger is-light mb-4">
                    {productActionError}
                  </div>
                )}

                <FormField label="Título del Producto *">
                  <Input
                    value={productForm.titulo}
                    onChange={(e) => setProductForm({ ...productForm, titulo: e.target.value })}
                    placeholder="Camiseta Selección 2026"
                    disabled={productActionLoading}
                    required
                  />
                </FormField>

                <div className="columns">
                  <div className="column is-6">
                    <FormField label="Precio ($ CLP) *">
                      <Input
                        type="number"
                        value={productForm.precio}
                        onChange={(e) => setProductForm({ ...productForm, precio: e.target.value })}
                        placeholder="49990"
                        disabled={productActionLoading}
                        required
                      />
                    </FormField>
                  </div>
                  <div className="column is-6">
                    <FormField label="Talla">
                      <Input
                        value={productForm.talla}
                        onChange={(e) => setProductForm({ ...productForm, talla: e.target.value })}
                        placeholder="M"
                        disabled={productActionLoading}
                      />
                    </FormField>
                  </div>
                </div>

                <div className="columns">
                  <div className="column is-6">
                    <FormField label="Stock *">
                      <Input
                        type="number"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                        disabled={productActionLoading}
                        required
                      />
                    </FormField>
                  </div>
                  <div className="column is-6">
                    <FormField label="Stock Crítico *">
                      <Input
                        type="number"
                        value={productForm.stockCritico}
                        onChange={(e) => setProductForm({ ...productForm, stockCritico: e.target.value })}
                        disabled={productActionLoading}
                        required
                      />
                    </FormField>
                  </div>
                </div>

                {/* Inputs de Archivo con FileReader a Base64 para img e img2 */}
                <div className="columns">
                  <div className="column is-6">
                    <div className="field">
                      <label className="label">Imagen Principal (Archivo)</label>
                      <div className="control">
                        <input
                          type="file"
                          accept="image/*"
                          className="input"
                          onChange={(e) => handleFileChange(e, 'img')}
                          disabled={productActionLoading}
                        />
                      </div>
                      {productForm.img && (
                        <p className="help is-success">
                          ✓ Imagen cargada ({productForm.img.substring(0, 30)}...)
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="column is-6">
                    <div className="field">
                      <label className="label">Imagen Secundaria (Archivo)</label>
                      <div className="control">
                        <input
                          type="file"
                          accept="image/*"
                          className="input"
                          onChange={(e) => handleFileChange(e, 'img2')}
                          disabled={productActionLoading}
                        />
                      </div>
                      {productForm.img2 && (
                        <p className="help is-success">
                          ✓ Imagen 2 cargada ({productForm.img2.substring(0, 30)}...)
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Fallback opcional por si el usuario desea pegar una URL */}
                <FormField label="O URL directa de Imagen Principal">
                  <Input
                    value={productForm.img}
                    onChange={(e) => setProductForm({ ...productForm, img: e.target.value })}
                    placeholder="/assets/images/brasil/brasil1.jpeg"
                    disabled={productActionLoading}
                    required
                  />
                </FormField>
              </section>
              <footer className="modal-card-foot">
                <Button
                  type="submit"
                  variant="primary"
                  className={productActionLoading ? 'is-loading' : ''}
                  disabled={productActionLoading}
                >
                  Guardar Producto
                </Button>
                <Button
                  variant="light"
                  disabled={productActionLoading}
                  onClick={() => setShowProductModal(false)}
                >
                  Cancelar
                </Button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL CREAR / EDITAR USUARIO (Admin)                           */}
      {/* ============================================================== */}
      {showUserModal && !isSeller && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => !userActionLoading && setShowUserModal(false)}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">
                {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
              </p>
              <button
                className="delete"
                aria-label="close"
                disabled={userActionLoading}
                onClick={() => setShowUserModal(false)}
              ></button>
            </header>
            <form onSubmit={handleSaveUser}>
              <section className="modal-card-body">
                {userActionError && (
                  <div className="notification is-danger is-light mb-4">
                    {userActionError}
                  </div>
                )}

                <FormField label="RUN (sin puntos ni guion) *">
                  <Input
                    value={userForm.run}
                    onChange={(e) => setUserForm({ ...userForm, run: e.target.value })}
                    readOnly={!!editingUser}
                    disabled={userActionLoading}
                    placeholder="123456789"
                    required
                  />
                </FormField>

                <div className="columns">
                  <div className="column is-6">
                    <FormField label="Nombre *">
                      <Input
                        value={userForm.nombre}
                        onChange={(e) => setUserForm({ ...userForm, nombre: e.target.value })}
                        disabled={userActionLoading}
                        required
                      />
                    </FormField>
                  </div>
                  <div className="column is-6">
                    <FormField label="Apellidos *">
                      <Input
                        value={userForm.apellidos}
                        onChange={(e) => setUserForm({ ...userForm, apellidos: e.target.value })}
                        disabled={userActionLoading}
                        required
                      />
                    </FormField>
                  </div>
                </div>

                <div className="columns">
                  <div className="column is-6">
                    <FormField label="Correo Electrónico *">
                      <Input
                        type="email"
                        value={userForm.correo}
                        onChange={(e) => setUserForm({ ...userForm, correo: e.target.value })}
                        disabled={userActionLoading}
                        required
                      />
                    </FormField>
                  </div>
                  <div className="column is-6">
                    <div className="field">
                      <label className="label">Rol del Usuario *</label>
                      <div className="control">
                        <div className="select is-fullwidth">
                          <select
                            value={userForm.nombreRol}
                            onChange={(e) => setUserForm({ ...userForm, nombreRol: e.target.value })}
                            disabled={userActionLoading}
                          >
                            <option value="CLIENTE">CLIENTE</option>
                            <option value="VENDEDOR">VENDEDOR</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="columns">
                  <div className="column is-6">
                    <div className="field">
                      <label className="label">Región</label>
                      <div className="control">
                        <div className="select is-fullwidth">
                          <select
                            value={userForm.idRegion}
                            onChange={(e) => setUserForm({ ...userForm, idRegion: e.target.value })}
                            disabled={userActionLoading}
                          >
                            {regiones.map(r => {
                              const id = r.idRegion || r.id
                              const name = r.nombreRegion || r.nombre || r.region
                              return <option key={id} value={id}>{name}</option>
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="column is-6">
                    <div className="field">
                      <label className="label">Comuna *</label>
                      <div className="control">
                        <div className="select is-fullwidth">
                          <select
                            value={userForm.idComuna}
                            onChange={(e) => setUserForm({ ...userForm, idComuna: e.target.value })}
                            disabled={userActionLoading || comunas.length === 0}
                          >
                            {comunas.map(c => {
                              const id = c.idComuna || c.id
                              const name = c.nombreComuna || c.nombre || c.comuna
                              return <option key={id} value={id}>{name}</option>
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <FormField label="Dirección de Domicilio *">
                  <Input
                    value={userForm.direccion}
                    onChange={(e) => setUserForm({ ...userForm, direccion: e.target.value })}
                    placeholder="Av. Providencia 1234"
                    disabled={userActionLoading}
                    required
                  />
                </FormField>

                {!editingUser && (
                  <FormField label="Contraseña Inicial *">
                    <Input
                      type="password"
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      placeholder="Mínimo 6 caracteres"
                      disabled={userActionLoading}
                      required
                    />
                  </FormField>
                )}
              </section>
              <footer className="modal-card-foot">
                <Button
                  type="submit"
                  variant="primary"
                  className={userActionLoading ? 'is-loading' : ''}
                  disabled={userActionLoading}
                >
                  Guardar Usuario
                </Button>
                <Button
                  variant="light"
                  disabled={userActionLoading}
                  onClick={() => setShowUserModal(false)}
                >
                  Cancelar
                </Button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminView
