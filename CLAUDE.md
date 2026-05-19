# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run start:dev          # Dev server with file-watch (port 8000)
npm run build              # Compile TypeScript via NestJS CLI (SWC)
npm run build:prod         # Build + create deployable dist package
npm run lint               # ESLint with auto-fix
npm run format             # Prettier on src/ and test/

npm run test               # Jest unit tests
npm run test:watch         # Unit tests in watch mode
npm run test:cov           # Coverage report
npm run test:e2e           # E2E tests (test/jest-e2e.json)

# Migrations (Sequelize CLI via .sequelizerc → config/database.js)
npm run migration:generate -- --name <description>   # Generates: YYYYMMDDHHmmss-description.js
npm run migration:run
npm run migration:revert
npm run migration:status
```

## Architecture

Modular NestJS 11 backend under `src/`. Every feature has a controller, service, DTOs, and module file. Shared Sequelize models are in `src/entities/` (25 entities total).

**Bootstrap (`src/main.ts`):**
- Global prefix `/api`
- Global `ValidationPipe` with `transform: true` and `transformOptions.enableImplicitConversion: true`
- CORS open to any origin with credentials, exposes `Authorization` header
- Swagger docs at an obfuscated route (security-through-obscurity)
- Railway-specific auto-shutdown controlled by `ACTIVE_HOURS` env var

**Auth (two layers):**
1. `AppKeyGuard` (injected as `APP_GUARD`) — validates `x-app-key` header **globally**; intentionally returns 404, not 401, for missing/invalid keys
2. JWT Bearer via `@nestjs/passport` / `passport-jwt` — gates individual protected routes

**Database:**
- MySQL 8 via `@nestjs/sequelize` + `sequelize-typescript`
- `synchronize: false` — schema changes go through migrations only
- Migrations in `database/migrations/` as JS files named `YYYYMMDDHHmmss-description.js`
- Timezone: `-06:00` (Central / Mexico City)
- Config via `config/database.js` (loaded by `.sequelizerc`)

**Feature modules (23):** `Auth`, `Users`, `Clients`, `Account`, `Store`, `Terminal`, `Products`, `Catalogs`, `Sale`, `SaleItem`, `Payment`, `Invoices`, `InvoiceConfig`, `Inventory`, `Returns`, `ReturnItems`, `Royalty`, `GiftCard`, `GiftCardTransaction`, `DiscountRule`, `Campaign`, `Cashbox`, `Notification`, `Reports`, `Jobs`, `Email`, `Utils`

`Sale` is the most complex — it injects `RoyaltyService`, `GiftCardService`, `InventoryService`, `PaymentService`, and `SaleItemService` via cross-module imports.

**Entities (25):** `Admin`, `Campaign`, `Cashbox`, `CatalogVersion`, `Client`, `DiscountRule`, `GiftCard`, `GiftCardTransaction`, `Inventory`, `Invoice`, `InvoiceConfig`, `Job`, `Notification`, `Payment`, `Product`, `Profile`, `Report`, `Return`, `ReturnItem`, `Royalty`, `Sale`, `SaleItem`, `Store`, `Terminal`, `User`

`User` is central — one-to-one relationships with `Profile`, `Client`, and `Admin`.

**Key conventions:**
- `@nestjs/config` for all env vars — never read `process.env` directly
- DTOs live in their module folder; use `class-validator` decorators
- All endpoints documented with `@nestjs/swagger` decorators
- Use NestJS `Logger`, not `console.log`
- Background/scheduled work via `@nestjs/schedule` in `src/jobs/`
- Email templates via Handlebars in the `EmailModule`

## Environment Variables

`DB_HOST`, `DB_PORT` (default 3306), `DB_USER`, `DB_PASS`, `DB_SCHEMA`, `PORT` (default 8000), `TOKEN_SECRET_KEY`, `LOGIN_TOKEN_SECRET_KEY`, `EMAIL_SERVICE`, `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASSWORD`, `FRONTEND_URL`, `P_ADMIN`, `P_PARTNER`, `P_CLIENT`, `ROYALTY_*`, `INVENTORY_DAYS_BEFORE_EXPIRATION`, `ACTIVE_HOURS` (Railway shutdown schedule)
