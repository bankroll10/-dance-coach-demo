// All editable copy, lesson options and request-form links live here.
// This file ships to every visitor's browser. Keep private business details out of it
// (see CLAUDE.md).

export const brand = {
  siteName: 'Dance with JSPR',
  handle: '@jspr_dances',
};

// Coach-owned Tally form links, one per lesson option.
// While a link is empty (or not a valid https URL) the site shows an explicit
// "preview only" state for that option instead of linking anywhere.
// Using the same URL for both options is fine if a single form has a lesson field.
export const requestForms = {
  '30': '',
  '60': '',
};

export const lessons = [
  { id: '30', minutes: 30, price: 30, currency: 'USD' },
  { id: '60', minutes: 60, price: 40, currency: 'USD' },
];

export const home = {
  eyebrow: 'Private video lessons with @jspr_dances',
  headline: 'Learn to dance. Start with the basics.',
  intro: 'One-on-one lessons from wherever you are. No studio, no audience — just you, your screen, and a little floor space.',
  primaryCta: 'Request a lesson',
  secondaryCta: 'How it works',

  optionsTitle: 'Choose your lesson',
  optionDetail: 'Private, one-on-one video lesson.',
  optionAction: (minutes) => `Request a ${minutes}-minute lesson`,
  optionsNote: 'Sending a request doesn’t book a lesson or charge you. A lesson is only confirmed once you’ve paid the coach’s invoice and received his confirmation email.',

  previewState: 'Preview only — request form not connected yet',

  processTitle: 'How it works',
  processTimeZone: 'The coach works in Pacific Time. Your request form asks you to confirm your own time zone, so proposed times are always clear.',
  process: [
    { title: 'Send a request', text: 'Pick a lesson length and share two times that could work for you.' },
    { title: 'The coach replies', text: 'He checks his calendar, then emails to approve a time or suggest another.' },
    { title: 'Receive an invoice', text: 'Once a time is agreed, he sends you a PayPal invoice for the lesson.' },
    { title: 'Get your confirmation', text: 'After he sees your payment, he emails your confirmation and joining instructions.' },
  ],
};

// Home media slot. Leave `src` null to show the decorative dance-count graphic.
// Set `src` and `alt` once the coach supplies and approves a photo or video still.
export const homeMedia = {
  src: null,
  alt: '',
};

// Shown in the preview-only dialog (only reachable while a form link is missing).
export const preview = {
  title: 'Preview only',
  points: [
    'The request form isn’t connected yet, so this button doesn’t send anything.',
    'No request was made, nothing was booked, and nothing was charged.',
    'Once the coach’s form is linked, this button will open it.',
  ],
};
