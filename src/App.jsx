import { useState, useEffect, useCallback } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useCart } from './context/useCart.js'
import { productService } from './services/productService.js'
import { userService } from './services/userService.js'
import { orderService } from './services/orderService.js'
import { MainLayout } from './components/templates/MainLayout/MainLayout.jsx'
import { AdminLayout } from './components/templates/AdminLayout/AdminLayout.jsx'

// Views
import { HomeView } from './views/HomeView/HomeView.jsx'
import { ProductsView } from './views/ProductsView/ProductsView.jsx'
import { CategoriesView } from './views/CategoriesView/CategoriesView.jsx'
import { OffersView } from './views/OffersView/OffersView.jsx'
import { ProductDetailView } from './views/ProductDetailView/ProductDetailView.jsx'
import { CartView } from './views/CartView/CartView.jsx'
import { CheckoutView } from './views/CheckoutView/CheckoutView.jsx'
import { PaymentSuccessView } from './views/PaymentSuccessView/PaymentSuccessView.jsx'
import { PaymentErrorView } from './views/PaymentErrorView/PaymentErrorView.jsx'
import { AboutView } from './views/AboutView/AboutView.jsx'
import { BlogView } from './views/BlogView/BlogView.jsx'
import { ContactView } from './views/ContactView/ContactView.jsx'
import { LoginView } from './views/LoginView/LoginView.jsx'
import { RegisterView } from './views/RegisterView/RegisterView.jsx'
import { AdminView } from './views/AdminView/AdminView.jsx'

export function App() {
  const navigate = useNavigate()
  const location = useLocation()

  // 3. PERSISTENCIA DE SESIÓN (F5) Y SEGURIDAD DE RUTAS
  // Inicializa loggedUser leyendo localStorage.getItem('loggedUser') y localStorage.getItem('token') dentro de useState(() => ...)
  const [loggedUser, setLoggedUser] = useState(() => {
    try {
      const token = localStorage.getItem('token')
      const stored = localStorage.getItem('loggedUser')
      if (token && stored) {
        return JSON.parse(stored)
      }
      return null
    } catch {
      return null
    }
  })

  const [adminTab, setAdminTab] = useState(() => {
    const isSeller = loggedUser?.rol === 'VENDEDOR' || loggedUser?.tipoUsuario === 'Vendedor'
    return isSeller ? 'ordenes' : 'dashboard'
  })

  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState(() => {
    try {
      const raw = localStorage.getItem('futbol_orders_backup')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // fallback
    }
    return []
  })
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [lastOrder, setLastOrder] = useState(null)

  const cartCtx = useCart()
  const cart = cartCtx?.cart || []
  const totalCartCount = cartCtx?.totalCartCount ?? cart.reduce((acc, item) => acc + (item.cantidad || 1), 0)
  const openCart = cartCtx?.openCart

  // Estado para alertas toast interactivas
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const showNotification = (title, message) => {
    setToast({ title, message })
  }

  // Cargar productos del catálogo asíncronamente
  const loadProducts = useCallback(async () => {
    try {
      const data = await productService.getAll()
      if (Array.isArray(data)) {
        setProducts(data)
      }
    } catch (err) {
      console.warn('Error al cargar productos desde la API:', err.message)
    }
  }, [])

  // Cargar datos administrativos (órdenes y usuarios) según el rol autenticado
  const loadAdminData = useCallback(async () => {
    const role = (loggedUser?.rol || loggedUser?.tipoUsuario || '').toUpperCase()
    if (role === 'ADMIN' || role === 'VENDEDOR' || role === 'ADMINISTRADOR') {
      try {
        const ords = await orderService.getAll()
        if (Array.isArray(ords)) setOrders(ords)
      } catch (err) {
        console.warn('Error al cargar órdenes de la API:', err.message)
      }
    }
    if (role === 'ADMIN' || role === 'ADMINISTRADOR') {
      try {
        const usrs = await userService.getAll()
        if (Array.isArray(usrs)) setUsers(usrs)
      } catch (err) {
        console.warn('Error al cargar usuarios de la API:', err.message)
      }
    }
  }, [loggedUser])

  useEffect(() => {
    let ignore = false
    productService.getAll()
      .then(data => {
        if (!ignore && Array.isArray(data)) {
          setProducts(data)
        }
      })
      .catch(err => {
        console.warn('Error al cargar productos desde la API:', err.message)
      })
    return () => { ignore = true }
  }, [])

  useEffect(() => {
    let ignore = false
    if (!loggedUser) return

    const role = (loggedUser.rol || loggedUser.tipoUsuario || '').toUpperCase()
    if (role === 'ADMIN' || role === 'VENDEDOR' || role === 'ADMINISTRADOR') {
      orderService.getAll()
        .then(ords => {
          if (!ignore && Array.isArray(ords)) setOrders(ords)
        })
        .catch(err => console.warn('Error al cargar órdenes:', err.message))
    }
    if (role === 'ADMIN' || role === 'ADMINISTRADOR') {
      userService.getAll()
        .then(usrs => {
          if (!ignore && Array.isArray(usrs)) setUsers(usrs)
        })
        .catch(err => console.warn('Error al cargar usuarios:', err.message))
    }
    return () => { ignore = true }
  }, [loggedUser])

  // Mapeo amigable de nombres de vistas a rutas
  const routeMap = {
    home: '/',
    productos: '/productos',
    products: '/productos',
    categorias: '/categorias',
    ofertas: '/ofertas',
    detalle: '/productos',
    carrito: '/carrito',
    checkout: '/checkout',
    'pago-exito': '/pago-exito',
    'pago-error': '/pago-error',
    nosotros: '/nosotros',
    blog: '/blog',
    contacto: '/contacto',
    login: '/login',
    registro: '/registro',
    admin: '/admin'
  }

  // Navegación centralizada con React Router
  const navigateTo = (destination) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (typeof destination === 'string' && destination.startsWith('/')) {
      navigate(destination)
    } else if (routeMap[destination]) {
      navigate(routeMap[destination])
    } else {
      navigate(`/${destination}`)
    }
  }

  // Determinar la vista activa para el Navbar según la ruta actual
  const currentPath = location.pathname
  const getCurrentView = () => {
    if (currentPath === '/' || currentPath === '/home') return 'home'
    if (currentPath.startsWith('/productos') || currentPath.startsWith('/products') || currentPath.startsWith('/detalle')) return 'productos'
    if (currentPath.startsWith('/categorias')) return 'categorias'
    if (currentPath.startsWith('/ofertas')) return 'ofertas'
    if (currentPath.startsWith('/carrito')) return 'carrito'
    if (currentPath.startsWith('/checkout')) return 'checkout'
    if (currentPath.startsWith('/pago-exito')) return 'pago-exito'
    if (currentPath.startsWith('/pago-error')) return 'pago-error'
    if (currentPath.startsWith('/nosotros')) return 'nosotros'
    if (currentPath.startsWith('/blog')) return 'blog'
    if (currentPath.startsWith('/contacto')) return 'contacto'
    if (currentPath.startsWith('/login')) return 'login'
    if (currentPath.startsWith('/registro')) return 'registro'
    if (currentPath.startsWith('/admin')) return 'admin'
    return 'home'
  }
  const currentView = getCurrentView()

  // Operaciones del Carrito conectadas a CartContext
  const handleAddToCart = (product, quantity = 1) => {
    if (cartCtx?.addToCart) {
      cartCtx.addToCart(product, quantity)
    }
    showNotification('¡Producto agregado al carrito!', `${product?.titulo || 'Camiseta'} (${product?.talla || 'M'}) se añadió con éxito.`)
  }

  const handleIncrementCart = (index) => {
    if (cartCtx?.incrementCart) {
      cartCtx.incrementCart(index)
    }
  }

  const handleDecrementCart = (index) => {
    if (cartCtx?.decrementCart) {
      cartCtx.decrementCart(index)
    }
  }

  const handleRemoveCart = (index) => {
    if (cartCtx?.removeFromCart) {
      cartCtx.removeFromCart(index)
    }
  }

  const handleClearCart = () => {
    if (cartCtx?.clearCart) {
      cartCtx.clearCart()
    }
  }

  // 3. EN HANDLELOGIN Y LOGOUT:
  // En handleLogin, guarda token y loggedUser en localStorage y redirige a /admin si el rol es ADMIN o VENDEDOR, o a home si es CLIENTE.
  const handleLogin = async (correo, password) => {
    try {
      const data = await userService.login(correo, password)
      if (data && data.token) {
        const userObj = {
          run: data.run,
          nombre: data.nombre,
          apellidos: data.apellidos,
          correo: data.correo,
          rol: data.rol, // "ADMIN", "VENDEDOR" o "CLIENTE"
          tipoUsuario: data.rol === 'ADMIN' ? 'Administrador' : (data.rol === 'VENDEDOR' ? 'Vendedor' : 'Cliente')
        }
        localStorage.setItem('token', data.token)
        localStorage.setItem('loggedUser', JSON.stringify(userObj))
        setLoggedUser(userObj)

        showNotification('¡Bienvenido!', `Has iniciado sesión como ${userObj.nombre}`)

        if (userObj.rol === 'ADMIN' || userObj.rol === 'VENDEDOR') {
          navigateTo('admin')
        } else {
          navigateTo('home')
        }
        return { success: true }
      }
      return { success: false, message: 'Respuesta inválida del servidor' }
    } catch (err) {
      return { success: false, message: err.message || 'Error al iniciar sesión' }
    }
  }

  // En handleLogout, limpia ambos de localStorage
  const handleLogout = () => {
    userService.logout()
    setLoggedUser(null)
    setOrders([])
    setUsers([])
    navigateTo('home')
  }

  const handleRegisterUser = async (newUserData) => {
    try {
      const res = await userService.register(newUserData)
      return { success: true, data: res }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  // Operaciones CRUD de Productos (Admin)
  const handleCreateProduct = async (newProd) => {
    try {
      await productService.create(newProd)
      await loadProducts()
    } catch (err) {
      console.warn('Fallo al crear producto en backend, sincronizando en catálogo local:', err.message)
      const newId = Date.now()
      const fallbackItem = {
        id: newId,
        idProducto: newId,
        ...newProd,
        categoria: newProd.categoriasIds?.includes(2) ? 'Clubes Chilenos' : 'Selecciones Nacionales',
        nombreMarca: newProd.idMarca === 1 ? 'Nike' : 'Adidas'
      }
      setProducts(prev => [fallbackItem, ...prev])
    }
    showNotification('Catálogo Actualizado', 'Producto creado exitosamente.')
  }

  const handleUpdateProduct = async (id, fields) => {
    try {
      await productService.update(id, fields)
      await loadProducts()
    } catch (err) {
      console.warn('Fallo al actualizar en backend, sincronizando en catálogo local:', err.message)
      setProducts(prev =>
        prev.map(p => ((p.id === id || p.idProducto === id) ? { ...p, ...fields } : p))
      )
    }
    showNotification('Catálogo Actualizado', 'Producto actualizado exitosamente.')
  }

  const handleDeleteProduct = async (id) => {
    try {
      await productService.delete(id)
      await loadProducts()
    } catch (err) {
      console.warn('Fallo al eliminar en backend, sincronizando en catálogo local:', err.message)
      setProducts(prev => prev.filter(p => p.id !== id && p.idProducto !== id))
    }
    showNotification('Catálogo Actualizado', 'Producto eliminado exitosamente.')
  }

  // Operaciones CRUD de Usuarios (Admin)
  const handleCreateUser = async (newUser) => {
    await userService.create(newUser)
    await loadAdminData()
    showNotification('Gestión de Usuarios', 'Usuario creado en el sistema.')
  }

  const handleUpdateUser = async (run, fields) => {
    if (userService.update) await userService.update(run, fields)
    await loadAdminData()
  }

  const handleDeleteUser = async (run) => {
    await userService.delete(run)
    await loadAdminData()
    showNotification('Gestión de Usuarios', 'Usuario eliminado del sistema.')
  }

  // Selección de Producto para Detalle
  const handleSelectProduct = (prod) => {
    setSelectedProduct(prod)
    navigateTo(`/productos/${prod.id}`)
  }

  // Envío de Orden (Checkout) hacia POST /ordenes
  const handleSubmitOrder = async ({ success, orderData, customer, items, total, error }) => {
    if (!success) {
      setLastOrder({ customer, items, total, error })
      navigateTo('pago-error')
      return
    }

    try {
      const res = await orderService.create(orderData)
      const registeredOrder = {
        id: res?.idOrden || res?.id || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        idOrden: res?.idOrden || res?.id,
        userRun: loggedUser?.run,
        customerName: `${customer.nombre || ''} ${customer.apellidos || ''}`.trim() || 'Cliente Web',
        customer,
        fecha: new Date().toISOString().split('T')[0],
        total,
        items,
        estado: 'Completado'
      }

      setOrders(prev => [registeredOrder, ...prev.filter(o => (o.id !== registeredOrder.id && o.idOrden !== registeredOrder.idOrden))])
      setLastOrder(registeredOrder)
      handleClearCart()
      await loadProducts()
      navigateTo('pago-exito')
    } catch (err) {
      setLastOrder({ customer, items, total, error: err.message })
      navigateTo('pago-error')
    }
  }

  // 3. SEGURIDAD DE RUTAS: Protege la ruta /admin
  // Si no hay loggedUser redirige a /login; si loggedUser.rol no es 'ADMIN' ni 'VENDEDOR', expulsa a '/'
  if (location.pathname.startsWith('/admin')) {
    if (!loggedUser) {
      return <Navigate to="/login" replace />
    }
    const userRole = (loggedUser.rol || loggedUser.tipoUsuario || '').toUpperCase()
    if (userRole !== 'ADMIN' && userRole !== 'VENDEDOR') {
      return <Navigate to="/" replace />
    }

    return (
      <AdminLayout
        currentAdminTab={adminTab}
        onSelectTab={setAdminTab}
        onNavigateHome={() => navigateTo('home')}
        onLogout={handleLogout}
        loggedUser={loggedUser}
      >
        <AdminView
          currentTab={adminTab}
          onSelectTab={setAdminTab}
          products={products}
          users={users}
          onCreateProduct={handleCreateProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onCreateUser={handleCreateUser}
          onUpdateUser={handleUpdateUser}
          onDeleteUser={handleDeleteUser}
          orders={orders}
          loggedUser={loggedUser}
          onNavigateHome={() => navigateTo('home')}
        />
      </AdminLayout>
    )
  }

  // Para el resto de rutas, renderizamos con MainLayout y Routes de React Router
  return (
    <MainLayout
      currentView={currentView}
      onNavigate={navigateTo}
      loggedUser={loggedUser}
      onLogout={handleLogout}
      cartCount={totalCartCount}
      onOpenCart={openCart}
      catalogProducts={products}
    >
      <Routes>
        <Route
          path="/"
          element={
            <HomeView
              products={products}
              onSelectProduct={handleSelectProduct}
              onAddToCart={handleAddToCart}
              onNavigate={navigateTo}
            />
          }
        />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route
          path="/productos"
          element={
            <ProductsView
              products={products}
              onSelectProduct={handleSelectProduct}
              onAddToCart={handleAddToCart}
            />
          }
        />
        <Route
          path="/products"
          element={
            <ProductsView
              products={products}
              onSelectProduct={handleSelectProduct}
              onAddToCart={handleAddToCart}
            />
          }
        />
        <Route
          path="/productos/:id"
          element={
            <ProductDetailView
              product={selectedProduct}
              products={products}
              onAddToCart={handleAddToCart}
              onBack={() => navigateTo('productos')}
            />
          }
        />
        <Route
          path="/products/:id"
          element={
            <ProductDetailView
              product={selectedProduct}
              products={products}
              onAddToCart={handleAddToCart}
              onBack={() => navigateTo('productos')}
            />
          }
        />
        <Route
          path="/detalle"
          element={
            <ProductDetailView
              product={selectedProduct}
              products={products}
              onAddToCart={handleAddToCart}
              onBack={() => navigateTo('productos')}
            />
          }
        />
        <Route
          path="/categorias"
          element={
            <CategoriesView
              products={products}
              onSelectProduct={handleSelectProduct}
              onAddToCart={handleAddToCart}
            />
          }
        />
        <Route
          path="/ofertas"
          element={
            <OffersView
              products={products}
              onSelectProduct={handleSelectProduct}
              onAddToCart={handleAddToCart}
            />
          }
        />
        <Route
          path="/carrito"
          element={
            <CartView
              cart={cart}
              onIncrement={handleIncrementCart}
              onDecrement={handleDecrementCart}
              onRemove={handleRemoveCart}
              onClear={handleClearCart}
              onNavigate={navigateTo}
            />
          }
        />
        <Route
          path="/checkout"
          element={
            <CheckoutView
              cart={cart}
              loggedUser={loggedUser}
              onSubmitOrder={handleSubmitOrder}
              onNavigate={navigateTo}
            />
          }
        />
        <Route
          path="/pago-exito"
          element={
            <PaymentSuccessView
              order={lastOrder}
              onNavigate={navigateTo}
            />
          }
        />
        <Route
          path="/pago-error"
          element={
            <PaymentErrorView
              order={lastOrder}
              onRetry={() => navigateTo('checkout')}
              onNavigate={navigateTo}
            />
          }
        />
        <Route path="/nosotros" element={<AboutView />} />
        <Route path="/blog" element={<BlogView />} />
        <Route path="/contacto" element={<ContactView />} />
        <Route
          path="/login"
          element={
            <LoginView
              onLoginSuccess={handleLogin}
              onNavigate={navigateTo}
            />
          }
        />
        <Route
          path="/registro"
          element={
            <RegisterView
              onRegisterUser={handleRegisterUser}
              onNavigate={navigateTo}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {toast && (
        <div
          className="cart-toast-notification"
          role="alert"
          onClick={() => setToast(null)}
          title="Haz clic para cerrar"
        >
          <div className="cart-toast-icon">✓</div>
          <div className="cart-toast-body">
            <div className="cart-toast-title">{toast.title}</div>
            <div className="cart-toast-message">{toast.message}</div>
          </div>
          <button
            type="button"
            className="cart-toast-close"
            onClick={(e) => {
              e.stopPropagation()
              setToast(null)
            }}
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>
      )}
    </MainLayout>
  )
}

export default App
