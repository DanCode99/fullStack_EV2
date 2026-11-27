import { Navbar } from '../../organisms/Navbar/Navbar.jsx'
import { Footer } from '../../organisms/Footer/Footer.jsx'
import { CartDrawer } from '../../organisms/CartDrawer/CartDrawer.jsx'

export function MainLayout({
  children,
  currentView,
  onNavigate,
  loggedUser,
  onLogout,
  cartCount,
  onOpenCart,
  catalogProducts = []
}) {
  return (
    <div className="is-flex is-flex-direction-column min-h-100vh">
      <Navbar
        currentView={currentView}
        onNavigate={onNavigate}
        loggedUser={loggedUser}
        onLogout={onLogout}
        cartCount={cartCount}
        onOpenCart={onOpenCart}
      />
      <main className="is-flex-grow-1">
        {children}
      </main>
      <Footer onNavigate={onNavigate} />
      <CartDrawer catalogProducts={catalogProducts} onNavigate={onNavigate} />
    </div>
  )
}

export default MainLayout


