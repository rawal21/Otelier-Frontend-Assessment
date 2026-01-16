# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Pass environment variables at build time (Vite requires this for production builds)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_HOTELBEDS_API_KEY
ARG VITE_HOTELBEDS_API_SECRET

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_HOTELBEDS_API_KEY=$VITE_HOTELBEDS_API_KEY
ENV VITE_HOTELBEDS_API_SECRET=$VITE_HOTELBEDS_API_SECRET

RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# Copy build output to nginx public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config to handle SPA routing and API proxying
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
