# Live-lesson pilot: operations guide

**Internal. Not part of the public website.** `scripts/stage-demo.sh` publishes only `index.html`, `styles.css` and `js/`, so this folder is never deployed.

> **This repository is public.** Do not commit private details here. That means the coach's notification email address, his legal/agreement name, revenue-share terms, student information, or Tally/PayPal links and credentials. Items marked `[HELD OUTSIDE REPO]` should live in a private note shared between the operator and the coach.

Nothing in this workflow is automated. The website only links to a coach-owned Tally form. Everything after that (calendar checks, invoices, payment checks, confirmations, the ledger) is done by hand by the coach or the operator.

---

## 1. Confirmed facts and unresolved decisions

### Confirmed

| Item | Value |
| --- | --- |
| Site name | Dance with JSPR |
| Coach's public handle | @jspr_dances |
| Coach's name for the agreement | `[HELD OUTSIDE REPO]` |
| Booking notification email | `[HELD OUTSIDE REPO]` (not on the website; not published without the coach's approval) |
| Coach's time zone | America/Los_Angeles (Pacific Time) |
| Lesson format | Private FaceTime lessons (Zoom is not offered and must not be advertised) |
| 30-minute private lesson | $30 USD |
| 60-minute private lesson | $40 USD |
| General availability window | 8 a.m.–6 p.m. America/Los_Angeles (see the pending boundary question below) |
| Coach's reply time | Within 24 hours of a request |
| Lead time | Students request at least 48 hours ahead |
| Payment deadline | Within 24 hours after the coach approves a time |
| Who he wants to teach | Both adults and children (see "Pending": nothing for children is built or published yet) |
| Invoicing | The coach can send PayPal invoices |
| Recorded courses | Deferred. Not advertised in this version. |

### Pending (do not publish or promise any of these yet)

| Item | Question |
| --- | --- |
| Days of the week | Which days he teaches |
| Latest time | Whether 6 p.m. is the latest lesson **end** time or the latest **start** time |
| Minimum student age | `[TBD]` |
| Children: parent/guardian | Booking and supervision requirements for under-age students `[TBD]` |
| Cancellation and rescheduling | Detailed terms. **No policy is approved.** A proposal is under discussion. Do not publish, quote or imply any version as final, in the site, forms, emails or this document. |
| Public contact email | Permission to publish one. Until given, the notification address stays private. |

### Workflow (agreed)

1. Student submits a lesson request (Tally form).
2. Coach receives an email.
3. Coach checks his calendar and approves a time or proposes another.
4. Coach manually sends a PayPal invoice.
5. Coach verifies payment in his own PayPal account.
6. Coach manually sends confirmation and joining instructions.

The website keeps requests in a preview-only state until `bookingEnabled` is set to `true` in `js/content.js` **and** valid `tally.so` form URLs are configured. Both are done by a person after the coach approves launch.

---

## 2. Proposed Tally form fields

Two forms (one per lesson option) or one form with a lesson field. The site accepts either, because each option has its own URL setting in `js/content.js` (`requestForms`). With two forms, show the lesson option as fixed text at the top of the form instead of a choice, and still include it in the notification email.

| # | Field | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| 1 | Name | Short text | Yes | |
| 2 | Email | Email | Yes | The coach's replies and the invoice go here. |
| 3 | Lesson option | Single choice, or fixed text | Yes | `30-minute lesson, $30 USD` / `60-minute lesson, $40 USD` |
| 4 | Your time zone | Dropdown | Yes | The student must **select or confirm** it. Do not guess it silently. Add the line "Times below are in this time zone." |
| 5 | Preferred option 1 | Date + time | Yes | Label it with the selected zone, e.g. "Option 1 (in the time zone you selected above)". |
| 6 | Preferred option 2 | Date + time | Yes | Same label. Must differ from option 1. |
| 7 | Dance goal and experience | Short text, plus an experience choice (brand new / some / experienced) | Yes | Keep it brief. Ask for no sensitive information. |
| 8 | Policies | Checkbox | Yes | "I've read the coach's policies." **Add only once the policies are approved** (`[TBD: policy link]`). |

**Rules the form should reflect** (confirmed):

- Preferred times must be at least **48 hours** after the request is submitted.
- The coach's general availability is 8 a.m.–6 p.m. Pacific Time. Show this window in the form's help text, converted for the selected time zone if possible. Whether 6 p.m. is a start or an end limit, and which days apply, are still pending (section 1), so do not state them on the form yet.
- **Do not add fields for children** (a child's name, age, or guardian details) and do not create a child-specific booking flow until the age and parent/guardian decisions are made.

Form settings to check in the coach's Tally account (the operator does not create or change these):

- Email notification to the coach's address `[HELD OUTSIDE REPO]` on every submission.
- The coach's address is not shown to the student anywhere in the form.
- Student-facing privacy notice `[TBD: required before launch, because the form collects names and emails]`.
- Optionally, a copy of the student's answers emailed to the student.

## 3. Submission (thank-you) message

> **Request received. Nothing is booked or charged yet.**
>
> Thanks, `[name]`. This is a request, not a booking. The coach will reply by email at the address you gave **within 24 hours** to approve one of your times or suggest another.
>
> After a time is agreed, he'll send a PayPal invoice, which is due within 24 hours of his approval. Your lesson is confirmed only once he has received your payment and emailed you a confirmation with joining instructions.
>
> If you haven't heard back after 24 hours, please reply to the email he sends or contact him at `[TBD: public contact route, if approved]`.

---

## 4. Draft email templates

All bracketed text is a placeholder. Nothing here is an approved policy.

### 4a. Approve a time and explain the invoice

**Subject:** Your lesson request: `[lesson option]` on `[date]`

> Hi `[student first name]`,
>
> Thanks for your request for a `[30-minute / 60-minute]` lesson. I can do **`[day, date, time, time zone]`**.
>
> To hold that time, please pay the PayPal invoice I'm sending separately (`$[30 / 40]` USD) **within 24 hours of this email**. Your time isn't confirmed until I've received your payment.
> `[TBD: wording for what happens if the deadline passes, e.g. the time is released. Confirm with the coach before sending.]`
>
> Once I see your payment, I'll email your confirmation and joining details.
>
> `[Cancellation / rescheduling terms: leave out until a policy is approved]`
>
> `[Coach name]`

### 4b. Propose a different time

**Subject:** Your lesson request: a different time

> Hi `[student first name]`,
>
> Thanks for your request. Neither of the times you suggested works for me. Would any of these work instead?
>
> - `[option A: day, date, time, time zone]`
> - `[option B: day, date, time, time zone]`
>
> Just reply with the one you'd prefer, and I'll send the invoice. `[TBD: how long the proposed times are held]`
>
> Nothing is booked or charged until a time is agreed and the invoice is paid.
>
> `[Coach name]`

### 4c. Confirm a verified payment and send joining details

**Subject:** Confirmed: your `[lesson option]` on `[date]`

> Hi `[student first name]`,
>
> I've received your payment, and your lesson is confirmed:
>
> - **When:** `[day, date, time, time zone]` (`[duration]` minutes)
> - **How to join:** FaceTime. `[FaceTime contact details and any joining instructions, supplied by the coach]`
> - **Before we start:** `[TBD: optional preparation, e.g. space, footwear]`
>
> `[Cancellation / rescheduling terms: leave out until a policy is approved]`
>
> See you then!
>
> `[Coach name]`

---

## 5. Booking ledger: column specification

A minimal shared spreadsheet, **filled in by hand** (nothing updates it automatically). It deliberately holds **no student names, emails or free-text answers**. Use the request reference to look the person up in Tally when needed.

| Column | Meaning |
| --- | --- |
| `request_ref` | A short reference from the Tally submission (e.g. its submission ID). Non-identifying. |
| `invoice_ref` | The PayPal invoice number. Blank until an invoice is sent. |
| `session_date` | Date of the lesson in ISO format (YYYY-MM-DD). Blank until a time is agreed. |
| `duration_min` | `30` or `60`. |
| `gross_payment_usd` | Amount the student paid, before fees. |
| `processing_fee_usd` | The **actual** fee PayPal charged, read from the coach's PayPal account. Not an estimate. |
| `refund_usd` | Amount refunded, if any. |
| `revenue_share_adjustment` | `[TBD: calculation per the final agreement]`. Do not fill in until the agreement is final. |
| `status` | One of the statuses in section 6. |
| `monthly_settlement` | The settlement month (YYYY-MM) in which this row is settled. Blank until then. |

Keep the ledger in a private, access-controlled sheet shared only with the parties to the agreement.

---

## 6. Manual operating steps

**Statuses used in the ledger:** `requested` → `time proposed` → `time approved, awaiting payment` → `paid, confirmed` → `completed`. Closing statuses: `declined`, `released`, `cancelled`, `refunded`.

1. **New request arrives.** The coach gets an email from Tally. Add a ledger row (`request_ref`, `duration_min`, status `requested`).
2. **Check the request.** The requested times should be at least 48 hours away and inside the coach's availability window (8 a.m.–6 p.m. Pacific; days and the 6 p.m. boundary are still pending, so the coach decides case by case). Reply within 24 hours.
   **Check for conflicts.** Before offering any time, check the coach's calendar for existing lessons, holds and personal commitments. Include any time already offered to another student that hasn't been released. Compare times in one zone (Pacific Time) to avoid time-zone mistakes.
3. **Reply.**
   - If one of the student's options is free: send template 4a. Place a **tentative hold** on the calendar. Status `time approved, awaiting payment`.
   - If neither is free: send template 4b with alternatives. Status `time proposed`.
   - If the coach can't offer lessons for this request: reply politely and set status `declined`.
4. **Send the PayPal invoice** from the coach's own PayPal account for the right amount ($30 or $40 USD). Record `invoice_ref`.
5. **Verify payment** in the coach's PayPal account, not from the student's say-so or a screenshot. Record `gross_payment_usd` and the actual `processing_fee_usd`.
6. **Confirm.** Send template 4c with joining details. Turn the calendar hold into a firm entry. Status `paid, confirmed`. Fill in `session_date`.
7. **If payment doesn't arrive** within 24 hours after approval: remove the calendar hold, set status `released`, and tell the student by email that the time was released and they're welcome to request again.
8. **If a student cancels or reschedules**, the coach decides case by case until a cancellation/rescheduling policy is approved. Don't quote any draft policy as final. Update the calendar and the ledger status (`cancelled`, or a new `session_date`). For a refund, issue it from PayPal, then record `refund_usd` and status `refunded`.
9. **After the lesson**, set status `completed`.
10. **Monthly settlement:** `[TBD: process per the final agreement]`. At month end, fill in `revenue_share_adjustment` and `monthly_settlement` for that month's rows by hand.

---

## 7. Unresolved inputs

Confirmed items (FaceTime, the 8 a.m.–6 p.m. Pacific window, the 24-hour reply, 48-hour lead time and 24-hour payment deadline) are in section 1. Still open:

| Input | Why it's needed | Status |
| --- | --- | --- |
| **Days of the week** he teaches | Needed before any availability is stated to students | `[TBD]` |
| **6 p.m.: latest start or latest end?** | Decides which times can be offered | `[TBD]` |
| **Minimum student age** | Needed before children are invited to request | `[TBD]` |
| **Parent/guardian booking and supervision requirements** | Needed before any child-directed form or copy | `[TBD]` |
| **Cancellation and rescheduling terms** | Used in templates 4a/4c and the policies checkbox. No version is approved. | `[TBD]` |
| **Permission to publish a public contact email** | The notification email is **not** public. A public contact route, if any, needs the coach's approval. | `[TBD]` |
| **Final agreement** (including revenue share) | Needed before the ledger's adjustment column can be used | `[TBD]` |
| **Tally form URLs** (30-minute and 60-minute) | Must be on `tally.so`. Together with `bookingEnabled = true` they turn requests on. | `[TBD]` |
| **Launch approval** (`bookingEnabled`) | The site stays preview-only until a person sets this to `true` | `[TBD]` |
| **Privacy notice** for the form | The form collects names and emails | `[TBD]` |
| **Home photo/video** | The home page uses a decorative graphic until one is supplied | `[TBD]` |
| **Launch hosting and indexing** | The site is `noindex` and this branch has not been deployed | `[TBD]` |
