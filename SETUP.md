# UtangPH Setup Guide

## Prerequisites
- Node.js v18+ installed
- MongoDB Atlas account (free tier)

## Quick Start

### 1. MongoDB Atlas Setup
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account and cluster
3. Click **Database Access** → Add New Database User
   - Create username and password (save these!)
4. Click **Network Access** → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
5. Click **Database** → Connect → **Connect your application**
6. Copy the connection string (looks like: `mongodb+srv://...`)

### 2. Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure MongoDB
# Edit .env file and replace with your actual MongoDB URI:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/utangph?retryWrites=true&w=majority

# Start the backend server
npm run dev
```

Backend should now be running on http://localhost:5000

### 3. Frontend Setup (in a new terminal)
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend should now be running on http://localhost:5173

## Verification
1. Open http://localhost:5173 in your browser
2. Add members in the Members section
3. Add items for each member
4. View the expense table and settlement summary

## Common Issues

### Backend won't start
- **Check MongoDB URI**: Make sure your `.env` file has the correct connection string
- **Check password**: Special characters in password might need URL encoding
- **Check IP whitelist**: Ensure 0.0.0.0/0 is added in MongoDB Network Access

### Frontend can't connect to backend
- Make sure backend is running on port 5000
- Check browser console for CORS errors
- Verify the API URL in frontend components is `http://localhost:5000`

### "Cannot find module" errors
- Run `npm install` again in the respective folder
- Delete `node_modules` and `package-lock.json`, then run `npm install`

## Project Structure
```
UtangPH/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── Member.js          # Member schema
│   │   └── Expense.js         # Expense schema
│   ├── routes/
│   │   ├── memberRoutes.js    # Member API endpoints
│   │   └── expenseRoutes.js   # Expense API endpoints
│   ├── .env                   # Environment variables (MongoDB URI)
│   ├── server.js              # Express server
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ExpenseForm.jsx        # Member-specific item forms
    │   │   ├── ExpenseList.jsx        # Centralized expense table
    │   │   ├── MemberManagement.jsx   # Add/remove members
    │   │   └── SettlementSummary.jsx  # Who owes whom
    │   ├── App.jsx            # Main app component
    │   └── App.css            # Styling
    ├── index.html
    ├── vite.config.js
    └── package.json

## Features
✅ Member management with chip-based UI
✅ Member-specific expense forms (each member can add their items)
✅ Centralized table view showing all expenses
✅ Automatic split calculation (splits among all members)
✅ Settlement summary with optimized payment plan
✅ Individual balance tracking
✅ Responsive design

## Technologies Used
- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Styling**: Pure CSS3
