// All editable copy, lesson options and request-form links live here.
// This file ships to every visitor's browser. Keep private business details out of it
// (see CLAUDE.md).

export const brand = {
  siteName: 'Dance with JSPR',
  handle: '@jspr_dances',
};

// Launch control. Real request links activate only when this is exactly `true`
// AND the lesson's form URL (below) is valid. Keep it `false` until the coach
// has approved launch; configured URLs alone never turn requests on.
export const bookingEnabled = false;

// Coach-owned Tally form links, one per lesson option.
// A link is valid only if it is an https URL on the host tally.so (exact match,
// no username/password, no custom port). Otherwise that option stays in its
// explicit "preview only" state and links nowhere.
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
  eyebrow: 'Private FaceTime lessons with @jspr_dances',
  headline: 'Learn to dance. Start with the basics.',
  intro: 'One-on-one lessons from wherever you are. No studio, no audience — just you, your screen, and a little floor space.',
  primaryCta: 'Request a lesson',
  secondaryCta: 'How it works',

  optionsTitle: 'Choose your lesson',
  optionDetail: 'Private, one-on-one FaceTime lesson.',
  optionAction: (minutes) => `Request a ${minutes}-minute lesson`,
  optionsNote: 'Sending a request doesn’t book a lesson or charge you. A lesson is only confirmed once you’ve paid the coach’s invoice and received his confirmation email.',

  previewState: 'Preview only — requests aren’t open yet',

  // Confirmed by the coach. Keep wording faithful: don't add terms he hasn't stated
  // (no reschedule expiry, no definition of "late", no technical-failure rules).
  beforeTitle: 'Before you request',
  beforeGroups: [
    {
      title: 'When lessons run',
      items: [
        'Monday–Saturday. No Sundays.',
        'Lessons start between 8 a.m. and 5 p.m. Pacific Time.',
        'Please request at least 48 hours ahead.',
      ],
    },
    {
      title: 'Ages and guardians',
      items: [
        'Students must be 4 or older.',
        'For anyone under 18, a parent or guardian handles the request, payment and communication, and is present during the lesson.',
      ],
    },
    {
      title: 'Cancelling and rescheduling',
      items: [
        'One reschedule is allowed with at least 24 hours’ notice.',
        'Late cancellations and no-shows are nonrefundable.',
        'If the coach cancels, you can choose another time or a refund.',
      ],
    },
  ],

  processTitle: 'How it works',
  processTimeZone: 'The coach works in Pacific Time. Your request form asks you to confirm your own time zone, so proposed times are always clear.',
  process: [
    { title: 'Send a request', text: 'Pick a lesson length and share two times that could work, at least 48 hours ahead.' },
    { title: 'The coach replies', text: 'He checks his calendar and emails you within 24 hours to approve a time or suggest another.' },
    { title: 'Receive an invoice', text: 'After he approves a time, he sends you a PayPal invoice. Payment is due within 24 hours of approval.' },
    { title: 'Get your confirmation', text: 'After he sees your payment, he emails your confirmation and joining instructions.' },
  ],
};

// Home media slot. Leave `src` null to show the decorative dance-count graphic.
// Set `src` and `alt` once the coach supplies and approves a photo or video still.
export const homeMedia = {
  src: null,
  alt: '',
};

// Shown in the preview-only dialog (reachable only while requests are not open for that option).
export const preview = {
  title: 'Preview only',
  points: [
    'Requests aren’t open yet, so this button doesn’t send anything.',
    'No request was made, nothing was booked, and nothing was charged.',
    'When requests open, this button will take you to the coach’s request form.',
  ],
};
