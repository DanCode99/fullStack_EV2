import { Navbar } from '../../organisms/Navbar/Navbar.jsx'
import { Footer } from '../../organisms/Footer/Footer.jsx'

export function MainLayout({
  children,
  currentView,
  onNavigate,
  loggedUser,
  onLogout,
  cartCount
}) {
  return (
    <div className="is-flex is-flex-direction-column" style={{ minHeight: '100vh' }}>
      <Navbar
        currentView={currentView}
        onNavigate={onNavigate}
        loggedUser={loggedUser}
        onLogout={onLogout}
        cartCount={cartCount}
      />
      <main className="is-flex-grow-1">
        {children}
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  )
}
