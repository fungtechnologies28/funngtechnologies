# Fung Technologies - Phone Trading Platform

A comprehensive e-commerce platform for buying, selling, trading in, and repairing phones and accessories.

## 🚀 Features

- **Buy & Sell**: Browse and purchase new/used phones
- **Trade-In**: Trade old phones for credit towards new purchases
- **Repair Service**: Book phone repair appointments
- **Membership Program**: Earn and redeem loyalty points
- **User Dashboard**: Manage orders, bookings, and profile
- **Admin Panel**: Manage products, orders, and bookings

## 📁 Project Structure

```
funngtechnologies/
├── frontend/          # React.js application
├── backend/           # Node.js + Express API
├── database/          # PostgreSQL schema
└── README.md
```

## 🛠️ Tech Stack

- **Frontend**: React.js, Axios, React Router
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT

## 📋 Getting Started

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Database Setup
```bash
psql -U postgres
CREATE DATABASE fung_technologies;
psql -U postgres -d fung_technologies -f database/schema.sql
```

## 📡 API Endpoints

See `backend/README.md` for complete API documentation.

## 📄 License

All Rights Reserved © 2025 Fung Technologies
