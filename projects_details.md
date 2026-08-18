# Portfolio Project Content Guide

This file documents the evidence standard used by the portfolio. The live source of truth for project names, links, status, technology, and case-study copy is `src/data/projects.js`.

## Positioning

- Name: Jabir Mahmud
- Role: Junior Software Engineer
- Focus: Full-Stack Engineering, Frontend Engineering, and AI Engineering
- Location: Dhaka, Bangladesh
- Availability: Junior full-time roles, on-site, hybrid, or remote
- Experience: Recent CSE graduate; no formal employment experience claimed
- Contact: jaabirmahmud01@gmail.com

## Evidence policy

Project copy should describe implemented features and reviewable engineering decisions. Do not publish user counts, conversion changes, uptime, security percentages, performance scores, revenue, or engagement improvements unless a saved analytics report or reproducible measurement supports the claim.

Use these evidence labels consistently:

- `Deployed`: a public live product is available.
- `GitHub only`: a public GitHub repository is available, but no separate live demo is claimed.
- `Selected`: a project with a detailed, evidence-backed case study.

## Selected case studies

### NexDokandar - Multi-Tenant Commerce SaaS

Status: Main SaaS application and three storefront tenants deployed

Challenge: Serve different retail business models from one SaaS platform while keeping organization and location data isolated.

Engineering approach:

- Organization-scoped users, catalog, inventory, customers, orders, accounts, reports, and subscriptions.
- Location-level inventory, staff assignment, cash-register, and stock-transfer boundaries.
- React administration and storefront interfaces backed by Node.js, TypeScript, PostgreSQL, and Socket.IO.
- Role, menu, subscription, and plan-feature access controls.
- Retail, wholesale, and e-commerce operations with payments, purchasing, finance, payroll, manufacturing, SMS, and reporting modules.

Evidence: Public main SaaS deployment, authenticated administration dashboard, clothing, hardware, and pharmacy tenant deployments, plus supplied architecture documentation. Source repositories are private, so the portfolio does not claim a public GitHub repository.

### LeadLens - AI Prospect Intelligence

Status: Deployed

Challenge: Turn fragmented agency prospecting research into a defensible brief grounded in a prospect's own public website.

Engineering approach:

- Durable 14-stage investigation pipeline with persistent stage state, retries, and stale-job recovery.
- Bounded public-site discovery, technical checks, PageSpeed signals, and evidence-aware AI output.
- Agency-specific fit scoring using services, pricing, ICP signals, and case studies.
- Gemini credential rotation, Groq fallback, Zod-validated outputs, and AI telemetry.
- Organization-scoped authorization, Stripe subscriptions, SSRF-safe crawling, and Markdown, PDF, and DOCX exports.

Evidence: Live product and public monorepo with architecture, security boundaries, tests, deployment instructions, and observability setup.

### NeuroScout AI - Research Assistant

Status: Deployed

Challenge: Build a research assistant that finds current sources, exposes its work, repairs incomplete drafts, and produces a report that can be inspected later.

Engineering approach:

- Gemini-guided planning, live web search, page extraction, evidence critique, synthesis, and targeted repair.
- FastAPI and async Python backend with Server-Sent Events for visible progress.
- MongoDB persistence for research sessions and completed reports.
- Quick, balanced, and deep modes, operational metrics, exports, and backend tests.

Evidence: Live React interface and public repository containing the FastAPI, MongoDB, and SSE implementation with documented limitations.

### TechVault - Electronics E-Commerce

Status: Deployed

Challenge: Support customers, sellers, and administrators in one commerce system without duplicating authentication, product, and order rules.

Engineering approach:

- Turborepo containing the Next.js frontend, Express API, database package, and shared types.
- Route-level role checks, schema validation, access and refresh tokens, and verified Stripe webhooks.
- PostgreSQL and Drizzle ORM for typed relational data.
- Search, filters, cart, wishlist, reviews, checkout, and management dashboards.

Evidence: Live product, public GitHub repository, architecture diagram, API documentation, environment examples, deployment guide, and commit history.

### FlowDesk - Project Management

Status: Deployed and completed

Challenge: Keep tasks, documents, permissions, presence, notifications, and billing consistent across multiple workspaces and clients.

Engineering approach:

- Workspace-scoped authorization using owner, admin, member, and viewer roles.
- TypeScript, tRPC, PostgreSQL, and Drizzle ORM for type-safe application boundaries.
- Socket.IO and Redis for real-time board, document, presence, and notification events.
- Server-side Stripe subscription and plan enforcement.

Evidence: Live product and public GitHub repository. No unsupported customer or revenue claims.

### CareerByAI

Status: Deployed

Challenge: Convert user information and uploaded CVs into structured, useful career guidance.

Engineering approach:

- Document text extraction for supported PDF and text files.
- Explicit skill and role inputs kept separate from generated explanations.
- Gemini-powered roadmaps and conversational guidance.
- Separate React client and Express API repositories.

Evidence: Live product plus public frontend and backend GitHub repositories.

### CureBay - Healthcare Commerce

Status: Deployed

Challenge: Combine medicines, lab tests, consultations, payments, and several account roles in one understandable product.

Engineering approach:

- Customer-facing discovery and checkout separated from role-specific dashboards.
- API authorization for protected inventory and order operations.
- Firebase authentication, Express, MongoDB, and Stripe checkout.

Evidence: Live product plus public frontend and backend GitHub repositories.

### DevKit - AI Developer Toolbox

Status: Deployed

Challenge: Combine editing, validation, debugging, and AI-assisted analysis without making browser interaction sluggish.

Engineering approach:

- Monaco Editor for the primary workspace.
- Web Workers for suitable client-side processing.
- Server integration reserved for AI-specific requests.
- Separate utilities for code review, SQL, regex, JSON, and API debugging.

Evidence: Live product and public GitHub repository.

### CollabNote - Collaborative Notes

Status: Deployed

Challenge: Synchronize document changes and collaborator presence while retaining authenticated access and recoverable versions.

Engineering approach:

- Socket.IO for editing and presence events.
- MongoDB for notes and version history.
- API-owned authentication and AI-summary requests.
- Separate client and server repositories.

Evidence: Live product plus public frontend and backend GitHub repositories.

## Additional archive projects

| Project | Status | Primary purpose |
| --- | --- | --- |
| TradeGrid | Deployed | WebSocket market data and Canvas visualization |
| CanvasFlow | GitHub only | Infinite-canvas vector editing |
| OrbitUI | GitHub only | Accessible React components and design tokens |
| NextTalent | Deployed | Job discovery and candidate workflows |
| Get Hyped | Deployed | Interaction-focused marketing frontend |
| GymHub | Deployed | Fitness and authentication dashboard |
| Portfolio Website | Deployed | React 19, Vite 7, JavaScript, Tailwind CSS, and Framer Motion |
| FolioXe | Deployed | Firebase-backed personal portfolio |
| Comfort Inn | Deployed | Hotel booking and map interface |
| CozyFind | Deployed | Property search and wishlists |
| Neon Marketing Site | Deployed | Static CSS and JavaScript interaction experiment |
| OrBexa | Deployed | Static e-commerce interface experiment |
