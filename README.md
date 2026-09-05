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
- **Backend**: 100% Java (Spring Boot 3, Spring Security, JWT, JPA / Hibernate)
- **Database**: MySQL 8 (Auto Schema DDL & Data Seeder)
- **Containerization**: Docker & Docker Compose

---

## 🐳 Shortest Path to Run (One-Command Setup with Docker)

Anyone (including a friend cloning the repo) can run the entire project with **zero dependencies required** (no need to install Java, Maven, Node.js, or MySQL manually). Only **Docker Desktop** is required!

### Step 1: Clone the Repository
```bash
git clone https://github.com/yuviaelliya/Tripsathi.git
cd Tripsathi
```

### Step 2: Start All Services with Docker
```bash
docker compose up --build
```

That's it!
- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Java Spring Boot API**: [http://localhost:4000](http://localhost:4000)
- **MySQL Database**: `localhost:3306` (Credentials: `root` / `password`)

---

## 💻 Manual Setup Instructions (Without Docker)

### Prerequisites
- Java JDK 17+
- MySQL Server (running on port 3306 with user `root` / password `password`)
- Node.js 18+

### 1. Run Java Backend
```bash
cd backend
./run-backend.sh          # Linux / macOS (or ./run-backend.sh --h2 for instant H2 database)
run-backend.bat           # Windows
```

### 2. Run React Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Accounts & Seeder Data

On startup, the system automatically initializes the database with:
- **Default Super Admin**: Log in with email `kishanaelliya@gmail.com` / password `Yuvii@9708`
- **Seeded Tours**: 6 default packages (Manali, Goa, Kerala, Jaipur, Leh Ladakh, Rishikesh)
- **Seeded Coupons**: `FIRSTTRIP10`, `SATHISPECIAL`
