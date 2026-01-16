import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import StatusUpdateModal from '../components/StatusUpdateModal'
import DeleteProjectModal from '../components/DeleteProjectModal'
import Spinner from '../components/Spinner'
import './Projects.css'

const Projects = () => {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [changeRequests, setChangeRequests] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedChangeRequest, setSelectedChangeRequest] = useState(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isChangeRequest, setIsChangeRequest] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(null)
  const [projectSearch, setProjectSearch] = useState('')
  const [changeRequestSearch, setChangeRequestSearch] = useState('')
  
  const isAdmin = user?.role === 'ADMIN'

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

  const handleStatusUpdate = (id, isChangeReq = false) => {
    setUpdatingStatus(id)
    if (isChangeReq) {
      setSelectedChangeRequest(id)
      setIsChangeRequest(true)
    } else {
      setSelectedProject(id)
      setIsChangeRequest(false)
    }
    setShowStatusModal(true)
  }
  
  const handleStatusUpdated = () => {
    setUpdatingStatus(null)
    setShowStatusModal(false)
    setSelectedProject(null)
    setSelectedChangeRequest(null)
    fetchData()
  }

  const handleDeleteProject = (project) => {
    setSelectedProject(project)
    setShowDeleteModal(true)
  }

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false)
    setSelectedProject(null)
    fetchData()
  }


  const STATUS_OPTIONS = [
    'PENDING', 'ACCEPTED', 'REJECTED', 'DISCUSSION', 'DOCUMENTATION',
    'DEVELOPERS_DISCUSSION', 'TESTING', 'INT', 'QA', 'UAT',
    'QA_SIGN_OFF_IN_PROGRESS', 'QA_SIGN_OFF_COMPLETE',
    'RELEASE_NOTES_PREPARED', 'RELEASED_TO_PRODUCTION'
  ]

  return (
    <div className="projects-page">
      <h1>Projects Management</h1>

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
                <th>Files</th>
                <th>Logged By</th>
                <th>Actions</th>
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
                  <td>
                    {project.attachments && project.attachments.length > 0 ? (
                      <div className="files-list">
                        {project.attachments.map((file) => (
                          <div key={file.id} className="file-link">
                            <span 
                              className="file-name" 
                              onClick={() => window.open(`http://localhost:8080/api/files/view/${file.id}`, '_blank')}
                              title="Click to view"
                            >
                              {file.fileName}
                            </span>
                            <button
                              className="file-download-btn"
                              onClick={async () => {
                                try {
                                  const response = await api.get(`/api/files/download/${file.id}`, {
                                    responseType: 'blob'
                                  })
                                  const url = window.URL.createObjectURL(new Blob([response.data]))
                                  const link = document.createElement('a')
                                  link.href = url
                                  link.setAttribute('download', file.fileName)
                                  document.body.appendChild(link)
                                  link.click()
                                  link.remove()
                                  window.URL.revokeObjectURL(url)
                                } catch (error) {
                                  console.error('Download error:', error)
                                  alert('Failed to download file')
                                }
                              }}
                              title="Download"
                            >
                              ↓
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: '#999' }}>No files</span>
                    )}
                  </td>
                  <td>{project.loggedBy}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-button"
                        onClick={() => handleStatusUpdate(project.id, false)}
                        disabled={updatingStatus === project.id}
                      >
                        {updatingStatus === project.id ? (
                          <>
                            <Spinner size="small" /> Updating...
                          </>
                        ) : (
                          'Update Status'
                        )}
                      </button>
                      {isAdmin && (
                        <button 
                          className="delete-action-button"
                          onClick={() => handleDeleteProject(project)}
                          title="Delete Project"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
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
                <th>Files</th>
                <th>Logged By</th>
                <th>Actions</th>
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
                  <td>
                    {cr.attachments && cr.attachments.length > 0 ? (
                      <div className="files-list">
                        {cr.attachments.map((file) => (
                          <div key={file.id} className="file-link">
                            <span 
                              className="file-name" 
                              onClick={() => window.open(`http://localhost:8080/api/files/view/${file.id}`, '_blank')}
                              title="Click to view"
                            >
                              {file.fileName}
                            </span>
                            <button
                              className="file-download-btn"
                              onClick={async () => {
                                try {
                                  const response = await api.get(`/api/files/download/${file.id}`, {
                                    responseType: 'blob'
                                  })
                                  const url = window.URL.createObjectURL(new Blob([response.data]))
                                  const link = document.createElement('a')
                                  link.href = url
                                  link.setAttribute('download', file.fileName)
                                  document.body.appendChild(link)
                                  link.click()
                                  link.remove()
                                  window.URL.revokeObjectURL(url)
                                } catch (error) {
                                  console.error('Download error:', error)
                                  alert('Failed to download file')
                                }
                              }}
                              title="Download"
                            >
                              ↓
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: '#999' }}>No files</span>
                    )}
                  </td>
                  <td>{cr.loggedBy}</td>
                  <td>
                    <button 
                      className="action-button"
                      onClick={() => handleStatusUpdate(cr.id, true)}
                      disabled={updatingStatus === cr.id}
                    >
                      {updatingStatus === cr.id ? (
                        <>
                          <Spinner size="small" /> Updating...
                        </>
                      ) : (
                        'Update Status'
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showStatusModal && (
        <StatusUpdateModal
          id={isChangeRequest ? selectedChangeRequest : selectedProject}
          isChangeRequest={isChangeRequest}
          onClose={() => {
            setShowStatusModal(false)
            setSelectedProject(null)
            setSelectedChangeRequest(null)
          }}
          onSuccess={handleStatusUpdated}
        />
      )}

      {showDeleteModal && selectedProject && (
        <DeleteProjectModal
          project={selectedProject}
          onClose={() => {
            setShowDeleteModal(false)
            setSelectedProject(null)
          }}
          onSuccess={handleDeleteSuccess}
        />
      )}

    </div>
  )
}

export default Projects
