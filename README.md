TinyLink frontend (React + Tailwind)

Setup

1. Install dependencies:
   npm install
2. Start dev server:
   npm run dev

Notes

The frontend expects the backend API at http://localhost:4000 by default. To change the API host in Vite, create a file named `.env` at the project root with a VITE\_ prefixed variable, for example:

VITE_API_URL="http://localhost:4000"

Vite exposes variables with the `VITE_` prefix via `import.meta.env` in code. The app falls back to `http://localhost:4000` when `VITE_API_URL` is not present.
# url-frontend
