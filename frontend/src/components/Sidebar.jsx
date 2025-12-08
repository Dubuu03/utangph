function Sidebar({ currentPage, onPageChange }) {
  const pages = [
    { id: 'members', icon: '👥', label: 'Members' },
    { id: 'add', icon: '➕', label: 'Add Items' },
    { id: 'items', icon: '📋', label: 'All Items' },
    { id: 'settlement', icon: '💰', label: 'Summary' }
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>🏠 UtangPH</h1>
        <p>Shared Expense Tracker</p>
      </div>
      
      <nav className="sidebar-nav">
        {pages.map(page => (
          <button
            key={page.id}
            className={`sidebar-item ${currentPage === page.id ? 'active' : ''}`}
            onClick={() => onPageChange(page.id)}
          >
            <span className="sidebar-icon">{page.icon}</span>
            <span className="sidebar-label">{page.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
