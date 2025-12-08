import { useState } from 'react'

function MemberManagement({ members, onAddMember, onRefresh }) {
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!name.trim()) {
      alert('Please enter a name')
      return
    }

    onAddMember({ name: name.trim() })
    setName('')
  }

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

  const deleteMember = async (id) => {
    if (!confirm('Are you sure? This will affect expense calculations.')) return
    
    try {
      const response = await fetch(`${API_URL}/members/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        onRefresh()
      }
    } catch (error) {
      console.error('Error deleting member:', error)
    }
  }

  return (
    <div className="card members-card">
      <h2>Members</h2>
      <div className="members-container">
        <div className="member-chips">
          {members.length === 0 ? (
            <p className="empty-members">No members yet. Add members below to get started!</p>
          ) : (
            members.map(member => (
              <div key={member._id} className="member-chip">
                <span>{member.name}</span>
                <button 
                  onClick={() => deleteMember(member._id)} 
                  className="remove-chip"
                  title="Remove member"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="add-member-form">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Add new member..."
            className="member-input"
          />
          <button type="submit" className="primary">Add</button>
        </form>
      </div>
    </div>
  )
}

export default MemberManagement
