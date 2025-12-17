import { useState, useEffect } from 'react'
import { Users, Lock, Plus, ArrowRight, UserPlus, Activity } from 'lucide-react'
import './GroupSelection.css'

function GroupSelection({ onGroupSelect }) {
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      const response = await fetch(`${API_URL}/groups`)
      if (response.ok) {
        const data = await response.json()
        setGroups(data)
      }
    } catch (error) {
      console.error('Error fetching groups:', error)
      setError('Failed to load groups')
    }
  }

  const handleGroupClick = (group) => {
    setSelectedGroup(group)
    setPassword('')
    setError('')
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/groups/${selectedGroup._id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store group info in localStorage
        localStorage.setItem('currentGroup', JSON.stringify(data.group))
        onGroupSelect(data.group)
      } else {
        setError(data.message || 'Incorrect password')
      }
    } catch (error) {
      console.error('Error verifying password:', error)
      setError('Failed to verify password')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setSelectedGroup(null)
    setPassword('')
    setError('')
  }

  if (showCreateForm) {
    return (
      <CreateGroupForm
        onCancel={() => setShowCreateForm(false)}
        onSuccess={(group) => {
          setShowCreateForm(false)
          fetchGroups()
          onGroupSelect(group)
        }}
        API_URL={API_URL}
      />
    )
  }

  return (
    <div className="group-selection-container">
      {!selectedGroup ? (
        <div className="groups-view">
          <div className="view-header">
            <div className="header-content">
              <h1>UtangPH</h1>
              <p>Select a group to manage expenses</p>
            </div>
            <button
              className="create-button"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus size={20} />
              Create New Group
            </button>
          </div>

          {groups.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Users size={64} />
              </div>
              <h2>No groups yet</h2>
              <p>Create your first group to start tracking expenses with friends</p>
              <button
                className="empty-cta-button"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus size={20} />
                Create Your First Group
              </button>
            </div>
          ) : (
            <div className="cards-grid">
              {groups.map((group) => (
                <div
                  key={group._id}
                  className="group-card"
                  onClick={() => handleGroupClick(group)}
                >
                  <div className="card-icon">
                    <Users size={32} />
                  </div>
                  <div className="card-content">
                    <h3>{group.name}</h3>
                    <div className="card-info">
                      <span className="member-count">
                        {group.memberCount} {group.memberCount === 1 ? 'member' : 'members'}
                      </span>
                    </div>
                  </div>
                  <div className="card-action">
                    <ArrowRight size={20} />
                  </div>
                </div>
              ))}
              
              <div
                className="group-card create-card"
                onClick={() => setShowCreateForm(true)}
              >
                <div className="card-icon">
                  <Plus size={32} />
                </div>
                <div className="card-content">
                  <h3>Create New Group</h3>
                  <p>Start tracking expenses</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="password-modal-overlay">
          <div className="password-modal">
            <div className="modal-icon">
              <Lock size={48} />
            </div>
            
            <div className="modal-header">
              <h2>{selectedGroup.name}</h2>
              <p>{selectedGroup.memberCount} {selectedGroup.memberCount === 1 ? 'member' : 'members'}</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="password-form">
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter group password"
                  required
                  autoFocus
                />
              </div>

              {error && (
                <div className="error-message">
                  <span>{error}</span>
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={loading || !password}
                >
                  {loading ? (
                    <span>Verifying...</span>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function CreateGroupForm({ onCancel, onSuccess, API_URL }) {
  const [groupName, setGroupName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: groupName,
          password,
          createdBy: 'User'
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Store group info in localStorage
        localStorage.setItem('currentGroup', JSON.stringify(data))
        onSuccess(data)
      } else {
        setError(data.message || 'Failed to create group')
      }
    } catch (error) {
      console.error('Error creating group:', error)
      setError('Failed to create group')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="group-selection-container">
      <div className="group-selection-card">
        <div className="group-selection-header">
          <h1>Create New Group</h1>
          <p>Set up a new expense tracking group</p>
        </div>

        <form onSubmit={handleSubmit} className="create-group-form">
          <div className="form-group">
            <label htmlFor="groupName">Group Name</label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g., EOG CONDO, Family Expenses"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <Lock size={18} />
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Set a password for this group"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <Lock size={18} />
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !groupName || !password || !confirmPassword}
            >
              {loading ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GroupSelection
