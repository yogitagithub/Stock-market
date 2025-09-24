Stock Market Dashboard (MERN)
A full-stack MERN application for **real-time stock market data visualization**.  
The project includes:

- **stocks-client** → React frontend (with Chart.js, WebSockets)
- **stocks-server** → Node/Express backend (with Socket.IO, Alpha Vantage adapter + mock mode)

---

## Features
- Real-time stock price updates
- Interactive charts (intraday or daily candles)
- Watchlist with add/remove symbols
- Configurable polling intervals
- Mock mode for demo/testing without API limits

---

## Project Structure
Stock-market/
├── stocks-client/ # React frontend
├── stocks-server/ # Node/Express backend
└── .gitignore

## Setup

### Clone the repository

git clone https://github.com/yogitagithub/Stock-market.git
cd Stock-market
Install dependencies: cd stocks-client
npm install

cd ../stocks-server
npm install
Environment variables: stocks-server/.env
PORT=5001
CLIENT_ORIGIN=http://localhost:3000

# Alpha Vantage API key
ALPHA_VANTAGE_KEY=YOUR_KEY_HERE

# Polling config
POLL_INTERVAL_MS=60000
MIN_POLL_MS=60000

# Flags
USE_DAILY=true
USE_MOCK=true

stocks-client/.env
REACT_APP_API_BASE=http://localhost:5001

## Backend (stocks-server): 
cd stocks-server
npm run dev
Server starts at: http://localhost:5001

## Frontend (stocks-client): 
cd stocks-client
npm start
Client runs at: http://localhost:3000


