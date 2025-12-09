import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import '../App.css'

type LayoutProps = {
  children: React.ReactNode
}

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/calendar', label: 'Calendar' },
  { to: '/appointments', label: 'Appointments' },
  { to: '/medications', label: 'Medications' },
  { to: '/school-docs', label: 'School Docs' },
  { to: '/notes', label: 'Notes' },
  { to: '/ai-helper', label: 'AI Helper' },
]

export function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="app-shell">
      <div className="container">
        <header className="top-nav">
          <div className="brand">
            <span className="brand-badge">VH</span>
            <div className="brand-text">
              <div>Village Hub</div>
              <small className="brand-tagline">
                Advocacy made easier for parents
              </small>
            </div>
          </div>
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <nav className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-link${isActive ? ' active' : ''}`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main>{children}</main>
      </div>
    </div>
  )
}

export default Layout

