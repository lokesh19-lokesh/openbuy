# OpenBuy - Multi-Vendor Marketplace

This repository contains the codebase for OpenBuy, an e-commerce marketplace modernized completely into a serverless Edge architecture:
- **Frontend**: React (Vite, Context API), TailwindCSS 4, Lucide React setup inside `/frontend`.
- **Backend / APIs**: Supabase Edge Functions (Deno 1.x) deployed to `/supabase/functions/api`.
- **Database/Auth**: Supabase PostgreSQL with Row Level Security and Realtime Triggers.

## Features Included
1. **Customer**: View products, mock location tracking, cart, checkout edge API, and live Uber-like order tracking via Supabase Realtime.
2. **Seller**: Dashboard to list products and view/fulfill order statuses.
3. **Admin**: Dashboard to elevate user roles.
4. **Auth**: Role-based frontend UI redirection guarded by Edge function logic.

---

## 🚀 Setup Instructions

### 1. Database
The script `supabase-schema.sql` can be executed in your Supabase SQL editor to scaffold the environment.

### 2. Edge Function (Backend) Setup
Since the entire Node.js server has been removed and migrated to Deno Edge via Supabase, you do not need to host a local Node.js server! 

To test edge functions locally, or deploy them directly to your hosted project:
```bash
# Login locally inside the root workspace
npx supabase login

# (Optional) Serve the application locally for dev testing
npx supabase functions serve --env-file frontend/.env

# Or simply Deploy straight to production!
npx supabase functions deploy api --no-verify-jwt
npx supabase secrets set SUPABASE_URL=https://<YOUR_REF>.supabase.co SUPABASE_ANON_KEY=... SUPABASE_SERVICE_ROLE_KEY=...
```
*(The `--no-verify-jwt` flag is important because we custom-validate roles internally across our `/api` router function!)*

### 3. Frontend setup
The frontend points its API calls directly to `VITE_BACKEND_URL=https://pcwityatijncfrdsfjbt.supabase.co/functions/v1/api` now!

To test the frontend local server:
```bash
# ⚠️ MAKE SURE YOU ARE INSIDE THE FRONTEND DIRECTORY
cd frontend
npm run dev
```

### 4. Testing Accounts
- Register and it will trigger as a `customer`
- Use the Supabase dashboard to modify the Postgres `users` row to grant `admin` or `seller` statuses safely.

## 📦 Deployment
1. Push `frontend/` folder to GitHub.
2. Deploy the `frontend/` folder to Vercel/Netlify. Ensure `VITE_SUPABASE_URL` and `VITE_BACKEND_URL` environment variables are mapped accurately.
