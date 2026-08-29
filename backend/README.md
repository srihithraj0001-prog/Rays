Rays Backend (Phase 2)

This backend provides:
- SQLite database (schema & migrations in src/db/init.js)
- Express APIs for questions, PDFs, imports, bookmarks, progress
- Admin import UI at /admin (simple client-side page)

Quickstart (local):

cd backend
cp .env.example .env    # edit if desired
npm install
npm run migrate         # creates SQLite DB and tables
npm start

Open http://localhost:4000/admin to access the admin import UI.

Important:
- This tool does NOT crawl or scrape external sites automatically.
- All imported items must include source and sourceUrl metadata.
- Uploaded PDFs are stored in the uploads/ directory (gitignored by default).
