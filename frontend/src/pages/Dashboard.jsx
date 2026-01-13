import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import './Dashboard.css'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/api/dashboard')
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Projects</h3>
          <p className="stat-value">{stats?.totalProjects || 0}</p>
        </div>
        <div className="stat-card">
          <h3>New Project Requests</h3>
          <p className="stat-value">{stats?.newProjectRequests || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Change Requests</h3>
          <p className="stat-value">{stats?.changeRequests || 0}</p>
        </div>
      </div>

      <div className="tables-section">
        <div className="table-container">
          <h2>New Project Requests</h2>
          <table>
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Project Name</th>
                <th>Department</th>
                <th>Branch</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Logged By</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats?.newProjectRequestsList?.map((project) => (
                <tr key={project.id}>
                  <td>{project.projectId}</td>
                  <td>{project.projectName}</td>
                  <td>{project.department}</td>
                  <td>{project.branch}</td>
                  <td>{project.priorityLevel}</td>
                  <td><span className={`status-badge ${project.status.toLowerCase()}`}>{project.status}</span></td>
                  <td>{project.loggedBy}</td>
                  <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {(!stats?.newProjectRequestsList || stats.newProjectRequestsList.length === 0) && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>No projects found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-container">
          <h2>Change Requests</h2>
          <table>
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Requested Feature</th>
                <th>Impact Level</th>
                <th>Status</th>
                <th>Logged By</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats?.changeRequestsList?.map((cr) => (
                <tr key={cr.id}>
                  <td>{cr.projectProjectId}</td>
                  <td>{cr.requestedFeature}</td>
                  <td>{cr.impactLevel}</td>
                  <td><span className={`status-badge ${cr.status.toLowerCase()}`}>{cr.status}</span></td>
                  <td>{cr.loggedBy}</td>
                  <td>{new Date(cr.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {(!stats?.changeRequestsList || stats.changeRequestsList.length === 0) && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>No change requests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
