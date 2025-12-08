import { useState, useEffect } from 'react'
import './App.css'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import ItemsList from './components/ItemsList'
import MemberManagement from './components/MemberManagement'
import BottomNav from './components/BottomNav'

function App() {
  const [expenses, setExpenses] = useState([])
  const [members, setMembers] = useState([])
  const [currentPage, setCurrentPage] = useState('members')

  useEffect(() => {
    // Fetch members and expenses from backend
    fetchMembers()
    fetchExpenses()
  }, [])

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${API_URL}/members`)
      if (response.ok) {
        const data = await response.json()
        setMembers(data)
      }
    } catch (error) {
      console.error('Error fetching members:', error)
    }
  }

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${API_URL}/expenses`)
      if (response.ok) {
        const data = await response.json()
        setExpenses(data)
      }
    } catch (error) {
      console.error('Error fetching expenses:', error)
    }
  }

  const addExpense = async (expense) => {
    try {
      const response = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense)
      })
      if (response.ok) {
        fetchExpenses()
      }
    } catch (error) {
      console.error('Error adding expense:', error)
    }
  }

  const addMember = async (member) => {
    try {
      const response = await fetch(`${API_URL}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member)
      })
      if (response.ok) {
        fetchMembers()
      }
    } catch (error) {
      console.error('Error adding member:', error)
    }
  }

  return (
    <div className="app mobile-app">
      <header className="app-header">
        <h1>🏠 UtangPH</h1>
        <p>Shared Expense Tracker</p>
      </header>

      <main className="app-content">
        {currentPage === 'members' && (
          <MemberManagement 
            members={members} 
            onAddMember={addMember} 
            onRefresh={fetchMembers} 
          />
        )}
        
        {currentPage === 'add' && (
          <ExpenseForm 
            members={members} 
            onAddExpense={addExpense} 
          />
        )}
        
        {currentPage === 'items' && (
          <ItemsList 
            expenses={expenses} 
            members={members}
            onRefresh={fetchExpenses}
          />
        )}
        
        {currentPage === 'settlement' && (
          <ExpenseList 
            expenses={expenses} 
            members={members}
          />
        )}
      </main>

      <BottomNav currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  )
}

export default App
