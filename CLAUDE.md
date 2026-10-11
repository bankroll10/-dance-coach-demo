# CLAUDE.md

Dance with JSPR: a static, mobile-first site for private dance lessons with @jspr_dances. Visitors pick a 30- or 60-minute lesson and are sent to a coach-owned Tally form. The coach handles approval, PayPal invoicing and confirmation by hand (see `docs/pilot-operations.md`).

## Run

```sh
python3 -m http.server 8000   # then open http://localhost:8000
./scripts/stage-demo.sh       # stage only the public files into dist/ (gitignored)
```

There is no build step and no dependencies. The JS files are ES modules (`js/app.js` imports `js/content.js`).

## Layout

- `index.html`: shell (header, preview-only indicator and dialog, footer).
- `styles.css`: design tokens on `:root`, then the components.
- `js/content.js`: **all** copy, lesson options and prices, the launch flag (`bookingEnabled`) and the Tally form URLs (`requestForms`). Edit here first.
- `js/app.js`: renders the page, decides link vs. preview-only for each lesson option, and runs the dialog.
- `docs/pilot-operations.md`: internal operations guide (confirmed policies, emails, ledger, manual steps). Never staged for deploy.
- `docs/request-form-spec.md`: specification for the coach-owned Tally forms. A spec only; no form is live.

## Ground rules

- Keep it lightweight: static HTML/CSS/vanilla JS. Don't add a framework, build tooling, or npm dependencies without a clear need.
- The public repository and everything in `js/` ship to visitors. **Never commit** the coach's notification email, his legal/agreement name, revenue-share terms, student data, or credentials, in code or docs. Use placeholders.
- No `fetch`, form actions, analytics, or third-party scripts. The Google Fonts stylesheet is the only external resource. The only outbound navigation is the visitor following a configured Tally link.
- A request button must never lead to a dead link or collect details on this site. It becomes a real link only when `bookingEnabled === true` AND the URL is https on exactly `tally.so` (no credentials, no port). Otherwise it stays "Preview only". Never set `bookingEnabled` to `true` without explicit authorization.
- Don't imply instant booking, payment collection, or automatic confirmation. Sending a request is not a booking.
- Don't invent the coach's bio, credentials, availability, testimonials or policies, and don't publish an unapproved draft (e.g. cancellation/refund terms) as final. Mark unresolved details `[TBD]` in docs. Lessons are FaceTime only: don't advertise other platforms.
- Student-facing policies (days, start times, ages, guardian rules, cancellation/rescheduling) are confirmed. Keep the page, the form spec and the email templates identical in meaning, and don't add terms the coach hasn't stated. This site collects nothing from minors or anyone else; the only child information the form spec asks for is an age band, in the coach's Tally form.
- Use "Request a lesson", never "Book".
- Recorded courses are deferred: don't advertise them.
- Backend services, real payments, new accounts, live forms, and deployment each need explicit authorization.
