# Moveo Backend

A **TypeScript + Express 5** backend with **SQLite + TypeORM**, **Google OAuth**, and **Google Calendar** integration. It manages calendars, events, attendees, purchases, users, and membership cards, and exposes a clean REST API for a Moveo-like booking/club system.

This README is written so someone who has never seen the code can continue development.

> **TL;DR**
> - Run dev: `npm i && npm run dev`
> - Env: copy `.env.example` → `.env` (see **Environment variables**)
> - DB: SQLite file `moveo-backend-main.sqlite` via TypeORM (auto-init + seed products/purchases)
> - Auth: Google OAuth + JWT (httpOnly cookie `refreshToken`, `Authorization: Bearer <jwt>`)
> - Calendars: synced from Google Calendar, cached, and exposed via REST

---

## Stack

- **Runtime:** Node.js 20+
- **Framework:** Express 5, TypeScript
- **DB:** SQLite (`sqlite3`) via **TypeORM**
- **Auth:** Google OAuth (server-to-server + user login), JWT (access token)
- **Scheduling/Email:** `node-cron`, `nodemailer`, IMAP parsing
- **Other:** CORS, cookie-parser, zod validation, Node-Cache

Key dependencies:
- **@types/mailparser**: ^3.4.6
- **cookie-parser**: ^1.4.7
- **cors**: ^2.8.5
- **google-auth-library**: ^10.1.0
- **googleapis**: ^150.0.1
- **imapflow**: ^1.0.193
- **jsonwebtoken**: ^9.0.2
- **mailparser**: ^3.7.4
- **node-cache**: ^5.1.2
- **node-cron**: ^4.2.1
- **nodemailer**: ^7.0.5
- **reflect-metadata**: ^0.2.2
- **sqlite3**: ^5.1.7
- **tslib**: ^2.8.1
- **typeorm**: ^0.3.25
- **wordpress-hash-node**: ^1.0.0
- **xlsx**: https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz
- **zod**: ^3.25.71

Dev tooling:
- **@eslint/eslintrc**: ^3.3.1
- **@types/cookie-parser**: ^1.4.9
- **@types/cors**: ^2.8.19
- **@types/express**: ^5.0.3
- **@types/imap**: ^0.8.42
- **@types/jsonwebtoken**: ^9.0.10
- **@types/node**: ^24.0.8
- **@types/nodemailer**: ^6.4.17
- **@types/wordpress-hash-node**: ^1.0.2
- **@typescript-eslint/eslint-plugin**: ^8.35.1
- **@typescript-eslint/parser**: ^8.35.1
- **dotenv**: ^17.0.0
- **eslint**: ^8.57.1
- **eslint-config-prettier**: ^10.1.5
- **eslint-import-resolver-typescript**: ^4.4.4
- **eslint-plugin-import**: ^2.32.0
- **eslint-plugin-prettier**: ^5.5.1
- **express**: ^5.1.0
- **install**: ^0.13.0
- **nodemon**: ^3.1.10
- **npm**: ^11.4.2
- **prettier**: ^3.6.2
- **ts-node**: ^10.9.2
- **tsconfig-paths**: ^4.2.0
- **typescript**: ^5.8.3

---

## Project structure

```
src/
├── app.ts                    # Express app, middleware, route mounting
├── server.ts                 # HTTP server + DataSource init
├── config/                   # env, constants
├── controllers/              # request handlers
├── database/                 # TypeORM DataSource, seeders
├── middleware/               # auth, validation, Google client, error handler
├── models/                   # TypeORM entities (Calendar, User, Profile, Product, Purchase, ...)
├── routes/                   # Express routers per domain
├── services/                 # business logic (Google API, calendars, users, shop, subscriptions)
├── types/                    # shared TS types & express Request typing
└── utils/                    # logger, errors, token helpers, formatters
```

Start reading at **`src/server.ts`** → **`src/app.ts`** → **`src/routes/*`** and **controllers**.

---

## Environment variables

Create `.env` in the project root with at least:

```env
# Core
PORT=4000
NODE_ENV=development
DATABASE=./data.sqlite            # path to SQLite file

# Google OAuth (web client) for user login
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:4000/api/auth/google/callback
FRONTEND_REDIRECT_URI=http://localhost:5173

# Service account (for Calendar operations)
GOOGLE_SERVICE_ACCOUNT={ "type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n","client_email":"...","client_id":"...","token_uri":"https://oauth2.googleapis.com/token" }

# JWT
JWT_SECRET=change-me

# Email (SMTP + IMAP)
MOVEO_EMAIL=no-reply@example.com
MOVEO_EMAIL_PASSWORD=example-password
MOVEO_EMAIL_HOST=smtp.example.com
ALLOWED_EMAIL_DOMAINS=student.lab.fi,student.lut.fi,lab.fi,lut.fi

# Frontend base (for CORS and redirects)
FRONTEND_URI=http://localhost:5173
```

`src/config/index.ts` documents additional options and defaults.

---

## Running locally

```bash
# 1) Install
npm install

# 2) Dev server with auto-reload
npm run dev

# 3) Production build & run
npm run build
npm start
```

On first run, the app will:
- Initialize **TypeORM** with SQLite
- **Sync Google Calendars** into the DB
- Seed **Products** and **Purchases** (mock data in `src/database/seedData.ts`)

---

## API overview

Base URL (default): `http://localhost:${PORT}/api`

### Auth
- `GET /api/auth/google` → redirect to Google consent
- `GET /api/auth/google/callback` → handle Google OAuth; sets tokens and returns app JWT
- `POST /api/login` → mock WordPress login (for dev), returns JWT
- `POST /api/register` → mock registration (WordPress-like), returns JWT
- `POST /api/logout` → clear refresh token cookie

Headers: `Authorization: Bearer <jwt>` for protected endpoints.

### Users
- `GET /api/users` → list (TODO: admin only)
- `GET /api/users/user` → current user (from JWT)
- `GET /api/users/:id` → get by id
- `POST /api/users` → add by email

### Member Card
- `GET /api/member/:id` → public member card info
- `PUT /api/member/:id/image` → update profile image

### Calendars
- `GET /api/calendars` → list calendars `{ calendarId, alias }`
- `POST /api/calendars` → create/sync a calendar `{ alias }`
- `DELETE /api/calendars/:alias` → delete by alias

### Events
- `GET /api/events/:alias` → list events for alias
- `GET /api/events/:alias/:eventId` → get single event
- `POST /api/events/:alias` → create event (body: `start,end,summary,description,location,maxAttendees`)
- `PUT /api/events/:alias/:eventId` → update event
- `DELETE /api/events/:alias/:eventId` → delete event

### Event Attendees
- `POST /api/attendees/:alias/:eventId/attend` → current user attends
- `DELETE /api/attendees/:alias/:eventId/unattend` → current user removes attendance

### Purchases / Shop
- `GET /api/purchases` → all purchases
- `POST /api/purchases` → add purchase
- `GET /api/purchases/email/:email` → purchases by email
- `GET /api/purchases/user` → all purchases by current user
- `GET /api/purchases/latest/:email` → latest purchase for email

### Notifications (WIP)
- `POST /api/notifications` → create notification
- `POST /api/notifications/subscribe` → save subscription (placeholder)

> Tip: inspect `src/routes/*.ts` for precise request/response shapes; responses are wrapped via `utils/responses.ts`.

---

## Authentication & authorization

- **Login**: via Google OAuth flow or mocked WordPress-style login for dev routes.
- **JWT**: Signed with `JWT_SECRET`. Sent by clients in `Authorization` header.
- **Refresh**: `refreshToken` cookie set `httpOnly` (secure in production).
- **Request typing**: `src/types/express-serve-static-core.d.ts` augments `Request.user` typing.

Middlewares:
- `authenticateJWT.middleware.ts` – validates access token
- `attachGoogleClient.middleware.ts` – attaches `OAuth2Client` instance to the request for the current user

---

## Database

- **SQLite** file configured by `DATABASE` env and `src/database/data-source.ts`
- Entities in `src/models/`:
  - `Calendar` – alias ↔ Google `calendarId`
  - `User`, `UserProfile`, `UserSettings`
  - `Product`, `Purchase`
  - `PendingShopEmail`
- Seeds: `seedProducts()`, `seedPurchase()` invoked at init (mock data)

Use the TypeORM `AppDataSource` for new repositories/services.

---

## Services

- `services/google` – Google Calendar (list/create/update/delete events), OAuth helpers
- `services/calendar` – DB cache, sync with Google, alias management
- `services/events` – event formatting & CRUD
- `services/imap` – IMAP client + parsers for shop emails
- `services/shop` – products and purchases
- `services/users` – user CRUD and profiles
- `services/subscriptions` – memberships/notifications (WIP)

---

## Development standards

- **Lint/format**: `npm run lint`, Prettier config in `.prettierrc`
- **Paths**: TS path aliases (`@controllers`, `@routes`, `@models`, etc.) – see `tsconfig.json`
- **Error handling**: `utils/errors.ts` + centralized `error.middleware.ts`
- **Logging**: `utils/logger.ts`

---

## Common contributor tasks

- **Add a new route**: create a controller in `src/controllers`, add a router in `src/routes`, mount in `app.ts` under `/api/...`.
- **Add a model**: add an entity under `src/models`, register it in `data-source.ts`, run the server to auto-sync, and write repository/service functions.
- **Add an event field**: update Google event map in `services/events/*` and sanitize in `utils/GoogleCalendarEventFormat.ts`.
- **Restrict access**: wrap routes with `authenticateJWT` and role checks (extend `Request.user` typing).

---

## Troubleshooting

- **JWT 401**: check `JWT_SECRET`, ensure `Authorization: Bearer <token>` header is sent.
- **Google errors**: verify OAuth credentials & service account JSON; ensure calendar access is granted to the service account.
- **DB not updating**: delete the SQLite file (dev), then restart to re-init and reseed.
- **CORS**: set `FRONTEND_URI` to the correct origin.

---

## Scripts

From `package.json`:

- `npm run dev` – run with Nodemon
- `npm run build` – compile TypeScript to `dist/`
- `npm start` – run compiled server
- `npm run lint` – lint
- `npm run lint:fix` – auto-fix

---

_Updated: 2025-08-29_
