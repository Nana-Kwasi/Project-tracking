import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Spinner from './Spinner'
import './Modal.css'

const BRANCHES = [
  '3003 – ACCRA BRANCH – 330102',
  '4126 – MAKOLA BRANCH – 330111',
  '6824 – TEMA BRANCH (COMM) – 330120',
  '6735 – AIRPORT BRANCH – 330119',
  '6822 – MARKET CIRCLE – 330401 (Takoradi)',
  '6753 – ADUM BRANCH – 330601 (Kumasi)',
  '3012 – WEST HILLS MALL – 330108',
  '3002 – JUNCTION SHOPPING CENTRE BRANCH – 330101',
  '4127 – TEMA BRANCH (COMM) – 330112',
  '3006 – ACCRA MALL BRANCH – 330106',
  '4128 – KEJETIA BRANCH – 330602'
]

const ProjectModal = ({ onClose, onSuccess }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    projectName: '',
    department: '',
    branch: '',
    description: '',
    priorityLevel: 'MEDIUM'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Get logged by value from user context (handle both camelCase and lowercase)
  const loggedBy = user?.fNumber || user?.fnumber || ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await api.post('/api/projects', formData)
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Log New Project Request</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Date & Time</label>
            <input type="text" value={new Date().toLocaleString()} readOnly />
          </div>
          <div className="form-group">
            <label>Project Name *</label>
            <input
              type="text"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Branch</label>
            <select
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
            >
              <option value="">Select Branch</option>
              {BRANCHES.map((branch) => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Logged By</label>
            <input type="text" value={loggedBy} readOnly />
          </div>
          <div className="form-group">
            <label>Description / Business Justification *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows="4"
            />
          </div>
          <div className="form-group">
            <label>Priority Level *</label>
            <select
              value={formData.priorityLevel}
              onChange={(e) => setFormData({ ...formData, priorityLevel: e.target.value })}
              required
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="small" /> Creating...
                </>
              ) : (
                'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectModal
