import { useState, useEffect } from 'react'
import api from '../services/api'
import Spinner from './Spinner'
import './Modal.css'

const UserModal = ({ user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fNumber: '',
    role: 'NORMAL_USER',
    isActive: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        fNumber: user.fNumber,
        role: user.role,
        isActive: user.isActive
      })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      if (user) {
        await api.put(`/api/users/${user.id}`, formData)
      } else {
        await api.post('/api/users', formData)
      }
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{user ? 'Edit User' : 'Add User'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          {!user && (
            <div className="form-group">
              <label>F-Number *</label>
              <input
                type="text"
                value={formData.fNumber}
                onChange={(e) => setFormData({ ...formData, fNumber: e.target.value })}
                required
                placeholder="e.g., F001"
              />
            </div>
          )}
          <div className="form-group">
            <label>Role *</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            >
              <option value="NORMAL_USER">Normal User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              Active
            </label>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="small" /> {user ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                user ? 'Update User' : 'Create User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserModal
