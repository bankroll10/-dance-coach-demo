# Dance with JSPR

A small, mobile-first website for private dance lessons with **@jspr_dances**. Visitors choose a 30-minute ($30 USD) or 60-minute ($40 USD) lesson and are sent to a coach-owned Tally form. Everything after the request (calendar check, PayPal invoice, payment check, confirmation) is done by hand by the coach. See [`docs/pilot-operations.md`](docs/pilot-operations.md) for the operating guide and [`docs/request-form-spec.md`](docs/request-form-spec.md) for the specification the coach's forms follow.

It's a static site: plain HTML, CSS and vanilla JavaScript, with no build step, backend, accounts, analytics or payment code.

> **Status: pilot deployed to the existing demo site; not merged to `main`.** On this feature branch `bookingEnabled` is `true` and both lesson buttons link to the coach's own Tally forms. It is live at https://jspr-dances-demo-preview.netlify.app (public, no password). The site is `noindex`, which keeps it out of search results but is **not access protection**. Deployment details and the rollback target are in `docs/pilot-operations.md`, section 8.

## Run it locally

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000>. The scripts are ES modules, so use a local server rather than opening `index.html` directly.

## How the request buttons behave

Two settings in `js/content.js` control them:

```js
export const bookingEnabled = true;   // launch switch (true on this branch by explicit authorization)
export const requestForms = {
  '30': 'https://tally.so/r/dWLQaV',  // 30 minutes, $30 USD
  '60': 'https://tally.so/r/PdM81x',  // 60 minutes, $40 USD
};
```

| Button | Lesson | Opens (new tab) |
| --- | --- | --- |
| Request a 30-minute lesson | 30 minutes, $30 USD | `https://tally.so/r/dWLQaV` |
| Request a 60-minute lesson | 60 minutes, $40 USD | `https://tally.so/r/PdM81x` |

The forms belong to the coach, who receives the requests and notifications. The site only links to them.

A request button becomes a real link **only when `bookingEnabled` is exactly `true` and that lesson's URL is valid**. A valid URL is `https://` on exactly `tally.so`, with no username/password and no custom port. Lookalike hosts (for example `tally.so.example.com` or `tally.so@evil.com`) are rejected.

In every other case (flag `false`, URL missing or invalid) that option stays **preview-only**: the button opens a "Preview only" dialog, the card says "Preview only — requests aren't open yet", and the header shows a "Preview only" button. Nothing is sent and no link goes anywhere. Setting URLs alone never opens requests, and setting `bookingEnabled` back to `false` returns every button to preview-only. While both options are live, the preview markers are hidden.

The links open in a new tab with `rel="noopener noreferrer"`, so the visitor keeps this page.

## Where to edit things

All in **`js/content.js`**: site name and handle, the lesson options and prices, `bookingEnabled`, the form links, the home and process copy, and the optional home photo (`homeMedia.src` and `alt`). Colours and fonts are CSS variables at the top of `styles.css`.

**This file ships to every visitor, and this repository is public.** Never put the coach's legal name, agreement or revenue-share terms, student information, or any credentials in any file here. The coach has approved one email address for public student/privacy contact. It appears in the docs and the privacy-notice draft, but it is **not on the website**; don't add it there without a specific instruction.

## Publishing the site files

```sh
./scripts/stage-demo.sh   # copies only index.html, styles.css and js/ into dist/ (gitignored)
```

Docs, scripts, git data and `docs/` are never copied. `netlify.toml` points at `dist/`. Deployment needs explicit authorization. The site is marked `noindex` until a launch decision is made (not access protection).

## What's not here

Recorded courses (deferred), payments, a booking calendar, a backend, and an email sender. The site itself has no form fields and collects no personal details: the coach's Tally forms do that. Retention and cleanup of requests is manual (see `docs/pilot-operations.md`, section 6).

## Remaining decisions before launch

The list is in section 7 of [`docs/pilot-operations.md`](docs/pilot-operations.md): comparing the live forms with the spec, an approved privacy notice, where (if anywhere) the approved contact email appears on the site, any answers to the "not specified" policy items, payment-record retention, the launch and deployment decision, and a home photo.

## Verification status

- **User-reported:** labeled test submissions through each form reached the coach in Tally and by email.
- **Checked on the local build and on the hosted site:** each button opens the right form in a new tab; prices, policies and FaceTime wording are unchanged; the site makes no submissions; only the four public files are served, and internal docs return 404.
- **Not checked:** the live Tally pages themselves (the build environment can't reach `tally.so`), and whether the live forms match the spec field by field.
