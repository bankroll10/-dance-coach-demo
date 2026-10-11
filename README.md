# -dance-coach-demo

Mobile-first interactive concept demo of a learning and lesson-request site for the independent dance coach **@jspr_dances**.

It's a static website: it opens in any modern browser with nothing to install, no sign-up and no payment. Everything is mock data. Nothing a visitor does is sent anywhere.

## Run it locally

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>. The scripts are ES modules, so open the site through a local server like this, not by double-clicking `index.html`.

## What's in the demo

| View | Route | What it shows |
| --- | --- | --- |
| Home | `#/` | Intro, the confirmed live-lesson details, a proposed request process, and a teaser for recorded lessons |
| Lesson request | `#/request`, `#/request/2`, `#/request/3` | Three steps: goal and experience, preferred days and times of day, then review |
| Request preview | `#/request/preview` | "Demo request — not sent." with the answers, fictional contact details, and what would happen in a working version |
| Sample course | `#/lessons`, `#/lessons/<id>` | A sample four-lesson beginner course with a lesson view, practice tracking and a link to request a lesson |

A compact **Interactive demo** button in the header (and "About this demo" in the footer) opens a dialog explaining what is simulated.

### What works

- Hash routing with direct links, refresh, browser back/forward, a not-found view and an unknown-lesson view. Focus moves to the page heading after each navigation.
- Required-choice validation with inline, announced errors. Answers are kept when moving back and forward.
- Detected time zone, with an "unavailable" message if the browser can't provide one.
- Edit request (keeps answers) and Start over (clears them). Opening the preview without a completed request shows a route back to the form.
- Mark practiced, Next lesson, an end-of-course state, course progress and reset.
- Keyboard support, a visible focus ring, an accessible dialog (Escape closes it and focus returns to the button that opened it), and reduced-motion support.

### What is simulated

- **Lesson requests.** Nothing is sent, stored on a server or charged. Request answers live only in page memory, so a reload clears them. Contact fields are fictional ("Alex Sample") and disabled. The demo never collects real contact details.
- **Course and lessons.** The curriculum, titles, order and "sample focus" lines are illustrative. Video and coach-instruction areas are labeled placeholders, with no fake player controls.
- **Practice progress.** Only completed lesson IDs are saved, in this browser's `localStorage`. If storage is blocked, progress still works for the visit, and a note says it won't be saved.

There is no backend, no accounts, no analytics and no third-party JavaScript. The only external resource is the Google Fonts stylesheet for the display typeface ("Bricolage Grotesque"). The page falls back to system fonts if it can't load.

## Confirmed facts vs. provisional choices

**Confirmed by the coach:**

- He primarily teaches through FaceTime.
- Lessons usually last about one hour.
- Single lessons currently cost $30–$40.
- Packages reduce the per-lesson price. The terms are unknown, so none are shown.
- He has some prerecorded lessons. They have not been received or reviewed.
- He welcomes seeing a demo. There is no paid-development or revenue-sharing agreement.

**Provisional (choices made for the demo):**

- The identity uses the public handle @jspr_dances. The product name is undecided.
- The three-step request process ("share goals → pick preferred times → arrange details with the coach") is a proposal.
- The sample course "First Steps" and its four lesson titles are illustrative.
- The wording on "what would happen next" is a proposal. It deliberately makes no promise about when payment happens.
- The colours, type and layout are a starting point.

The demo does not include his name, biography, credentials, availability, testimonials, package terms or business policies.

## Where to update things

All editable content lives in **`js/content.js`**:

- **Branding:** `brand.handle` and `brand.wordmark` (the header and footer read these).
- **Pricing and lesson format:** `liveLesson` (`durationLabel`, `priceLabel`, `priceNote`).
- **Home copy and the proposed process:** `home`.
- **Home photo:** set `homeMedia.src` and `homeMedia.alt` to approved media. This replaces the placeholder tile.
- **Request options:** `request.goals`, `request.levels`, `request.days`, `request.windows` and `request.nextSteps`.
- **Course and lessons:** `course.lessons`. Set a lesson's `videoSrc` to an approved recording, and a real `<video controls>` replaces the placeholder.
- **About dialog text:** `about`.

Visual tokens (colours, fonts, spacing) are CSS custom properties at the top of **`styles.css`**.

Don't download or republish the coach's social videos. Use only media he supplies and approves.

## Remaining decisions before launch

1. The product name, and approval of the branding, photos, bio and copy.
2. Package terms, plus any final adjustment to the $30–$40 single-lesson price.
3. How lessons are scheduled and how availability and time zones are handled.
4. How payment is collected and when, plus cancellation and refund policies.
5. How lesson requests should reach the coach (email, DM, a scheduling tool).
6. Which prerecorded lessons to include, their rights, how they're hosted, and whether access is paid.
7. A privacy notice and terms for any real student data.
8. How this site relates to his existing Patreon and studio booking pages.
9. Hosting and domain. The site is deployable as static files, but deployment is out of scope for this batch.
