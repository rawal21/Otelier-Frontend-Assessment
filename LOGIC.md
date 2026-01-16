# Technical Logic & Package Choices

This document explains the technical decisions and architecture behind LuxStay.

## 🧠 State Management: Redux Toolkit + RTK Query

**Why Redux Toolkit?**
- **Standardization**: It is the industry standard for large-scale React applications.
- **DevTools**: Sophisticated debugging capabilities for complex state transitions (like hotel comparison).
- **Boilerplate Reduction**: Slices handle actions and reducers in one place.

**Why RTK Query?**
- **Declarative Fetching**: Automatically handles loading/error states and caching.
- **Real API Integration**: The app implements a real-world multi-step fetch using **Hotelbeds API**. It handles time-based SHA256 signature generation and structured availability searches.

## 🔐 Authentication Flow: Supabase + Redux

The authentication system is designed to be secure, persistent, and developer-friendly. Here is how it works step-by-step:

### 1. Initialization (`utils/supabase.ts`)
We initialize the Supabase client using environment variables. To prevent the app from crashing during the initial setup (if keys are missing), we use placeholder values and log a warning.

### 2. State Management (`store/authSlice.ts`)
We use a Redux slice to track the current `user`, `loading` status, and any `authErrors`. This allows any component in the app to instantly know if a user is logged in.

### 3. Global Listener (`App.tsx`)
In the root `App` component, we implement two critical checks:
- **On Mount**: We call `supabase.auth.getSession()` to check if a user is already logged in (via cookies/localStorage).
- **On Change**: We subscribe to `onAuthStateChange`. Whenever a user logs in, signs up, or logs out, Supabase notifies us, and we automatically update the Redux state.

### 4. Protected Routes (`components/ProtectedRoute.tsx`)
This is a wrapper component. It checks the Redux state:
- If `loading` is true, it shows a spinner.
- If `user` is null, it redirects the user to `/login` and remembers the page they were trying to visit (using React Router's `state`).
- If `user` exists, it renders the requested page.

### 5. Sign In / Sign Out
- **Login**: The `Login.tsx` page uses `supabase.auth.signInWithPassword`. On success, the global listener (Step 3) takes over and updates the UI.
- **Logout**: The `Navbar.tsx` calls `supabase.auth.signOut()`, which triggers the listener to clear the Redux state and redirect the user.

---

## 🏨 Hotel Search Optimization (Hotelbeds API)

The hotel search integration is built to be resilient, performant, and worldwide-ready.

### 1. Authentication & Signature Generation
Hotelbeds requires a dynamic SHA256 signature (`X-Signature`) generated from your API Key, Secret, and the current Unix timestamp. We handle this client-side using `crypto-js` while proxying requests through Vite to avoid CORS.

### 2. Multi-Layer Destination Resolution
Hotelbeds uses specific 3-letter destination codes (e.g., `PAR` for Paris). To ensure users can search for any city name, we implemented a 4-layer resolution strategy:
- **Smart Dictionary**: Instant mappings for major global hubs (London, Dubai, Tokyo, etc.).
- **Local Cache**: Destination codes are stored in `localStorage` once resolved.
- **Content API Search**: If not found in the dictionary, we search the Hotelbeds Content API for matching destination names.
- **Failsafe Fallback**: As a last resort, we use the first 3 letters of the search term (the most common format for their codes).

### 3. Payload Formatting & Normalization
- **Strict Date Formatting**: All dates are normalized to `YYYY-MM-DD` using a `formatDate` helper to prevent 400 Bad Request errors.
- **Data Quality**: We request up to 50 results per search and apply a `minCategory: 4` filter to ensure high-quality luxury results.
- **Image Handling**: Because the API "light" responses often lack multiple high-res images, we use a curated `premiumImages` pool that intelligently rotates luxury assets, ensuring a premium visual experience.

### 4. Resilience (Mock Fallback)
If API keys are missing, rate limits are hit, or a network error occurs, the system automatically falls back to an enhanced `getMockHotels` generator. This ensures the app is always functional and presentable for demos.

---

## 🖼️ UI & Motion: Tailwind + Framer Motion

**Why Tailwind CSS?**
- **Rapid Prototyping**: Zero-config styling that scales perfectly.
- **Consistency**: Design tokens ensure a premium, unified aesthetic.

**Why Framer Motion?**
- **Declarative Animations**: Makes it easy to implement complex page transitions and micro-interactions (e.g., HotelCard hover effects).
- **Performance**: GPU-accelerated animations for a silky-smooth feel.

## 📊 Visualization: Recharts

**Why Recharts?**
- **Composable**: Perfect for React-based dashboards.
- **Responsive**: Built-in containers for fluid layouts.
- **Customizable**: Allows for premium styling that matches the dark-mode aesthetic.

## 🛡️ Stability & Code Quality

- **Error Boundaries**: Protects the app from crashing on unexpected API errors.
- **Code Splitting**: Uses `React.lazy` for heavy components (Charts, Search) to improve initial load time.
- **Validation**: `React Hook Form` + `Yup` ensures clean, error-free user input for search and authentication.

## 🐳 Containerization & Production Serving

To ensure "it works on my machine" everywhere, we use Docker:

- **Multi-Stage Build**: We use a `node:alpine` image to build the optimized production assets and then transfer them to a lightweight `nginx:alpine` image for serving.
- **Environment Baking**: Since Vite requires environment variables at build time, the Docker pipeline passes these through `docker-compose` as `build-args`.
- **Nginx Reverse Proxy**: In production, we use a custom `nginx.conf` to serve the SPA and proxy API requests to Hotelbeds, bypassing the need for a local node proxy.

---
