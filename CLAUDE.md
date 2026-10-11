# CLAUDE.md

Interactive concept demo for the dance coach @jspr_dances: a home page, a simulated lesson-request flow, a request preview, and a sample recorded course. It uses mock data only.

## Run

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

There is no build step and no dependencies. The JS files are ES modules (`js/app.js` imports `js/content.js`).

## Layout

- `index.html`: shell (header, demo indicator, footer, About dialog).
- `styles.css`: design tokens on `:root`, then the components.
- `js/content.js`: **all** copy, coach details, provisional pricing and sample lessons. Edit here first.
- `js/app.js`: hash router, the request-flow state (in memory only), practice progress (`localStorage`), and the dialog.

## Ground rules

- Keep it lightweight: static HTML/CSS/vanilla JS. Don't add a framework, build tooling, or npm dependencies without a clear need.
- No `fetch`, form actions, analytics, or third-party scripts. The Google Fonts stylesheet is the only external resource.
- Never collect real personal data. Request answers stay in memory, and contact fields are fictional and disabled.
- Don't invent the coach's name, bio, credentials, availability, testimonials, package terms or policies. Label sample content and placeholder media.
- Use "Request a lesson", never "Book".
- Backend services, real bookings, real payments and deployment each need explicit authorization in a later batch.
