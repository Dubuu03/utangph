# API Testing Guide

## Start the Backend
```bash
cd backend
npm run dev
```

## Test Endpoints

### 1. Create Members
```bash
# Create first member
curl -X POST http://localhost:5000/api/members \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice", "email": "alice@example.com"}'

# Create second member
curl -X POST http://localhost:5000/api/members \
  -H "Content-Type: application/json" \
  -d '{"name": "Bob", "email": "bob@example.com"}'

# Create third member
curl -X POST http://localhost:5000/api/members \
  -H "Content-Type: application/json" \
  -d '{"name": "Charlie", "email": "charlie@example.com"}'
```

### 2. Get All Members
```bash
curl http://localhost:5000/api/members
```

### 3. Create Expense (Replace MEMBER_IDs with actual IDs from step 2)
```bash
# Alice paid $60 for lunch, split between Alice, Bob, and Charlie
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Lunch",
    "amount": 60,
    "paidBy": "ALICE_ID_HERE",
    "splitWith": ["ALICE_ID_HERE", "BOB_ID_HERE", "CHARLIE_ID_HERE"]
  }'
```

### 4. Get Member Balance (Replace MEMBER_ID)
```bash
curl http://localhost:5000/api/members/MEMBER_ID_HERE/balance
```

### 5. Get Settlement Summary
```bash
curl http://localhost:5000/api/expenses/settlements/summary
```

### 6. Get All Expenses
```bash
curl http://localhost:5000/api/expenses
```

## How It Works

1. **Create Members**: Each person using the app is a member
2. **Add Expenses**: When someone pays, record:
   - Description (what was purchased)
   - Amount (total price)
   - Who paid (paidBy)
   - Who to split with (splitWith array)
3. **Calculate Individual Amounts**: 
   - Total amount ÷ number of people in splitWith = individual share
   - If you paid $60 and split with 3 people, each owes $20
4. **Check Balances**:
   - Positive balance = others owe you
   - Negative balance = you owe others
   - Use `/members/:id/balance` to see individual breakdown
   - Use `/expenses/settlements/summary` to see who owes whom

## Example Scenario

1. Alice, Bob, and Charlie are members
2. Alice pays $60 for lunch, split 3 ways
   - Each person owes $20
   - Alice's balance: +$40 (she paid $60 but only owes $20)
   - Bob's balance: -$20 (he owes Alice)
   - Charlie's balance: -$20 (he owes Alice)
3. Bob pays $30 for coffee, split 3 ways
   - Each person owes $10
   - Bob's balance updates: -$20 + $20 = $0
   - Alice's balance: +$40 - $10 = +$30
   - Charlie's balance: -$20 - $10 = -$30
