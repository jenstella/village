import { NavLink } from 'react-router-dom'
import '../App.css'

type LayoutProps = {
  children: React.ReactNode
}

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/appointments', label: 'Appointments' },
  { to: '/school-docs', label: 'School Docs' },
  { to: '/notes', label: 'Notes' },
  { to: '/ai-helper', label: 'AI Helper' },
]

export function Layout({ children }: LayoutProps) {
  return (
    <div className="app-shell">
      <div className="container">
        <header className="top-nav">
          <div className="brand">
            <span className="brand-badge">VH</span>
            <div>
              <div>Village Hub</div>
              <small style={{ color: '#cbd5e1' }}>
                Advocacy made easier for parents
              </small>
            </div>
          </div>
          <nav className="nav-links">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-link${isActive ? ' active' : ''}`
                }
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

