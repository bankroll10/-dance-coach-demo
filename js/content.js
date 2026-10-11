// All editable copy, coach details, provisional pricing and sample content live here.
// Anything marked `placeholder` or `sample` is awaiting the coach's approval.

export const brand = {
  handle: '@jspr_dances',
  wordmark: 'jspr_dances',
  // Provisional: the coach has not chosen a product name yet.
  nameStatus: 'Provisional identity — the product name has not been chosen yet.',
};

// Confirmed by the coach: FaceTime, about an hour, $30–$40 per single lesson.
// Package discounts exist, but their terms are unknown, so none are shown.
export const liveLesson = {
  format: 'FaceTime',
  durationLabel: 'About 60 minutes',
  priceLabel: '$30–$40',
  priceUnit: 'per single lesson',
  priceNote: 'Final lesson price confirmed with the coach. Package discounts are available.',
};

export const home = {
  eyebrow: 'Private lessons over FaceTime',
  headline: 'Learn to dance. Start with the basics.',
  intro: 'One-on-one lessons with @jspr_dances, from wherever you are. No studio, no audience — just you, your phone, and a little floor space.',
  primaryCta: 'Request a lesson',
  secondaryCta: 'Explore sample lessons',
  // Proposed inquiry process. Not yet confirmed with the coach.
  processTitle: 'How requesting a lesson could work',
  processLabel: 'Proposed',
  process: [
    { title: 'Share your goals', text: 'Tell him what you want to work on and how much you’ve danced before.' },
    { title: 'Pick preferred times', text: 'Choose the days and times of day that suit you, in your own time zone.' },
    { title: 'Arrange the details', text: 'The coach follows up to settle the time, price and payment with you.' },
  ],
  recordedTitle: 'Practice at your own pace',
  recordedText: 'Explore a sample lesson sequence and see how learning between live sessions could work.',
};

// Home media slot. Set `src` (and `alt`) once approved coach media is supplied.
export const homeMedia = {
  src: null,
  alt: '',
  placeholderLabel: 'Your photo or video here',
  placeholderNote: 'We’ll add the media you choose.',
};

export const request = {
  goals: [
    { id: 'basics', label: 'Learn the basics from scratch' },
    { id: 'social', label: 'Feel confident dancing socially' },
    { id: 'event', label: 'Get ready for an event' },
    { id: 'fitness', label: 'Dance for fitness and fun' },
  ],
  levels: [
    { id: 'new', label: 'Brand new' },
    { id: 'little', label: 'A little experience' },
    { id: 'some', label: 'Some experience' },
  ],
  days: [
    { id: 'mon', label: 'Mon', full: 'Monday' },
    { id: 'tue', label: 'Tue', full: 'Tuesday' },
    { id: 'wed', label: 'Wed', full: 'Wednesday' },
    { id: 'thu', label: 'Thu', full: 'Thursday' },
    { id: 'fri', label: 'Fri', full: 'Friday' },
    { id: 'sat', label: 'Sat', full: 'Saturday' },
    { id: 'sun', label: 'Sun', full: 'Sunday' },
  ],
  windows: [
    { id: 'morning', label: 'Morning', hint: 'Before 12 pm' },
    { id: 'afternoon', label: 'Afternoon', hint: '12–5 pm' },
    { id: 'evening', label: 'Evening', hint: 'After 5 pm' },
  ],
  // Fictional, shown in disabled fields. The demo never collects real contact details.
  sampleContact: {
    name: 'Alex Sample',
    email: 'alex.sample@example.com',
  },
  nextSteps: [
    'The coach would review your goals and preferred times.',
    'He would confirm a time that works for both of you.',
    'He would confirm the price — single lesson or package — and how payment is arranged.',
    'You would meet on FaceTime for your lesson.',
  ],
};

// Sample curriculum. Titles are illustrative; the coach has not approved a curriculum
// or supplied media. Set a lesson's `videoSrc` once approved recordings are available.
export const course = {
  title: 'First Steps',
  subtitle: 'A sample beginner course',
  intro: 'Four short lessons to show how recorded learning could work alongside live lessons. Titles and order are illustrative.',
  lessons: [
    { id: 'find-the-beat', title: 'Find the beat', focus: 'Hearing the rhythm in a song and counting along.', videoSrc: null },
    { id: 'weight-shifts', title: 'Weight shifts', focus: 'Moving comfortably from one foot to the other.', videoSrc: null },
    { id: 'basic-step', title: 'A basic step, four ways', focus: 'One simple step, varied a few different ways.', videoSrc: null },
    { id: 'put-it-together', title: 'Put it together', focus: 'Linking what you’ve practiced into a short sequence.', videoSrc: null },
  ],
};

export const about = {
  title: 'About this demo',
  points: [
    'Lesson requests are simulated. Nothing is sent, saved to a server, or charged.',
    'The course, lesson titles and curriculum are illustrative samples.',
    'Coach photos, videos, branding and the product name are pending his approval.',
    'Lesson length and the $30–$40 single-lesson range reflect the coach’s current reported details.',
  ],
  footnote: 'Practice checkmarks are stored only in this browser. Request answers disappear when you reload.',
};
