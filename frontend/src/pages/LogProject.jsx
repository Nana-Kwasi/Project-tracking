import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import ProjectModal from '../components/ProjectModal'
import ChangeRequestModal from '../components/ChangeRequestModal'
import Spinner from '../components/Spinner'
import './LogProject.css'

const LogProject = () => {
  const { user } = useAuth()
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showChangeRequestModal, setShowChangeRequestModal] = useState(false)
  const [projects, setProjects] = useState([])
  const [changeRequests, setChangeRequests] = useState([])
  const [projectSearch, setProjectSearch] = useState('')
  const [changeRequestSearch, setChangeRequestSearch] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [projectsRes, changeRequestsRes] = await Promise.all([
        api.get('/api/projects'),
        api.get('/api/change-requests')
      ])
      setProjects(projectsRes.data)
      setChangeRequests(changeRequestsRes.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  const handleProjectCreated = () => {
    setShowProjectModal(false)
    fetchData()
  }

  const handleChangeRequestCreated = () => {
    setShowChangeRequestModal(false)
    fetchData()
  }

  return (
    <div className="log-project">
      <h1>Log Project</h1>
      
      <div className="log-sections">
        <div className="log-section">
          <h2>Log New Project Request</h2>
          <button 
            className="primary-button"
            onClick={() => setShowProjectModal(true)}
          >
            + New Project Request
          </button>
        </div>

        <div className="divider"></div>

        <div className="log-section">
          <h2>Log Change Request</h2>
          <button 
            className="primary-button"
            onClick={() => setShowChangeRequestModal(true)}
          >
            + New Change Request
          </button>
        </div>
      </div>

      <div className="tables-section">
        <div className="table-container">
          <div className="table-header-with-search">
            <h2>New Project Requests</h2>
            <input
              type="text"
              placeholder="Search by Project ID or Name..."
              className="search-input"
              value={projectSearch}
              onChange={(e) => setProjectSearch(e.target.value)}
            />
          </div>
          <table>
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Project Name</th>
                <th>Department</th>
                <th>Branch</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {projects
                .filter((project) => {
                  if (!projectSearch) return true
                  const search = projectSearch.toLowerCase()
                  return (
                    project.projectId?.toLowerCase().includes(search) ||
                    project.projectName?.toLowerCase().includes(search)
                  )
                })
                .map((project) => (
                <tr key={project.id}>
                  <td>{project.projectId}</td>
                  <td>{project.projectName}</td>
                  <td>{project.department}</td>
                  <td>{project.branch}</td>
                  <td>{project.priorityLevel}</td>
                  <td><span className={`status-badge ${project.status.toLowerCase()}`}>{project.status}</span></td>
                  <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>No projects found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-container">
          <div className="table-header-with-search">
            <h2>Change Requests</h2>
            <input
              type="text"
              placeholder="Search by Project ID or Feature..."
              className="search-input"
              value={changeRequestSearch}
              onChange={(e) => setChangeRequestSearch(e.target.value)}
            />
          </div>
          <table>
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Requested Feature</th>
                <th>Impact Level</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {changeRequests
                .filter((cr) => {
                  if (!changeRequestSearch) return true
                  const search = changeRequestSearch.toLowerCase()
                  return (
                    cr.projectProjectId?.toLowerCase().includes(search) ||
                    cr.requestedFeature?.toLowerCase().includes(search)
                  )
                })
                .map((cr) => (
                <tr key={cr.id}>
                  <td>{cr.projectProjectId}</td>
                  <td>{cr.requestedFeature}</td>
                  <td>{cr.impactLevel}</td>
                  <td><span className={`status-badge ${cr.status.toLowerCase()}`}>{cr.status}</span></td>
                  <td>{new Date(cr.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {changeRequests.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No change requests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showProjectModal && (
        <ProjectModal
          onClose={() => setShowProjectModal(false)}
          onSuccess={handleProjectCreated}
        />
      )}

      {showChangeRequestModal && (
        <ChangeRequestModal
          onClose={() => setShowChangeRequestModal(false)}
          onSuccess={handleChangeRequestCreated}
        />
      )}
    </div>
  )
}

export default LogProject
