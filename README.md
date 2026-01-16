# LuxStay - Premium Hospitality Frontend

A production-grade hospitality frontend application built with React 18, Redux Toolkit, and Framer Motion. This project demonstrates a clean architecture for hotel searching, filtering, and comparison.

## 🚀 Features

- **Authentication**: Secure Login/Signup powered by Supabase/Auth0.
- **Hotel Search**: Real-time searching and filtering for luxury stays.
- **Comparison Engine**: Select up to 3 hotels and compare them side-by-side with dynamic charts.
- **Data Visualization**: Price and Rating comparison using Recharts.
- **Modern UI/UX**: Premium dark-mode aesthetic with smooth Framer Motion animations.
- **Responsive Design**: Fully responsive layout for mobile and desktop.
- **Persistence**: Selected hotels are saved to localStorage.
- **Performance**: Code-splitting with Lazy Loading and Suspense for optimized bundle size.

## 🛠️ Tech Stack

- **Framework**: React 18+ (Vite)
- **Language**: TypeScript
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS v4 (CSS-first configuration)
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Forms**: React Hook Form + Yup
- **Auth**: Supabase

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Clean Architecture

The project follows a modular structure:
- `/src/components`: Atomic UI components.
- `/src/pages`: Feature-based route components.
- `/src/store`: Redux slices and RTK Query API definitions.
- `/src/utils`: Service initializations and helpers.
- `/src/hooks`: Custom reusable logic.
