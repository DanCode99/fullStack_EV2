import { useState } from 'react'
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
  const [currentView, setCurrentView] = useState('home')
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

  // Navegación
  const navigateTo = (viewName) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setCurrentView(viewName)
  }

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
    navigateTo('detalle')
  }

  // Envío de Orden (Checkout)
  const handleSubmitOrder = ({ success, order }) => {
    setLastOrder(order)
    if (success) {
      // 1. Descontar del stock de los productos comprados
      productStorage.reduceStock(order.items || [])
      setProducts(productStorage.getAll())

      // 2. Registrar en el historial de órdenes
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

      // 3. Vaciar carrito y navegar al resumen
      handleClearCart()
      navigateTo('pago-exito')
    } else {
      navigateTo('pago-error')
    }
  }


  const totalCartCount = cart.reduce((acc, item) => acc + item.cantidad, 0)

  // Renderizado condicional según vista
  const renderViewContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeView
            products={products}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onNavigate={navigateTo}
          />
        )
      case 'productos':
        return (
          <ProductsView
            products={products}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
          />
        )
      case 'categorias':
        return (
          <CategoriesView
            products={products}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
          />
        )
      case 'ofertas':
        return (
          <OffersView
            products={products}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
          />
        )
      case 'detalle':
        return (
          <ProductDetailView
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onBack={() => navigateTo('productos')}
          />
        )
      case 'carrito':
        return (
          <CartView
            cart={cart}
            onIncrement={handleIncrementCart}
            onDecrement={handleDecrementCart}
            onRemove={handleRemoveCart}
            onClear={handleClearCart}
            onNavigate={navigateTo}
          />
        )
      case 'checkout':
        return (
          <CheckoutView
            cart={cart}
            loggedUser={loggedUser}
            onSubmitOrder={handleSubmitOrder}
            onNavigate={navigateTo}
          />
        )
      case 'pago-exito':
        return (
          <PaymentSuccessView
            order={lastOrder}
            onNavigate={navigateTo}
          />
        )
      case 'pago-error':
        return (
          <PaymentErrorView
            order={lastOrder}
            onRetry={() => navigateTo('checkout')}
            onNavigate={navigateTo}
          />
        )
      case 'nosotros':
        return <AboutView />
      case 'blog':
        return <BlogView />
      case 'contacto':
        return <ContactView />
      case 'login':
        return (
          <LoginView
            onLoginSuccess={handleLogin}
            onNavigate={navigateTo}
          />
        )
      case 'registro':
        return (
          <RegisterView
            onRegisterUser={handleRegisterUser}
            onNavigate={navigateTo}
          />
        )
      case 'admin':
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
      default:
        return (
          <HomeView
            products={products}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onNavigate={navigateTo}
          />
        )
    }
  }

  if (currentView === 'admin') {
    return renderViewContent()
  }

  return (
    <MainLayout
      currentView={currentView}
      onNavigate={navigateTo}
      loggedUser={loggedUser}
      onLogout={handleLogout}
      cartCount={totalCartCount}
    >
      {renderViewContent()}
    </MainLayout>
  )
}

export default App
