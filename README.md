# SHEIN with Rejo

A personal ordering service website for customers in Zimbabwe who want to buy items they
find on SHEIN. Customers send a product link or a screenshot; Rejo reviews the request,
confirms details, places orders in batches every 3 days, and delivers free of charge in
Harare.

> **SHEIN with Rejo is an independent ordering service.** It is not SHEIN and is not
> affiliated with, endorsed by, or connected to SHEIN in any way.

## Architecture

```
shein-with-rejo/
├── frontend/          # React 18 + Vite + Tailwind CSS (static SPA, GitHub Pages)
├── backend/           # Node.js + Express API (orders, uploads, admin)
│   └── src/
│       ├── app.js           # Express app (helmet, CORS, rate limiting, routes)
│       ├── db.js            # PostgreSQL pool + query helpers
│       ├── schema.sql       # Database schema (idempotent)
│       ├── routes/          # public.js (create/track), admin.js (auth + management)
│       ├── services/        # orders.js (order lifecycle + history)
│       ├── storage/         # upload storage abstraction (local disk driver)
│       ├── validation/      # zod schemas (shared input validation)
│       └── middleware/      # auth, security, error handling
└── .github/workflows/ # CI (build + API smoke test) and GitHub Pages deploy
```

## Database

PostgreSQL is **required** — the API will not start without `DATABASE_URL`. Orders,
customers, items, screenshots and full status history are stored durably; nothing is
kept in memory.

| Table | Purpose |
|---|---|
| `customers` | name + phone (normalized, unique) + email |
| `orders` | public reference, status, payment status, delivery info, admin notes |
| `order_items` | per-item SHEIN URL, size, colour, quantity, notes |
| `order_item_screenshots` | random-named upload references |
| `order_status_history` | every status change: old → new, by whom, when |
| `admin_users` | bcrypt-hashed admin credentials |

Customers never see database IDs — they use the public reference (e.g. `SWR-688G5G`).

## Environment variables

### Backend (`backend/.env`, see `backend/.env.example`)

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `JWT_SECRET` | production | signs the admin session cookie (`openssl rand -hex 64`) |
| `CORS_ORIGINS` | recommended | comma-separated allowed browser origins |
| `COOKIE_SECURE` | production | `true` = session cookie only over HTTPS (SameSite=None) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` | for admin | hash via `npm run hash-password -- "password"` |
| `UPLOAD_DIR` / `MAX_UPLOAD_MB` | optional | local-disk upload settings |

### Frontend (`frontend/.env`, see `frontend/.env.example`)

| Variable | Notes |
|---|---|
| `VITE_SITE_URL` | public site URL, used for canonical/OG tags |
| `VITE_API_URL` | backend base URL — never hardcode endpoints in components |

`VITE_` variables are bundled into the browser build. **Never** put secrets in the
frontend or commit `.env` files.

## Local development

```bash
# 1. Database (any PostgreSQL 14+)
createdb shein_with_rejo

# 2. Backend
cd backend
cp .env.example .env          # fill in DATABASE_URL etc.
npm install
npm run migrate               # creates schema + admin account
npm run dev                   # http://localhost:5000

# 3. Frontend
cd frontend
cp .env.example .env          # defaults are fine for local dev
npm install
npm run dev                   # http://localhost:5173
```

## Admin setup

1. Choose an email and a strong password (10+ characters).
2. Hash the password: `cd backend && npm run hash-password -- "your-password"`
3. Put the email and hash into `backend/.env` as `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH`.
4. Run `npm run migrate` (safe to re-run; it only creates the account once).
5. Sign in at `/#/admin/login`. Sessions use an httpOnly, signed cookie — there is no
   token in localStorage.

## API overview

**Public**

| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/health` | health check |
| POST | `/api/orders` | multipart form: `payload` (JSON) + `items[N][screenshots]` images. Rate limited |
| GET | `/api/orders/track?reference=&phone=` | returns **only** the matching order; requires both reference and phone |

There is no public endpoint that lists all orders. The old `GET /api/orders` has been
removed deliberately — customer data must not be enumerable.

**Admin (httpOnly cookie session, all routes under `/api/admin`)**

| Method | Endpoint | Notes |
|---|---|---|
| POST | `/api/admin/login` | email + password → signed session cookie |
| POST | `/api/admin/logout` | clears the session |
| GET | `/api/admin/me` | current session |
| GET | `/api/admin/orders` | search, filter by status/payment, paginated |
| GET | `/api/admin/orders/:id` | full detail incl. items, screenshots, history |
| PATCH | `/api/admin/orders/:id` | update status, payment status, internal notes |

**Order statuses:** `pending → reviewed → priced → paid → ordered → shipped → delivered`
(with `cancelled` as an exit state). Payment statuses: `pending`,
`awaiting_confirmation`, `confirmed`. Payment methods: EcoCash, cash, PayPal — actual
account details are confirmed with the customer directly and are not stored in code.

## File uploads

Screenshots are validated in three layers: MIME type + extension allow-list, magic-byte
inspection (JPEG/PNG/WebP), and a hard size limit. Stored files are given random
32-hex-character names — original filenames are never used — and are served back only by
that unguessable name. The storage layer is an interface (`backend/src/storage`); the
bundled driver writes to local disk, which is fine for a single-server deployment. For
multi-instance or cloud deployments, implement the same interface against S3-compatible
object storage and set the documented environment variables.

## Deployment

### Frontend — GitHub Pages

The site uses `HashRouter` with a Vite `base` of `/shein-with-rejo/` so direct visits to
routes work on GitHub Pages without server rewrites. `.github/workflows/github-pages-deploy.yml`
builds and deploys on every push to `main` (enable *Settings → Pages → GitHub Actions*).
Set the repository variable/secret `VITE_API_URL` for the build if your API is not at
the default.

### Backend

Deploy to any Node host (Render, Railway, Fly.io, a VPS). Requirements:

- Node 18+
- A PostgreSQL database
- Environment variables from the table above (`COOKIE_SECURE=true` behind HTTPS)
- Run `npm run migrate` on first deploy (and after schema changes)

## Security notes

- Strict CORS allow-list; credentials supported only for listed origins
- Rate limiting on all routes; tighter limits on order creation, tracking and login
- All input validated server-side with zod (client-side validation is convenience only)
- Parameterised SQL everywhere; no string-built queries
- Admin authentication via bcrypt password hashes and short-lived httpOnly cookies
- Secure headers via helmet; `X-Content-Type-Options` on uploads
- Friendly, generic error messages in API responses; technical details only in server logs
- No secrets in the frontend, README, or Git history

## CI

`.github/workflows/ci.yml` runs on pushes and PRs: frontend install + build, backend
install + syntax checks, and a full API smoke test against a real PostgreSQL service
(create → track → 401 checks).

## Contact

- **Phone / WhatsApp:** 0784 487 866
- **Email:** remudzamba@gmail.com
- **Service area:** Harare, Zimbabwe (free delivery)

## License

This project is private and proprietary.
