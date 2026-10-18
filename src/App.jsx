import { useState } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { productStorage } from './services/productService.js'
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

const CART_STORAGE_KEY = 'carritoFutbol'

export function App() {
  const navigate = useNavigate()
  const location = useLocation()

  const [adminTab, setAdminTab] = useState('dashboard')
  const [products, setProducts] = useState(() => productStorage.getAll())
  const [users, setUsers] = useState(() => userService.getAll())
  const [orders, setOrders] = useState(() => orderService.getAll())
  const [loggedUser, setLoggedUser] = useState(() => userService.getLoggedUser())
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [lastOrder, setLastOrder] = useState(null)

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Sincronizar cambios del carrito con LocalStorage
  const updateCart = (newCart) => {
    setCart(newCart)
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart))
  }

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

  // Operaciones del Carrito
  const handleAddToCart = (product, quantity = 1) => {
    const existingIndex = cart.findIndex(
      item => item.id === product.id && item.talla === (product.talla || 'M')
    )

    if (existingIndex > -1) {
      const updated = [...cart]
      updated[existingIndex].cantidad += quantity
      updateCart(updated)
    } else {
      const newItem = {
        id: product.id,
        titulo: product.titulo,
        precio: product.precio,
        img: product.img,
        talla: product.talla || 'M',
        cantidad: quantity
      }
      updateCart([...cart, newItem])
    }
  }

  const handleIncrementCart = (index) => {
    const updated = [...cart]
    updated[index].cantidad += 1
    updateCart(updated)
  }

  const handleDecrementCart = (index) => {
    const updated = [...cart]
    if (updated[index].cantidad > 1) {
      updated[index].cantidad -= 1
      updateCart(updated)
    } else {
      handleRemoveCart(index)
    }
  }

  const handleRemoveCart = (index) => {
    const updated = cart.filter((_, i) => i !== index)
    updateCart(updated)
  }

  const handleClearCart = () => {
    updateCart([])
  }

  // Operaciones de Usuario
  const handleLogin = (correo, password) => {
    const user = userService.login(correo, password)
    if (user) {
      setLoggedUser(user)
      if (user.tipoUsuario === 'Administrador' || user.tipoUsuario === 'Vendedor') {
        navigateTo('admin')
      } else {
        navigateTo('home')
      }
      return true
    }
    return false
  }

  const handleLogout = () => {
    userService.logout()
    setLoggedUser(null)
    navigateTo('home')
  }

  const handleRegisterUser = (newUser) => {
    const exists = users.some(u => String(u.run) === String(newUser.run))
    if (exists) return false
    const created = userService.create(newUser)
    setUsers(userService.getAll())
    return !!created
  }

  // Operaciones CRUD de Productos (Admin)
  const handleCreateProduct = (newProd) => {
    productStorage.create(newProd)
    setProducts(productStorage.getAll())
  }

  const handleUpdateProduct = (id, fields) => {
    productStorage.update(id, fields)
    setProducts(productStorage.getAll())
  }

  const handleDeleteProduct = (id) => {
    productStorage.delete(id)
    setProducts(productStorage.getAll())
  }

  // Operaciones CRUD de Usuarios (Admin)
  const handleCreateUser = (newUser) => {
    userService.create(newUser)
    setUsers(userService.getAll())
  }

  const handleUpdateUser = (run, fields) => {
    userService.update(run, fields)
    setUsers(userService.getAll())
  }

  const handleDeleteUser = (run) => {
    userService.delete(run)
    setUsers(userService.getAll())
  }

  // Selección de Producto para Detalle
  const handleSelectProduct = (prod) => {
    setSelectedProduct(prod)
    navigateTo(`/productos/${prod.id}`)
  }

  // Envío de Orden (Checkout)
  const handleSubmitOrder = ({ success, order }) => {
    setLastOrder(order)
    if (success) {
      productStorage.reduceStock(order.items || [])
      setProducts(productStorage.getAll())

      const registeredOrder = {
        id: `ORD-${order.orderNumber}`,
        userRun: loggedUser?.run || '444444444',
        customerName: `${order.customer?.nombre || ''} ${order.customer?.apellidos || ''}`.trim() || 'Cliente Web',
        customer: order.customer,
        fecha: new Date().toISOString().split('T')[0],
        total: order.total,
        items: order.items,
        estado: 'Completado'
      }
      orderService.create(registeredOrder)
      setOrders(orderService.getAll())

      handleClearCart()
      navigateTo('pago-exito')
    } else {
      navigateTo('pago-error')
    }
  }

  const totalCartCount = cart.reduce((acc, item) => acc + item.cantidad, 0)

  // Si estamos en la ruta de administración, renderizamos con AdminLayout
  if (location.pathname.startsWith('/admin')) {
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
    </MainLayout>
  )
}

export default App
