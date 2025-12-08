# 🏠 UtangPH - Shared Expense Tracker

Track shared expenses and settle up with your roommates easily!

## ✨ Features

- **Member Management**: Add and remove members
- **Expense Tracking**: Each member can add items they purchased
- **Flexible Splitting**: Choose who splits each expense
- **Edit & Delete**: Modify or remove items anytime
- **Settlement Matrix**: See who owes whom at a glance
- **Individual Balances**: Track each person's net balance
- **Mobile Responsive**: Works great on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd UtangPH
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env and add your MongoDB connection string
   npm run dev
   ```

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env if needed (default: http://localhost:3000/api)
   npm run dev
   ```

4. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 📦 Deployment to Vercel

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deployment Steps

1. **Deploy Backend**
   - Push backend to GitHub
   - Import to Vercel
   - Add environment variables (MONGODB_URI, PORT, FRONTEND_URL)
   - Deploy

2. **Deploy Frontend**
   - Push frontend to GitHub
   - Import to Vercel
   - Add VITE_API_URL environment variable
   - Deploy

3. **Update CORS**
   - Add frontend URL to backend's FRONTEND_URL env variable
   - Redeploy backend

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- CSS3 (Custom styling)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS enabled

## 📱 How to Use

1. **Add Members**: Start by adding all roommates
2. **Add Items**: Each person adds items they purchased
3. **Select Split**: For each item, select who will split the cost
4. **View Summary**: Check the settlement matrix to see who owes whom
5. **Edit/Delete**: Modify or remove items as needed
6. **Settle Up**: Use the settlement summary to pay each other

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
FRONTEND_URL=http://localhost:5173  # or your production URL
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api  # or your production API URL
```

## 📂 Project Structure

```
UtangPH/
├── backend/
│   ├── config/         # Database configuration
│   ├── models/         # Mongoose models
│   ├── routes/         # Express routes
│   ├── server.js       # Entry point
│   └── vercel.json     # Vercel config
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── App.jsx     # Main app
│   │   └── App.css     # Styles
│   └── vite.config.js  # Vite config
└── README.md
```

## 🤝 Contributing

Feel free to fork, improve, and submit pull requests!

## 📄 License

MIT License - feel free to use this project however you'd like!

## 💡 Tips

- **MongoDB Atlas**: Use the free tier for development
- **Vercel**: Both frontend and backend can be deployed for free
- **CORS**: Make sure to update FRONTEND_URL in production
- **Mobile**: The app is fully responsive and works great on phones

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill the process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port in .env
PORT=3001
```

### MongoDB connection error
- Check your MongoDB URI in .env
- Ensure IP whitelist includes 0.0.0.0/0 for Vercel
- Verify database user credentials

### CORS errors
- Make sure FRONTEND_URL is set correctly in backend
- Check that API_URL in frontend matches backend URL

---

Made with ❤️ for roommates who want to keep track of shared expenses!
