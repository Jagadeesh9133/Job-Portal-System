# Job Portal

## Deploy to Vercel

Deploy the frontend and API as two Vercel projects from this repository. This
keeps the Vite static site and Express serverless API on their supported build
paths.

### 1. Deploy the API

1. Import this repository as a Vercel project and set **Root Directory** to
   `backend`.
2. Add these environment variables in the Vercel project settings for every
   environment you deploy:
   - `MONGODB_URI`: a connection string for a persistent MongoDB database, such
     as MongoDB Atlas.
   - `JWT_SECRET`: a long, random secret used to sign authentication tokens.
3. Deploy the project and copy its production URL.

The API is exposed under `/api/*`. Production requires `MONGODB_URI`; the
in-memory MongoDB fallback is only for local development.

### 2. Deploy the frontend

1. Create a second Vercel project from the same repository and set **Root
   Directory** to `frontend`.
2. Set `VITE_API_BASE_URL` to the API project URL followed by `/api`, for
   example `https://your-api.vercel.app/api`.
3. Deploy the project.

The frontend uses Vercel's SPA rewrite so client-side routes resolve to the
React application. `VITE_API_BASE_URL` is embedded at build time; redeploy the
frontend after changing it.

### Local development

Run `npm run dev` in `frontend` and `npm start` in `backend`. The frontend uses
`http://localhost:5000/api` by default in development. The backend uses
`MONGODB_URI` when present and otherwise starts its local in-memory database.

For local accounts and production safety, set `JWT_SECRET` in the backend
environment. Never commit `.env` files or production secrets.
