import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Spinner from './Spinner'
import './Modal.css'

const ChangeRequestModal = ({ onClose, onSuccess }) => {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [formData, setFormData] = useState({
    projectId: '',
    requestedFeature: '',
    reasonForChange: '',
    impactLevel: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Get logged by value from user context (handle both camelCase and lowercase)
  const loggedBy = user?.fNumber || user?.fnumber || ''

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await api.get('/api/projects')
      setProjects(response.data)
    } catch (err) {
      console.error('Failed to fetch projects:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await api.post('/api/change-requests', {
        projectId: formData.projectId,
        requestedFeature: formData.requestedFeature,
        reasonForChange: formData.reasonForChange,
        impactLevel: formData.impactLevel
      })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create change request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Log Change Request</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Date & Time</label>
            <input type="text" value={new Date().toLocaleString()} readOnly />
          </div>
          <div className="form-group">
            <label>Existing Project *</label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              required
            >
              <option value="">Select Project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.projectId} - {project.projectName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Logged By</label>
            <input type="text" value={loggedBy} readOnly />
          </div>
          <div className="form-group">
            <label>Requested New Feature / Change Description *</label>
            <textarea
              value={formData.requestedFeature}
              onChange={(e) => setFormData({ ...formData, requestedFeature: e.target.value })}
              required
              rows="4"
            />
          </div>
          <div className="form-group">
            <label>Reason for Change</label>
            <textarea
              value={formData.reasonForChange}
              onChange={(e) => setFormData({ ...formData, reasonForChange: e.target.value })}
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Impact Level</label>
            <input
              type="text"
              value={formData.impactLevel}
              onChange={(e) => setFormData({ ...formData, impactLevel: e.target.value })}
            />
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
                'Create Change Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangeRequestModal
