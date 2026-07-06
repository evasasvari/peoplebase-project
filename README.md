# Peoplebase — HR Management Platform (MVP)

An internal HR management web app (MVP) for a ~200-employee company. It centralizes
employee information, leave management, and basic HR insights. Built as a **static
front-end** with plain HTML, CSS, and vanilla JavaScript — no build step, no
dependencies — faithfully implementing a Figma design system (tokens, type styles,
and components).

## Pages

| Page | File | Description |
|------|------|-------------|
| Dashboard | `index.html` | KPI cards, Time Off Overview chart, Upcoming Birthdays, Recent Leave Requests, Department Headcount |
| Employees | `employees.html` | Searchable/filterable employee table with pagination |
| Employee Details | `employee-details.html` | Profile, Personal Information, Time Off Balance, tabs, Recent Activity |
| Time Off | `time-off.html` | Leave requests table, filters, Request Time Off modal (loader → success) |
| Reports | `reports.html` | Leave Types pie, Monthly Leave Requests bar chart, Department Summary |
| Settings | `settings.html` | General settings form with theme (light/dark) toggle |

## Features

- **Shared shell** (`js/app.js`) — one source of truth for the sticky sidebar, logo,
  and top bar, injected into every page. Active nav state per page.
- **Design system** — semantic color/spacing/radius tokens and responsive type styles
  in `css/tokens.css`; components in `css/styles.css` (buttons, badges, status tags,
  tabs, avatars, tables, charts, switches, snackbars, modal, etc.).
- **Interactions** — cross-page navigation, hoverable/clickable KPI cards, instant
  client-side search & filtering, tab filtering, a working Leave Request modal, and
  chart controls.
- **Dark mode** — toggle in Settings; the choice persists across pages via
  `localStorage` until changed again.
- **MVP placeholders** — non-functional controls either are disabled or show a
  snackbar noting they are a placeholder.
- **Sticky** sidebar, logo, and top bar; desktop-first (min ~1440px).

## Run it

No build or install needed.

**Option A — open directly:** open `index.html` in a browser (needs internet for the
Google Fonts CDN).

**Option B — local server** (Node, no dependencies):

```bash
node server.js
# then open http://localhost:4321
```

**Option C — GitHub Pages:** push this folder to a repo, then in
*Settings → Pages* choose the branch and `/root`. The site serves `index.html`.

## Tech

Vanilla HTML / CSS / JavaScript. `server.js` is an optional dependency-free static
file server for local development. Fonts: Inter (via Google Fonts).
