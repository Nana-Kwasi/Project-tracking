import { useState } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from './Spinner'
import './Layout.css'

const Layout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = user?.role === 'ADMIN'
  const [logoutLoading, setLogoutLoading] = useState(false)

  const handleLogout = () => {
    setLogoutLoading(true)
    setTimeout(() => {
      logout()
      navigate('/login')
    }, 300)
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src="/Images/images.png" alt="FNB Logo" className="sidebar-logo" />
          <h2>FNB Project Tracking</h2>
        </div>
        <nav className="sidebar-nav">
          <Link 
            to="/dashboard" 
            className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/log-project" 
            className={`nav-item ${isActive('/log-project') ? 'active' : ''}`}
          >
            <span className="nav-icon">📝</span>
            <span>Log Project</span>
          </Link>
          {isAdmin && (
            <Link 
              to="/projects" 
              className={`nav-item ${isActive('/projects') ? 'active' : ''}`}
            >
              <span className="nav-icon">📁</span>
              <span>Projects</span>
            </Link>
          )}
          {isAdmin && (
            <Link 
              to="/users" 
              className={`nav-item ${isActive('/users') ? 'active' : ''}`}
            >
              <span className="nav-icon">👥</span>
              <span>Users</span>
            </Link>
          )}
          <Link 
            to="/reports" 
            className={`nav-item ${isActive('/reports') ? 'active' : ''}`}
          >
            <span className="nav-icon">📈</span>
            <span>Reports</span>
          </Link>
          {isAdmin && (
            <Link 
              to="/logs" 
              className={`nav-item ${isActive('/logs') ? 'active' : ''}`}
            >
              <span className="nav-icon">📋</span>
              <span>Logs</span>
            </Link>
          )}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-fnumber">{user?.fNumber}</span>
            <span className="user-role">{user?.role === 'ADMIN' ? 'Administrator' : 'User'}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout} disabled={logoutLoading}>
            {logoutLoading ? (
              <>
                <Spinner size="small" /> <span>Logging out...</span>
              </>
            ) : (
              <>
                <span className="logout-icon">🚪</span>
                <span>Logout</span>
              </>
            )}
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
