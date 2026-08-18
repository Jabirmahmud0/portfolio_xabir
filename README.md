# Jabir Mahmud - Portfolio

Portfolio website for Jabir Mahmud, a junior software engineer focused on full-stack, frontend, and AI engineering roles.

Live site: [jabir.pro.bd](https://jabir.pro.bd/)

## What is included

- Clear positioning across full-stack, frontend, and AI engineering
- Education and certifications
- Four selected projects on the homepage
- Searchable project archive with explicit deployment status
- Evidence-focused case studies for six projects
- Live demo, frontend GitHub, and backend GitHub links where available
- Responsive light and dark themes
- Semantic landmarks, keyboard focus styles, and reduced-motion support
- Route-specific title, description, canonical, Open Graph, and Twitter metadata
- Database-aware XML sitemap with a static fallback
- Password-protected portfolio administration at `/jabir`
- In-dashboard password changes with current-password verification and session revocation
- Neon Postgres-backed projects and site content with static fallback

## Stack

- React 19
- Vite 7
- React Router 7
- Tailwind CSS 4
- Framer Motion
- Neon serverless Postgres

## Local development

Use Node.js 20.19 or newer.

```bash
npm install
npm run dev
```

`npm run dev` starts Vite with a local middleware adapter for the same handlers deployed as Vercel functions. Login, content editing, password changes, and uploads therefore work locally without requiring a Vercel CLI login.

## Validation

```bash
npm run lint
npm run build
```

## Routes

- `/` - portfolio homepage
- `/projects` - complete project archive
- `/projects/:slug` - selected engineering case study
- `/jabir` - private content administration

Vercel rewrites only the client-side routes to `index.html`; `/api/*` remains available to serverless functions.

## Portfolio CMS setup

The CMS intentionally keeps every secret server-side. Never prefix these values with `VITE_`.

1. Rotate any database credential that has been shared in chat or committed anywhere.
2. In Neon, create a restricted runtime role for this portfolio and use its pooled connection string as `DATABASE_URL`. Keep the owner/migration connection separate as `MIGRATION_DATABASE_URL` only while applying schema changes; do not add it to Vercel.
3. Copy `.env.example` to `.env` and fill in `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, and a random `SESSION_SECRET` of at least 32 characters.
4. Generate the password hash without storing the plain password in source:

   ```powershell
   $env:ADMIN_PASSWORD_PLAIN = Read-Host -AsSecureString | ConvertFrom-SecureString -AsPlainText
   npm run auth:hash-password
   Remove-Item Env:ADMIN_PASSWORD_PLAIN
   ```

5. Create and seed the database. The migration command may use the temporary migration credential; seeding uses the restricted runtime credential:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

6. Add the same environment variables to the Vercel project and redeploy.

Project deletion is a recoverable soft archive. Public pages read published database content and automatically retain the bundled static content if the database is temporarily unavailable.

The environment password hash bootstraps the single admin credential during the first seed. Later password changes are made from the Security tab in `/jabir` and stored as a salted scrypt hash in Neon. A change invalidates all existing admin sessions.

Project images and portraits use a server-signed Cloudinary upload. Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` only to server environment variables; the API secret is never sent to the browser.

## Contact

- Email: [jaabirmahmud01@gmail.com](mailto:jaabirmahmud01@gmail.com)
- GitHub: [Jabirmahmud0](https://github.com/Jabirmahmud0)
- LinkedIn: [jabirmahmud0](https://www.linkedin.com/in/jabirmahmud0)
- X: [Jabirmahmud0](https://x.com/Jabirmahmud0)
