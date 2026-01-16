# LuxStay - Premium Hospitality Frontend

A production-grade luxury hospitality frontend application built with React 18, Redux Toolkit, and Framer Motion. This project demonstrates a clean architecture for hotel searching, filtering, and comparison, integrated with real-world APIs.

## 🚀 Features

- **Authentication & RBAC**: Secure Login/Signup powered by Supabase with built-in **Role-Based Access Control** (Admin vs User).
- **Hotel Search**: Real-time searching and filtering for luxury stays with smart destination matching.
- **Comparison Engine**: Select up to 3 hotels and compare them side-by-side with dynamic, interactive charts.
- **Data Visualization**: Price, Rating, and Amenity comparison using Recharts.
- **Modern UI/UX**: Premium dark-mode aesthetic with silky-smooth micro-animations.
- **Containerization**: Fully Dockerized for standardized production deployment.

## 🛠️ Tech Stack

- **Framework**: React 18+ (Vite)
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS v4 (CSS-first)
- **Animations**: Framer Motion
- **Database/Auth**: Supabase
- **Charts**: Recharts
- **API**: Hotelbeds API (Integrated with SHA256 Signature Security)

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- Docker (Optional, for containerized run)

### Standard Installation
1. Install dependencies: `npm install`
2. Create `.env` from the provided keys (Supabase & Hotelbeds).
3. Run dev server: `npm run dev`

### Docker Deployment
Run the entire stack (Node build + Nginx Proxy) with one command:
```bash
docker-compose up --build
```
The app will be available at `http://localhost:8080`.

## 🏗️ Technical Architecture

### 1. Modular Routing (`/src/router`)
Clean separation of concern between `guest` (public/auth-only) and `private` (protected) routes.

### 2. Feature-First Components
- **Auth**: Modular `LoginForm` and `SignupForm` in `/src/components/auth`.
- **Search**: Specialized UI logic in `/src/components/search` (Grids, Skeletons, Filters).
- **Admin**: Role-specific `AdminFilters` that appear dynamically for authorized users.

### 3. API Resilience
The `hotelApi` implements a 4-layer destination matching logic:
- **Smart Dictionary**: Pre-mapped major cities.
- **Fuzzy Search**: Resolving city names through the Hotelbeds Content API.
- **Auto-Formatting**: Strict `YYYY-MM-DD` payload normalization.
- **Premium Fallbacks**: High-quality mock data pool for offline/keyless demos.

## 🛡️ Admin Access (RBAC)
For demonstration purposes, users signing up with an email ending in `@luxstay.com` are automatically granted **Admin** privileges, unlocking specialized filters and dashboard tools.

---
Built with ❤️ for High-End Hospitality.
