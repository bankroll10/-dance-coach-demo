# Dance with JSPR

A small, mobile-first website for private dance lessons with **@jspr_dances**. Visitors choose a 30-minute ($30 USD) or 60-minute ($40 USD) lesson and are sent to a coach-owned Tally form. Everything after the request (calendar check, PayPal invoice, payment check, confirmation) is done by hand by the coach. See [`docs/pilot-operations.md`](docs/pilot-operations.md).

It's a static site: plain HTML, CSS and vanilla JavaScript, with no build step, backend, accounts, analytics or payment code.

> **Status: pilot preparation. Not deployed.** Until real form links are added, every request button shows a "Preview only" state and sends nothing.

## Run it locally

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000>. The scripts are ES modules, so use a local server rather than opening `index.html` directly.

## How the request buttons behave

Each lesson option has its own setting in `js/content.js`:

```js
export const requestForms = { '30': '', '60': '' };
```

- **Empty or invalid** (anything that isn't a well-formed `https://` URL): the button opens a "Preview only" dialog, the card says "Preview only — request form not connected yet", and a "Preview only" indicator shows in the header. Nothing is sent, and no link goes anywhere.
- **A valid `https://` Tally URL**: the button becomes a normal link that opens the coach's form in a new tab. When both options have links, the preview indicator disappears.

Both options can point at the same URL if one form has a lesson field.

## Where to edit things

All in **`js/content.js`**: site name and handle, the lesson options and prices, the form links, the home and process copy, and the optional home photo (`homeMedia.src` and `alt`). Colours and fonts are CSS variables at the top of `styles.css`.

**This file ships to every visitor.** Never put the coach's notification email, his legal name, agreement or revenue-share terms, or any credentials in it. This repository is public, so keep them out of every file here. Use a private note instead.

## Publishing the site files

```sh
./scripts/stage-demo.sh   # copies only index.html, styles.css and js/ into dist/ (gitignored)
```

Docs, scripts, git data and `docs/` are never copied. `netlify.toml` points at `dist/`. Deployment needs explicit authorization. The site is marked `noindex` until a launch decision is made.

## What's not here

Recorded courses (deferred), payments, a booking calendar, a backend, and an email sender. The site never collects personal details: the Tally form, owned by the coach, does that.

## Remaining decisions before launch

The full list is in section 7 of [`docs/pilot-operations.md`](docs/pilot-operations.md): availability, response target, payment deadline, cancellation and rescheduling policy, meeting platform, permission for a public contact email, the final agreement, the Tally form URLs, a privacy notice, and a home photo.
