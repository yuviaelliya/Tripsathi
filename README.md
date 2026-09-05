# TripSathi - AI-Powered Travel Companion & Multi-Agency Booking Platform

Welcome to **TripSathi**! TripSathi is a startup-grade travel platform designed to connect travelers, tour agencies, and platform administrators in a seamless ecosystem.

---

## 🚀 Core Features

1. **👑 Super Admin Control Center**: Master dashboard for platform owners to approve partner agencies, monitor system-wide revenue, and oversee all tour listings & customer bookings.
2. **🏢 Partner Agency Portal**: Dedicated agency management panel for agencies to publish packages, manage agency bookings, and track sales performance.
3. **🤖 TripSathi AI Itinerary Planner**: Smart AI engine that generates day-by-day travel schedules based on destination, duration, budget, and travel style.
4. **👫 "Find a Sathi" Co-Traveler Community**: Connect solo travelers to share trip costs, cab expenses, and join group tours.
5. **🔍 Advanced Search & Discovery Engine**: Real-time filtering by price range slider, category chips, location, and sorting by rating or price.
6. **🎟️ Promo Code & Dynamic Pricing Breakdown**: Apply discount coupons (`FIRSTTRIP10`, `SATHISPECIAL`) with transparent price breakdowns.
7. **🧾 PDF Invoice Generation**: Instant styled PDF invoice generation and download after booking.
8. **⭐ Traveler Reviews & Ratings**: Community feedback system with star ratings and verified traveler reviews.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, TailwindCSS, Framer Motion, Lucide Icons, React PDF Renderer, React Toastify
- **Backend**: Node.js, Express.js, JSON Web Tokens (JWT), BcryptJS
- **Database**: MongoDB (Mongoose Schema Architecture)

---

## ⚡ Quick Start Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or MongoDB Atlas)

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
*Backend runs at `http://localhost:4000`*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173`*

---

## 🔐 Accounts & Roles

- **Super Admin Login**: Log in with email `admin@tripsathi.com` to access the Super Admin Control Center (`/super-admin`).
- **Agency Partner**: Select "Tour Agency Partner" during registration to access the Agency Dashboard (`/agency-dashboard`).
- **Traveler**: Register as a standard user to explore packages, use AI planning, and find travel buddies.
