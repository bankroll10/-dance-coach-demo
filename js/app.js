import { brand, liveLesson, home, homeMedia, request as req, course, about } from './content.js';

const SITE_SUFFIX = `${brand.handle} (demo)`;
const STORAGE_KEY = 'jspr-demo-practice-v1';

const main = document.getElementById('main');
const announcer = document.getElementById('announcer');

/* ---------- helpers ---------- */

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);

function announce(message) {
  announcer.textContent = '';
  // A short delay makes screen readers treat repeated messages as new.
  setTimeout(() => { announcer.textContent = message; }, 60);
}

const labelFor = (list, id) => list.find((item) => item.id === id)?.label ?? '';
const labelsFor = (list, ids, key = 'label') =>
  list.filter((item) => ids.includes(item.id)).map((item) => item[key]).join(', ');

/* ---------- time zone ---------- */

function detectTimeZone() {
  try {
    const id = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!id) return null;
    let name = null;
    try {
      name = new Intl.DateTimeFormat('en-US', { timeZone: id, timeZoneName: 'long' })
        .formatToParts(new Date())
        .find((part) => part.type === 'timeZoneName')?.value ?? null;
    } catch { /* long name is optional */ }
    return { id, name };
  } catch {
    return null;
  }
}

const timeZone = detectTimeZone();
const timeZoneText = timeZone
  ? (timeZone.name ? `${timeZone.name} (${timeZone.id})` : timeZone.id)
  : 'Unavailable — your time zone couldn’t be detected. The coach would confirm times with you.';

/* ---------- request state (memory only; a reload clears it) ---------- */

const emptyRequest = () => ({ goal: null, level: null, days: [], windows: [], previewed: false });
let requestState = emptyRequest();

const STEPS = [
  { n: 1, short: 'Goal', title: 'What would you like to work on?' },
  { n: 2, short: 'Times', title: 'When works for you?' },
  { n: 3, short: 'Review', title: 'Review your request' },
];

const stepHash = (n) => (n === 1 ? '#/request' : `#/request/${n}`);

function stepErrors(n, s = requestState) {
  const errors = [];
  if (n === 1) {
    if (!s.goal) errors.push({ group: 'goal', message: 'Choose a goal to continue.' });
    if (!s.level) errors.push({ group: 'level', message: 'Choose your experience level.' });
  }
  if (n === 2) {
    if (!s.days.length) errors.push({ group: 'days', message: 'Pick at least one day.' });
    if (!s.windows.length) errors.push({ group: 'windows', message: 'Pick at least one time of day.' });
  }
  return errors;
}

// Highest step the student may open, given what they've answered.
function furthestStep() {
  if (stepErrors(1).length) return 1;
  if (stepErrors(2).length) return 2;
  return 3;
}

const requestComplete = () => requestState.previewed && furthestStep() === 3;

/* ---------- practice progress (non-personal, localStorage) ---------- */

const lessonIds = new Set(course.lessons.map((l) => l.id));

const storageAvailable = (() => {
  try {
    const probe = '__jspr_probe__';
    window.localStorage.setItem(probe, probe);
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
})();

function loadProgress() {
  if (!storageAvailable) return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.practiced)) throw new Error('invalid');
    return new Set(data.practiced.filter((id) => typeof id === 'string' && lessonIds.has(id)));
  } catch {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    return new Set();
  }
}

function saveProgress() {
  if (!storageAvailable) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ practiced: [...practiced] }));
  } catch { /* storage full or blocked: keep in-memory progress */ }
}

const practiced = loadProgress();

/* ---------- shared fragments ---------- */

const tag = (text, extra = '') => `<span class="tag ${extra}">${esc(text)}</span>`;

function progressBlock({ compact = false } = {}) {
  const done = course.lessons.filter((l) => practiced.has(l.id)).length;
  const beats = course.lessons.map((l, i) => {
    const isDone = practiced.has(l.id);
    return `<li class="beat${isDone ? ' is-done' : ''}">${isDone ? '✓' : i + 1}</li>`;
  }).join('');
  const note = storageAvailable
    ? ''
    : '<p class="muted small">Progress can’t be saved in this browser, so it resets when you leave the page.</p>';
  return `
    <div class="progress${compact ? ' progress-compact' : ''}">
      <p class="progress-text" id="progress-text" tabindex="-1"><strong>${done} of ${course.lessons.length}</strong> practiced</p>
      <ol class="beats" aria-hidden="true">${beats}</ol>
      <button type="button" class="link-button" data-action="reset-progress"${done ? '' : ' disabled'}>Reset progress</button>
      ${note}
    </div>`;
}

function lessonList({ currentId = null } = {}) {
  return `
    <ol class="lesson-list">
      ${course.lessons.map((l, i) => {
        const isDone = practiced.has(l.id);
        const isCurrent = l.id === currentId;
        return `
          <li>
            <a class="lesson-link${isCurrent ? ' is-current' : ''}" href="#/lessons/${esc(l.id)}"${isCurrent ? ' aria-current="page"' : ''}>
              <span class="lesson-num${isDone ? ' is-done' : ''}" aria-hidden="true">${isDone ? '✓' : i + 1}</span>
              <span class="lesson-link-text">
                <span class="lesson-title">${esc(l.title)}</span>
                <span class="lesson-status">${isCurrent ? 'Now viewing · ' : ''}${isDone ? 'Practiced' : 'Not practiced yet'}</span>
              </span>
            </a>
          </li>`;
      }).join('')}
    </ol>`;
}

const liveCta = (heading = 'Want feedback on your dancing?') => `
  <aside class="live-cta" aria-label="Live lessons">
    <p class="live-cta-title">${esc(heading)}</p>
    <p class="muted small">${esc(liveLesson.durationLabel)} · ${esc(liveLesson.format)} · ${esc(liveLesson.priceLabel)} ${esc(liveLesson.priceUnit)}</p>
    <a class="button button-primary" href="#/request">Request a lesson</a>
  </aside>`;

/* ---------- views ---------- */

function viewHome() {
  const media = homeMedia.src
    ? `<img src="${esc(homeMedia.src)}" alt="${esc(homeMedia.alt)}">`
    : `
      <div class="media-motif" aria-hidden="true">
        ${[38, 62, 46, 84, 54, 72, 40, 92].map((h, i) => `
          <span class="motif-bar" style="--h:${h}%"><span class="motif-count">${i + 1}</span></span>`).join('')}
      </div>
      <figcaption class="media-caption">${tag(homeMedia.placeholderLabel)}<span>${esc(homeMedia.placeholderNote)}</span></figcaption>`;

  return {
    title: 'Learn to dance',
    nav: null,
    html: `
      <section class="hero">
        <div class="wrap hero-grid">
          <div class="hero-copy">
            <p class="counts" aria-hidden="true"><span>5</span><span>6</span><span>7</span><span>8</span></p>
            <p class="eyebrow">${esc(home.eyebrow)}</p>
            <h1 class="hero-title" tabindex="-1">${esc(home.headline)}</h1>
            <p class="lede">${esc(home.intro)}</p>
            <div class="cta-row">
              <a class="button button-primary" href="#/request">${esc(home.primaryCta)}</a>
              <a class="button button-secondary" href="#/lessons">${esc(home.secondaryCta)}</a>
            </div>
          </div>
          <figure class="media-slot${homeMedia.src ? ' has-media' : ''}">${media}</figure>
        </div>
      </section>

      <section class="wrap band offer" aria-labelledby="offer-title">
        <h2 id="offer-title" class="section-title">Live lessons</h2>
        <dl class="facts">
          <div class="fact">
            <dt>Length &amp; format</dt>
            <dd>${esc(liveLesson.durationLabel)} <span class="sep" aria-hidden="true">·</span> ${esc(liveLesson.format)}</dd>
          </div>
          <div class="fact">
            <dt>Price</dt>
            <dd>${esc(liveLesson.priceLabel)} <span class="fact-unit">${esc(liveLesson.priceUnit)}</span></dd>
          </div>
        </dl>
        <p class="fine-print">${esc(liveLesson.priceNote)}</p>
      </section>

      <section class="wrap band process" aria-labelledby="process-title">
        <div class="section-head">
          <h2 id="process-title" class="section-title">${esc(home.processTitle)}</h2>
          ${tag(home.processLabel)}
        </div>
        <ol class="process-list">
          ${home.process.map((step, i) => `
            <li>
              <span class="count" aria-hidden="true">${i + 1}</span>
              <h3>${esc(step.title)}</h3>
              <p>${esc(step.text)}</p>
            </li>`).join('')}
        </ol>
        <a class="button button-primary" href="#/request">${esc(home.primaryCta)}</a>
      </section>

      <section class="wrap band recorded" aria-labelledby="recorded-title">
        <div class="recorded-grid">
          <div>
            <h2 id="recorded-title" class="section-title">${esc(home.recordedTitle)}</h2>
            <p>${esc(home.recordedText)}</p>
            <a class="button button-secondary" href="#/lessons">${esc(home.secondaryCta)}</a>
          </div>
          <div class="sample-titles">
            ${tag('Sample titles')}
            <ol>
              ${course.lessons.map((l) => `<li>${esc(l.title)}</li>`).join('')}
            </ol>
          </div>
        </div>
      </section>`,
  };
}

function choice({ type, name, item, checked, extra = '' }) {
  return `
    <label class="chip">
      <input type="${type}" name="${name}" value="${esc(item.id)}"${checked ? ' checked' : ''}>
      <span class="chip-face">
        <span class="chip-check" aria-hidden="true"></span>
        <span class="chip-text">${extra || esc(item.label)}</span>
      </span>
    </label>`;
}

function fieldset({ group, legend, hint = '', layout = '', body }) {
  return `
    <fieldset class="field" data-group="${group}" aria-describedby="err-${group}${hint ? ` hint-${group}` : ''}">
      <legend>${esc(legend)} <span class="req">Required</span></legend>
      ${hint ? `<p class="hint" id="hint-${group}">${hint}</p>` : ''}
      <p class="error" id="err-${group}"></p>
      <div class="chips ${layout}">${body}</div>
    </fieldset>`;
}

function stepper(current) {
  return `
    <ol class="stepper" aria-label="Request steps">
      ${STEPS.map((s) => {
        const state = s.n < current ? 'is-done' : s.n === current ? 'is-current' : '';
        const status = s.n < current ? ' (done)' : '';
        return `<li class="${state}"${s.n === current ? ' aria-current="step"' : ''}>
          <span class="step-dot" aria-hidden="true">${s.n < current ? '✓' : s.n}</span>
          <span class="step-label">${esc(s.short)}<span class="sr-only">${status}</span></span>
        </li>`;
      }).join('')}
    </ol>`;
}

function viewRequest(n) {
  const s = requestState;
  const step = STEPS[n - 1];
  let body = '';
  let actions = '';

  if (n === 1) {
    body = `
      ${fieldset({
        group: 'goal', legend: 'Your main goal', layout: 'chips-stack',
        body: req.goals.map((g) => choice({ type: 'radio', name: 'goal', item: g, checked: s.goal === g.id })).join(''),
      })}
      ${fieldset({
        group: 'level', legend: 'Your dance experience', layout: 'chips-row',
        body: req.levels.map((l) => choice({ type: 'radio', name: 'level', item: l, checked: s.level === l.id })).join(''),
      })}`;
    actions = `
      <a class="button button-ghost" href="#/">Cancel</a>
      <button type="submit" class="button button-primary">Next: times</button>`;
  }

  if (n === 2) {
    body = `
      <p class="tz-note"><span class="tz-label">Your time zone</span> <span>${esc(timeZoneText)}</span></p>
      ${fieldset({
        group: 'days', legend: 'Preferred days', hint: 'Choose any that could work.', layout: 'chips-days',
        body: req.days.map((d) => choice({
          type: 'checkbox', name: 'days', item: d, checked: s.days.includes(d.id),
          extra: `<span aria-hidden="true">${esc(d.label)}</span><span class="sr-only">${esc(d.full)}</span>`,
        })).join(''),
      })}
      ${fieldset({
        group: 'windows', legend: 'Preferred times of day', hint: 'In your time zone. These are preferences, not booked slots.', layout: 'chips-row',
        body: req.windows.map((w) => choice({
          type: 'checkbox', name: 'windows', item: w, checked: s.windows.includes(w.id),
          extra: `${esc(w.label)}<span class="chip-hint">${esc(w.hint)}</span>`,
        })).join(''),
      })}`;
    actions = `
      <a class="button button-ghost" href="${stepHash(1)}">Back</a>
      <button type="submit" class="button button-primary">Next: review</button>`;
  }

  if (n === 3) {
    body = `
      <dl class="summary">
        ${summaryRow('Goal', labelFor(req.goals, s.goal), stepHash(1), 'goal')}
        ${summaryRow('Experience', labelFor(req.levels, s.level), stepHash(1), 'experience')}
        ${summaryRow('Preferred days', labelsFor(req.days, s.days, 'full'), stepHash(2), 'days')}
        ${summaryRow('Times of day', labelsFor(req.windows, s.windows), stepHash(2), 'times of day')}
        ${summaryRow('Time zone', timeZoneText)}
        ${summaryRow('Lesson', `Private lesson · ${liveLesson.durationLabel.toLowerCase()} · ${liveLesson.format}`)}
        ${summaryRow('Price', `${liveLesson.priceLabel} ${liveLesson.priceUnit}; final price to be confirmed.`)}
      </dl>
      <fieldset class="field contact" disabled>
        <legend>Contact details ${tag('Fictional')}</legend>
        <p class="hint">This demo doesn’t collect contact information. A working version would ask for yours here.</p>
        <label class="text-field"><span>Name</span><input type="text" value="${esc(req.sampleContact.name)}" readonly></label>
        <label class="text-field"><span>Email</span><input type="email" value="${esc(req.sampleContact.email)}" readonly></label>
      </fieldset>`;
    actions = `
      <a class="button button-ghost" href="${stepHash(2)}">Back</a>
      <button type="submit" class="button button-primary">Preview my request</button>`;
  }

  return {
    title: `Request a lesson · Step ${n} of 3`,
    nav: 'request',
    html: `
      <section class="wrap narrow request">
        <p class="eyebrow">Request a lesson <span class="eyebrow-sep" aria-hidden="true">/</span> Step ${n} of 3</p>
        <h1 tabindex="-1">${esc(step.title)}</h1>
        ${stepper(n)}
        <form id="request-form" class="request-form" data-step="${n}" novalidate>
          ${body}
          <div class="form-actions">${actions}</div>
        </form>
      </section>`,
    mount: mountRequestForm,
  };
}

function summaryRow(term, value, editHref = null, editLabel = '') {
  return `
    <div class="summary-row">
      <dt>${esc(term)}</dt>
      <dd>${esc(value)}</dd>
      ${editHref ? `<a class="summary-edit" href="${editHref}">Change<span class="sr-only"> ${esc(editLabel)}</span></a>` : ''}
    </div>`;
}

function mountRequestForm() {
  const form = document.getElementById('request-form');
  const step = Number(form.dataset.step);

  form.addEventListener('change', (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    if (input.name === 'goal') requestState.goal = input.value;
    if (input.name === 'level') requestState.level = input.value;
    if (input.name === 'days' || input.name === 'windows') {
      const values = [...form.querySelectorAll(`input[name="${input.name}"]:checked`)].map((i) => i.value);
      // Keep content order rather than click order.
      const order = (input.name === 'days' ? req.days : req.windows).map((x) => x.id);
      requestState[input.name] = order.filter((id) => values.includes(id));
    }
    showError(form, input.name, '');
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (step < 3) {
      const errors = stepErrors(step);
      form.querySelectorAll('.field[data-group]').forEach((fs) => showError(form, fs.dataset.group, ''));
      if (errors.length) {
        errors.forEach((e) => showError(form, e.group, e.message));
        form.querySelector(`.field[data-group="${errors[0].group}"] input`)?.focus();
        announce(errors.map((e) => e.message).join(' '));
        return;
      }
      navigate(stepHash(step + 1));
      return;
    }
    requestState.previewed = true;
    navigate('#/request/preview');
  });
}

function showError(form, group, message) {
  const fs = form.querySelector(`.field[data-group="${group}"]`);
  if (!fs) return;
  fs.querySelector('.error').textContent = message;
  fs.classList.toggle('has-error', Boolean(message));
  fs.querySelectorAll('input').forEach((i) => {
    if (message) i.setAttribute('aria-invalid', 'true');
    else i.removeAttribute('aria-invalid');
  });
}

function viewPreview() {
  if (!requestComplete()) {
    const resume = furthestStep();
    const started = requestState.goal || requestState.level || requestState.days.length || requestState.windows.length;
    return {
      title: 'No request to preview',
      nav: 'request',
      html: `
        <section class="wrap narrow empty-state">
          <p class="eyebrow">Request preview</p>
          <h1 tabindex="-1">There’s no request to preview yet.</h1>
          <p class="lede">Request answers live only on this page, so they clear when it reloads. It takes about a minute to fill in.</p>
          <div class="cta-row">
            <a class="button button-primary" href="${stepHash(resume)}">${started ? 'Continue your request' : 'Start a request'}</a>
            <a class="button button-secondary" href="#/lessons">Explore sample lessons</a>
          </div>
        </section>`,
    };
  }

  const s = requestState;
  return {
    title: 'Demo request — not sent',
    nav: 'request',
    html: `
      <section class="wrap narrow preview">
        <p class="eyebrow">Request preview</p>
        <h1 tabindex="-1">Demo request — not sent.</h1>
        <p class="lede">Here’s what the coach would receive. In this demo, nothing has left your browser.</p>

        <article class="message-card" aria-labelledby="message-title">
          <header class="message-head">
            <p id="message-title" class="message-to">To ${esc(brand.handle)}</p>
            <span class="status-pill"><span aria-hidden="true">○</span> Not sent</span>
          </header>
          <dl class="summary">
            ${summaryRow('Goal', labelFor(req.goals, s.goal))}
            ${summaryRow('Experience', labelFor(req.levels, s.level))}
            ${summaryRow('Preferred days', labelsFor(req.days, s.days, 'full'))}
            ${summaryRow('Times of day', labelsFor(req.windows, s.windows))}
            ${summaryRow('Time zone', timeZoneText)}
            ${summaryRow('Lesson', `Private lesson · ${liveLesson.durationLabel.toLowerCase()} · ${liveLesson.format}`)}
            ${summaryRow('From', `${req.sampleContact.name} · ${req.sampleContact.email}`)}
          </dl>
          <p class="message-foot">${tag('Fictional')} Contact details are sample data.</p>
        </article>

        <section class="next-steps" aria-labelledby="next-title">
          <h2 id="next-title" class="section-title small-title">In a working version</h2>
          <ol>
            ${req.nextSteps.map((t) => `<li>${esc(t)}</li>`).join('')}
          </ol>
        </section>

        <div class="cta-row">
          <button type="button" class="button button-primary" data-action="edit-request">Edit request</button>
          <button type="button" class="button button-secondary" data-action="start-over">Start over</button>
          <a class="button button-ghost" href="#/lessons">Explore sample lessons</a>
        </div>
      </section>`,
  };
}

function viewCourse() {
  const upNext = course.lessons.find((l) => !practiced.has(l.id));
  const startLabel = !practiced.size
    ? 'Start with lesson 1'
    : upNext
      ? `Continue with lesson ${course.lessons.indexOf(upNext) + 1}`
      : 'Revisit lesson 1';
  const startLesson = upNext ?? course.lessons[0];
  return {
    title: 'Sample lessons',
    nav: 'lessons',
    html: `
      <section class="wrap course">
        <div class="course-grid">
          <div>
            <p class="eyebrow">${esc(course.subtitle)} ${tag('Concept')}</p>
            <h1 tabindex="-1">${esc(course.title)}</h1>
            <p class="lede">${esc(course.intro)}</p>
            ${progressBlock()}
          </div>
          <div>
            <div class="section-head">
              <h2 class="section-title small-title">Lessons</h2>
              ${tag('Sample titles')}
            </div>
            ${lessonList()}
            <a class="button button-primary start-course" href="#/lessons/${esc(startLesson.id)}">${esc(startLabel)}</a>
          </div>
        </div>
        ${liveCta()}
      </section>`,
  };
}

function viewLesson(lesson) {
  const index = course.lessons.indexOf(lesson);
  const next = course.lessons[index + 1];
  const isDone = practiced.has(lesson.id);
  const total = course.lessons.length;

  const video = lesson.videoSrc
    ? `<video class="lesson-video" src="${esc(lesson.videoSrc)}" controls playsinline preload="metadata"></video>`
    : `
      <figure class="video-placeholder">
        <div class="video-motif" aria-hidden="true">${'<span></span>'.repeat(8)}</div>
        <figcaption>
          ${tag('Video placeholder', 'tag-on-dark')}
          <span>Your recorded lesson would play here.</span>
        </figcaption>
      </figure>`;

  const nextBlock = next
    ? `<a class="button button-secondary" href="#/lessons/${esc(next.id)}">Next lesson<span class="sr-only">: ${esc(next.title)}</span> <span aria-hidden="true">→</span></a>`
    : `
      <div class="final-note">
        <p><strong>That’s the last sample lesson.</strong> A live lesson is where you’d get feedback on what you’ve practiced.</p>
        <div class="cta-row">
          <a class="button button-primary" href="#/request">Request a lesson</a>
          <a class="button button-ghost" href="#/lessons">All sample lessons</a>
        </div>
      </div>`;

  return {
    title: `${lesson.title} · Sample lesson`,
    nav: 'lessons',
    html: `
      <section class="wrap lesson-layout">
        <div class="lesson-main">
          <a class="back-link" href="#/lessons"><span aria-hidden="true">←</span> All sample lessons</a>
          <p class="eyebrow">Sample lesson ${index + 1} of ${total}</p>
          <h1 tabindex="-1">${esc(lesson.title)}</h1>
          ${video}
          <div class="instruction">
            <h2 class="section-title small-title">Coach’s instruction</h2>
            <p class="placeholder-text">${tag('Placeholder')} Add your teaching notes and practice tips here.</p>
            <p class="focus-line"><span class="focus-label">Sample focus</span> ${esc(lesson.focus)}</p>
          </div>
          <div class="lesson-actions">
            <button type="button" class="button ${isDone ? 'button-done' : 'button-primary'}" id="practice-toggle" data-action="toggle-practiced" data-lesson="${esc(lesson.id)}">
              ${isDone ? '<span aria-hidden="true">✓</span> Practiced <span class="sr-only">(select to undo)</span>' : 'Mark practiced'}
            </button>
            ${next ? nextBlock : ''}
          </div>
          ${next ? '' : nextBlock}
        </div>
        <aside class="lesson-side" aria-label="Course progress">
          ${progressBlock({ compact: true })}
          ${lessonList({ currentId: lesson.id })}
          ${next ? liveCta('Want live feedback?') : ''}
        </aside>
      </section>`,
  };
}

function viewNotFound({ lessonMissing = false } = {}) {
  return {
    title: lessonMissing ? 'Lesson not found' : 'Page not found',
    nav: lessonMissing ? 'lessons' : null,
    html: `
      <section class="wrap narrow empty-state">
        <p class="eyebrow">${lessonMissing ? 'Sample lessons' : 'Not found'}</p>
        <h1 tabindex="-1">${lessonMissing ? 'That sample lesson doesn’t exist.' : 'That page isn’t part of this demo.'}</h1>
        <p class="lede">${lessonMissing ? 'The link may be out of date. All four sample lessons are listed on the course page.' : 'Try one of these instead.'}</p>
        <div class="cta-row">
          ${lessonMissing
            ? '<a class="button button-primary" href="#/lessons">All sample lessons</a><a class="button button-ghost" href="#/">Home</a>'
            : '<a class="button button-primary" href="#/">Home</a><a class="button button-secondary" href="#/lessons">Sample lessons</a>'}
        </div>
      </section>`,
  };
}

/* ---------- router ---------- */

function currentPath() {
  let path = window.location.hash.replace(/^#/, '');
  if (!path) return '/';
  if (!path.startsWith('/')) path = `/${path}`;
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

function navigate(hash) {
  if (window.location.hash === hash) render();
  else window.location.hash = hash;
}

let firstRender = true;

function resolve(path) {
  if (path === '/') return viewHome();
  const stepMatch = path.match(/^\/request(?:\/([1-3]))?$/);
  if (stepMatch) {
    const wanted = Number(stepMatch[1] || 1);
    const allowed = furthestStep();
    if (wanted > allowed) {
      // Skipping ahead (e.g. a direct link): send them to the first unanswered step.
      window.location.replace(stepHash(allowed));
      return null;
    }
    return viewRequest(wanted);
  }
  if (path === '/request/preview') return viewPreview();
  if (path === '/lessons') return viewCourse();
  const lessonMatch = path.match(/^\/lessons\/([^/]+)$/);
  if (lessonMatch) {
    const lesson = course.lessons.find((l) => l.id === lessonMatch[1]);
    return lesson ? viewLesson(lesson) : viewNotFound({ lessonMissing: true });
  }
  return viewNotFound();
}

function render({ focus = true } = {}) {
  const view = resolve(currentPath());
  if (!view) return; // a redirect is in progress

  main.innerHTML = `<div class="view">${view.html}</div>`;
  document.title = `${view.title} · ${SITE_SUFFIX}`;
  document.querySelectorAll('[data-nav]').forEach((link) => {
    if (link.dataset.nav === view.nav) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  view.mount?.();

  if (focus && !firstRender) {
    window.scrollTo(0, 0);
    main.querySelector('h1')?.focus({ preventScroll: true });
  }
  firstRender = false;
}

/* ---------- actions ---------- */

main.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;

  if (action === 'edit-request') {
    navigate(stepHash(1));
  }

  if (action === 'start-over') {
    requestState = emptyRequest();
    announce('Request cleared.');
    navigate(stepHash(1));
  }

  if (action === 'toggle-practiced') {
    const id = target.dataset.lesson;
    if (practiced.has(id)) practiced.delete(id);
    else practiced.add(id);
    saveProgress();
    render({ focus: false });
    document.getElementById('practice-toggle')?.focus();
    announce(`${practiced.has(id) ? 'Marked as practiced.' : 'Marked as not practiced.'} ${practiced.size} of ${course.lessons.length} practiced.`);
  }

  if (action === 'reset-progress') {
    practiced.clear();
    saveProgress();
    render({ focus: false });
    document.getElementById('progress-text')?.focus();
    announce('Practice progress reset.');
  }
});

/* ---------- about dialog ---------- */

function setupAboutDialog() {
  const dialog = document.getElementById('about-dialog');
  const closeButton = document.getElementById('about-close');
  let opener = null;

  document.getElementById('about-points').innerHTML =
    about.points.map((p) => `<li>${esc(p)}</li>`).join('');
  document.getElementById('about-footnote').textContent = about.footnote;

  const open = (event) => {
    opener = event.currentTarget;
    dialog.showModal();
    closeButton.focus();
  };

  document.querySelectorAll('#about-open, [data-about-open]').forEach((btn) => btn.addEventListener('click', open));
  closeButton.addEventListener('click', () => dialog.close());
  // Clicking the backdrop (outside the dialog box) closes it.
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  // Fires for Escape, the close button and backdrop clicks alike.
  dialog.addEventListener('close', () => {
    if (opener && document.contains(opener)) opener.focus();
    opener = null;
  });
}

/* ---------- boot ---------- */

document.querySelectorAll('[data-brand]').forEach((el) => { el.textContent = brand[el.dataset.brand]; });

document.querySelector('.skip-link').addEventListener('click', (event) => {
  event.preventDefault();
  (main.querySelector('h1') ?? main).focus();
});
main.setAttribute('tabindex', '-1');

setupAboutDialog();
window.addEventListener('hashchange', () => render());
render();
