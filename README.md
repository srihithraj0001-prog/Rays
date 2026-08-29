# Integrated README

This repository now contains a working Phase1 frontend and Phase2 backend integrated.

Checkout branch:

  git fetch
  git checkout phase2-backend

Backend
-------
cd backend
cp .env.example .env
# edit .env if needed (FRONTEND_URL, UPLOAD_DIR, DB_PATH, ADMIN_USER, ADMIN_PASS)
npm install
npm run migrate
npm start

Admin UI available at: http://localhost:4000/admin
Protected with HTTP Basic Auth (ADMIN_USER/ADMIN_PASS)

Frontend
--------
cd frontend
cp .env.example .env
# set VITE_API_URL if backend running on non-default
npm install
npm run dev

Default demo user
-----------------
Frontend will send header x-user-id with value from VITE_DEMO_USER or fallback to 'demo-user'.

API Endpoints
-------------
See backend/src for route implementations. Examples:
GET /api/questions
GET /api/questions/:id
POST /api/attempts/:questionId
GET /api/bookmarks
POST /api/bookmarks
DELETE /api/bookmarks/:refId
GET /api/pdfs
GET /api/pdfs/:id
POST /api/imports/pyqs (protected)
POST /api/imports/pdfs-manifest (protected)
POST /api/pdfs/upload (protected)
GET /api/analytics/subjects
GET /api/analytics/chapters
GET /api/activity/recent

