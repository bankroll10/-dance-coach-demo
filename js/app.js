import { brand, bookingEnabled, requestForms, lessons, home, homeMedia, preview } from './content.js';

const main = document.getElementById('main');

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);

/* ---------- request form links ---------- */

const FORM_HOST = 'tally.so';

// A form URL is valid only if it parses as https on exactly tally.so, with no
// embedded credentials and no custom port. Parsing (not string matching) rules out
// lookalikes such as tally.so.example.com, example.com/tally.so or tally.so@evil.com.
function validFormUrl(raw) {
  if (typeof raw !== 'string' || !raw.trim()) return null;
  try {
    const url = new URL(raw.trim());
    const ok = url.protocol === 'https:'
      && url.hostname === FORM_HOST
      && url.username === ''
      && url.password === ''
      && url.port === '';
    return ok ? url.href : null;
  } catch {
    return null;
  }
}

// Real links need BOTH the explicit launch flag and a valid URL for that lesson.
// Otherwise the option stays preview-only, so a visitor never reaches a dead link
// and configuring URLs alone never opens requests.
function formUrl(lessonId) {
  return bookingEnabled === true ? validFormUrl(requestForms[lessonId]) : null;
}

const anyPreviewOnly = lessons.some((lesson) => !formUrl(lesson.id));

/* ---------- view ---------- */

function mediaSlot() {
  if (homeMedia.src) {
    return `<figure class="media-slot has-media"><img src="${esc(homeMedia.src)}" alt="${esc(homeMedia.alt)}"></figure>`;
  }
  // Decorative stand-in until the coach supplies a photo.
  const bars = [38, 62, 46, 84, 54, 72, 40, 92]
    .map((h, i) => `<span class="motif-bar" style="--h:${h}%"><span class="motif-count">${i + 1}</span></span>`)
    .join('');
  return `<div class="media-slot" aria-hidden="true"><div class="media-motif">${bars}</div></div>`;
}

function optionCard(lesson) {
  const url = formUrl(lesson.id);
  const label = home.optionAction(lesson.minutes);
  const action = url
    ? `<a class="button button-primary" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}<span class="sr-only"> (opens the coach’s request form in a new tab)</span></a>`
    : `<button type="button" class="button button-primary" data-preview-lesson="${esc(lesson.id)}" aria-describedby="state-${esc(lesson.id)}">${esc(label)}</button>
       <p class="option-state" id="state-${esc(lesson.id)}"><span class="tag">Preview</span> ${esc(home.previewState)}</p>`;
  return `
    <li class="option">
      <p class="option-length">${lesson.minutes} minutes</p>
      <h3 class="option-name">${lesson.minutes}-minute lesson</h3>
      <p class="option-price"><span aria-hidden="true">$${lesson.price}</span><span class="option-currency" aria-hidden="true">${esc(lesson.currency)}</span><span class="sr-only">${lesson.price} US dollars</span></p>
      <p class="option-detail">${esc(home.optionDetail)}</p>
      ${action}
    </li>`;
}

function render() {
  main.innerHTML = `
    <div class="view">
      <section class="hero">
        <div class="wrap hero-grid">
          <div class="hero-copy">
            <p class="counts" aria-hidden="true"><span>5</span><span>6</span><span>7</span><span>8</span></p>
            <p class="eyebrow">${esc(home.eyebrow)}</p>
            <h1 class="hero-title">${esc(home.headline)}</h1>
            <p class="lede">${esc(home.intro)}</p>
            <div class="cta-row">
              <a class="button button-primary" href="#lessons">${esc(home.primaryCta)}</a>
              <a class="button button-secondary" href="#how-it-works">${esc(home.secondaryCta)}</a>
            </div>
          </div>
          ${mediaSlot()}
        </div>
      </section>

      <section class="wrap band" id="lessons" aria-labelledby="lessons-title">
        <h2 id="lessons-title" class="section-title">${esc(home.optionsTitle)}</h2>
        <ul class="options">${lessons.map(optionCard).join('')}</ul>
        <p class="fine-print">${esc(home.optionsNote)}</p>
      </section>

      <section class="wrap band" id="before-you-request" aria-labelledby="before-title">
        <h2 id="before-title" class="section-title">${esc(home.beforeTitle)}</h2>
        <div class="policies">
          ${home.beforeGroups.map((group) => `
            <div class="policy-group">
              <h3>${esc(group.title)}</h3>
              <ul>${group.items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>
            </div>`).join('')}
        </div>
      </section>

      <section class="wrap band process" id="how-it-works" aria-labelledby="process-title">
        <div class="section-head">
          <h2 id="process-title" class="section-title">${esc(home.processTitle)}</h2>
        </div>
        <ol class="process-list">
          ${home.process.map((step, i) => `
            <li>
              <span class="count" aria-hidden="true">${i + 1}</span>
              <h3>${esc(step.title)}</h3>
              <p>${esc(step.text)}</p>
            </li>`).join('')}
        </ol>
        <p class="process-note">${esc(home.processTimeZone)}</p>
      </section>
    </div>`;
}

/* ---------- preview-only dialog ---------- */

function setupPreviewDialog() {
  const dialog = document.getElementById('preview-dialog');
  const pill = document.getElementById('preview-pill');
  const choice = document.getElementById('preview-choice');
  const closeButton = document.getElementById('preview-close');
  let opener = null;

  document.getElementById('preview-title').textContent = preview.title;
  document.getElementById('preview-points').innerHTML = preview.points.map((p) => `<li>${esc(p)}</li>`).join('');
  pill.hidden = !anyPreviewOnly;

  const open = (opened, lessonId) => {
    opener = opened;
    const lesson = lessons.find((l) => l.id === lessonId);
    choice.hidden = !lesson;
    if (lesson) choice.textContent = `You chose: ${lesson.minutes}-minute lesson · $${lesson.price} ${lesson.currency}`;
    dialog.showModal();
    closeButton.focus();
  };

  pill.addEventListener('click', () => open(pill, null));
  main.addEventListener('click', (event) => {
    const button = event.target.closest('[data-preview-lesson]');
    if (button) open(button, button.dataset.previewLesson);
  });
  closeButton.addEventListener('click', () => dialog.close());
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
  main.focus();
});

render();
setupPreviewDialog();
