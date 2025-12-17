import { TrendingUp, ArrowDown, ArrowUp, DollarSign, Users } from 'lucide-react'

function SettlementSummary({ expenses, members }) {
  const calculateBalances = () => {
    // Initialize balances for each member
    const balances = {}
    members.filter(member => member != null).forEach(member => {
      balances[member._id] = { name: member.name, balance: 0 }
    })

    // Calculate balances
    expenses.forEach(expense => {
      const sharePerPerson = expense.amount / expense.splitWith.length
      
      // Get paidBy ID (handle both populated and non-populated)
      const paidById = typeof expense.paidBy === 'object' ? expense.paidBy._id : expense.paidBy
      
      // The person who paid gets credited
      if (balances[paidById]) {
        balances[paidById].balance += expense.amount
      }
      
      // Everyone who splits the expense gets debited
      expense.splitWith.forEach(member => {
        if (!member) return
        // Handle both populated and non-populated
        const memberId = typeof member === 'object' ? member._id : member
        if (balances[memberId]) {
          balances[memberId].balance -= sharePerPerson
        }
      })
    })

    return balances
  }

  const calculateSettlements = () => {
    const balances = calculateBalances()
    const settlements = []
    
    // Separate debtors and creditors
    const debtors = []
    const creditors = []
    
    Object.entries(balances).forEach(([id, data]) => {
      if (data.balance < -0.01) {
        debtors.push({ id, name: data.name, amount: -data.balance })
      } else if (data.balance > 0.01) {
        creditors.push({ id, name: data.name, amount: data.balance })
      }
    })

    // Match debtors with creditors
    let i = 0, j = 0
    while (i < debtors.length && j < creditors.length) {
      const debt = debtors[i].amount
      const credit = creditors[j].amount
      const settleAmount = Math.min(debt, credit)

      if (settleAmount > 0.01) {
        settlements.push({
          from: debtors[i].name,
          to: creditors[j].name,
          amount: settleAmount
        })
      }

      debtors[i].amount -= settleAmount
      creditors[j].amount -= settleAmount

      if (debtors[i].amount < 0.01) i++
      if (creditors[j].amount < 0.01) j++
    }

    return { balances, settlements }
  }

  const { balances, settlements } = calculateSettlements()
  
  // Calculate statistics
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const totalDebt = Object.values(balances).reduce((sum, data) => sum + (data.balance < 0 ? -data.balance : 0), 0)
  const totalCredit = Object.values(balances).reduce((sum, data) => sum + (data.balance > 0 ? data.balance : 0), 0)

  return (
    <div>
      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Expenses</h3>
            <p className="stat-value">₱{totalExpenses.toFixed(2)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
            <ArrowDown size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Debt</h3>
            <p className="stat-value" style={{ color: '#ef4444' }}>₱{totalDebt.toFixed(2)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <ArrowUp size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Credit</h3>
            <p className="stat-value" style={{ color: '#10b981' }}>₱{totalCredit.toFixed(2)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>Active Members</h3>
            <p className="stat-value">{members.length}</p>
          </div>
        </div>
      </div>

      {/* Settlement Plan */}
      <div className="card settlement-summary">
        <h2><TrendingUp size={28} style={{ display: 'inline-block', marginRight: '8px' }} /> Settlement Plan</h2>
        {settlements.length === 0 ? (
          <div className="empty-state">
            <TrendingUp size={80} strokeWidth={1.5} opacity={0.4} />
            <p>All settled up! 🎉</p>
            <small>No outstanding debts between members</small>
          </div>
        ) : (
          <div className="settlement-transactions">
            {settlements.map((settlement, index) => (
              <div key={index} className="settlement-transaction">
                <div className="settlement-flow">
                  <div className="settlement-person debtor">
                    <span className="person-label">From</span>
                    <strong>{settlement.from}</strong>
                  </div>
                  <div className="settlement-arrow">
                    <ArrowUp size={24} style={{ transform: 'rotate(90deg)' }} />
                  </div>
                  <div className="settlement-person creditor">
                    <span className="person-label">To</span>
                    <strong>{settlement.to}</strong>
                  </div>
                </div>
                <div className="settlement-amount-large">
                  ₱{settlement.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Individual Balances Integrated */}
      <div className="card">
        <h2>Individual Balances</h2>
        <div className="balances-list">
          {Object.entries(balances)
            .sort(([, a], [, b]) => b.balance - a.balance)
            .map(([id, data]) => (
            <div key={id} className="balance-item">
              <div className="balance-info">
                <strong className="member-name">{data.name}</strong>
                <span className="balance-status" style={{ 
                  color: data.balance >= 0 ? '#10b981' : '#ef4444' 
                }}>
                  {data.balance >= 0 ? (
                    <><ArrowUp size={16} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} /> Should receive</>
                  ) : (
                    <><ArrowDown size={16} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} /> Owes</>
                  )}
                </span>
              </div>
              <div className="balance-amount" style={{ 
                color: data.balance >= 0 ? '#10b981' : '#ef4444',
                fontWeight: 800
              }}>
                {data.balance >= 0 ? '+' : ''}₱{data.balance.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SettlementSummary
