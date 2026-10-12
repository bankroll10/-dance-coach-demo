# Live-lesson pilot: operations guide

**Internal. Not part of the public website.** `scripts/stage-demo.sh` publishes only `index.html`, `styles.css` and `js/`, so this folder is never deployed.

> **This repository is public.** Student-facing business policies may live here. Do **not** commit the coach's legal/agreement name, revenue-share or other private agreement terms, student information, or Tally/PayPal credentials. The coach has approved one email address for public student/privacy contact (see section 1); it appears in this document and the privacy-notice draft only, and is **not yet on the website**. Items marked `[HELD OUTSIDE REPO]` belong in a private note shared between the operator and the coach.

Nothing in this workflow is automated. The website only links to the coach's own Tally forms. Everything after that (calendar checks, time-zone conversion, invoices, payment checks, confirmations, the ledger, and the data cleanup in section 6) is done by hand.

The form itself is specified in [`request-form-spec.md`](request-form-spec.md). That file is the single source of truth for field labels, policy wording and the thank-you message.

---

## 1. Confirmed facts and open items

### Confirmed

| Item | Value |
| --- | --- |
| Site name | Dance with JSPR |
| Coach's public handle | @jspr_dances |
| Coach's name for the agreement | `[HELD OUTSIDE REPO]` |
| Coach's email (booking notifications) | `optimizedlifestyles88@gmail.com`. The coach has **approved it for public student/privacy contact**. That is permission to use it where needed, not a decision to publish it: it is **not on the website** and must not be added without a specific instruction. |
| Lesson format | FaceTime only. No other platform is offered or advertised. |
| 30-minute private lesson | $30 USD |
| 60-minute private lesson | $40 USD |
| Days | Monday–Saturday. **No Sundays.** |
| Lesson **start** times | 8 a.m. through 5 p.m. Pacific, i.e. in **America/Los_Angeles** (daylight saving applies; never hard-code PST or a UTC offset) |
| Lead time | Students request at least **48 hours** ahead |
| Coach's reply target | Within **24 hours** |
| Payment deadline | Due within **24 hours after the coach approves a time** |
| Student ages | **4 and up** |
| Students under 18 | A parent or guardian handles the request, payment and communication, and is **present during the lesson** |
| Reschedule | **One** reschedule, with at least **24 hours'** notice |
| Late cancellations and no-shows | **Nonrefundable** |
| If the coach cancels | The student chooses **another time or a refund** |
| Invoicing | The coach sends PayPal invoices |
| Recorded courses | Deferred. Not advertised. |

These student-facing terms appear on the public page ("Before you request") and in the form's policy text. Keep all three identical in meaning.

### Workflow (agreed)

1. Student (or parent/guardian) submits a lesson request (Tally form).
2. Coach receives an email.
3. Coach checks his calendar and approves a time or proposes another.
4. Coach manually sends a PayPal invoice.
5. Coach verifies payment in his own PayPal account.
6. Coach manually sends confirmation and joining instructions.

The website stays preview-only until `bookingEnabled` is set to `true` in `js/content.js` **and** valid `tally.so` form URLs are configured. A person does both, only after the coach approves launch.

### Request forms (coach-owned Tally) and who does what

| Lesson | Price | Form | Site setting |
| --- | --- | --- | --- |
| 30 minutes | $30 USD | `https://tally.so/r/dWLQaV` | `requestForms['30']` |
| 60 minutes | $40 USD | `https://tally.so/r/PdM81x` | `requestForms['60']` |

- The **coach owns the forms** and handles student requests and notifications. His Tally email notifications to himself are on.
- **The operator** (who maintains the site) receives **payment summaries only**: no student names, no contact details and no children's age groups. The ledger in section 4 is built that way, and the coach shares only its student-free columns.
- The site has `bookingEnabled = true` **on `feature/live-lesson-pilot` only**. It is not merged and not deployed, and it stays `noindex` until a launch decision.

### Verification status

| Check | Status | Who |
| --- | --- | --- |
| The operator submitted a clearly labeled test through each form | Done | **User-reported** |
| The coach saw each test in Tally and received the notification email | Done | **User-reported** (the coach's confirmation, relayed by the operator; not independently observed) |
| Each site button opens the right form (30 → `dWLQaV`, 60 → `PdM81x`), in a new tab with `noopener noreferrer`; both prices, durations and policy text unchanged; preview markers gone; nothing submitted by the site | Checked | Automated browser checks on the local build; the Tally links were intercepted, so no request reached Tally |
| Titles, prices and fields shown on the live Tally pages | **Not checked** | The build environment cannot reach `tally.so` (blocked by its network policy), so the public pages were not inspected |
| The live forms match [`request-form-spec.md`](request-form-spec.md) field by field (conditional guardian fields, wording, age bands, policy text) | **Not checked** | Needs a person to compare the live forms with the spec |
| Email delivery, and what the notification email contains | Not independently checked | Relies on the coach's report |

### Not specified (do not invent; ask the coach before relying on any of these)

| Item | What is unknown |
| --- | --- |
| "Late" cancellation | The cut-off that makes a cancellation "late" isn't stated. (The 24-hour reschedule notice is stated, but it hasn't been confirmed as the same threshold.) |
| Timely cancellations | Whether a cancellation that is *not* late is refunded isn't stated. |
| Rescheduling details | Anything beyond "one reschedule with at least 24 hours' notice": for example, whether the rescheduled time must be used within a certain period, what happens if a student asks to reschedule with less than 24 hours' notice, or a second reschedule. None is defined. |
| Coach-cancellation refunds | How and when a refund is paid. |
| Technical problems | No policy exists for connection or technical failures. |
| Guardian absent | What happens if a parent or guardian isn't present for a minor's lesson. |
| Missed payment | What happens when the 24-hour payment deadline passes (releasing the time is the operating assumption, not a stated policy). |
| Final agreement | Including revenue share. Needed before the ledger's adjustment column can be used. |

---

## 2. Request form

The coach's two Tally forms are live and published (see section 1). [`request-form-spec.md`](request-form-spec.md) is the specification they were meant to follow: reusable structure for both lesson options, exact labels, help text, conditional guardian wording, the policy acknowledgment, the thank-you message, a draft privacy notice (**not ready to publish**), a setup checklist and an end-to-end test checklist. Whether the live forms match it has not been checked (see "Verification status").

Operator rules that follow from the confirmed facts:

- Collect **no** child email, full date of birth, address, health information, uploads or payment details. FaceTime contact details are arranged privately after approval.
- Time zone and conversion are checked **by hand** by the coach. The form does not validate them.

---

## 3. Draft email templates

All bracketed text is a placeholder. Student-facing terms below match section 1. Anything marked `[confirm]` is not yet specified; get the coach's answer before sending.

For a student under 18, address the parent or guardian who submitted the request.

### 3a. Approve a time and explain the invoice

**Subject:** Your lesson request: `[lesson option]` on `[date]`

> Hi `[requester first name]`,
>
> Thanks for your request for a `[30-minute / 60-minute]` FaceTime lesson. I can do **`[day, date, start time, requester's time zone]`** (`[same time in Pacific Time]`).
>
> To hold that time, please pay the PayPal invoice I'm sending separately (`$[30 / 40]` USD) **within 24 hours of this email**. Your lesson isn't confirmed until I've received your payment and emailed you a confirmation.
> `[confirm: what happens if payment isn't received in time, e.g. the time is released]`
>
> `[For a student under 18:]` A parent or guardian needs to be present during the lesson.
>
> Policies: one reschedule is allowed with at least 24 hours' notice. Late cancellations and no-shows are nonrefundable. If I need to cancel, you can choose another time or a refund.
>
> `[Coach name]`

### 3b. Propose a different time

**Subject:** Your lesson request: a different time

> Hi `[requester first name]`,
>
> Thanks for your request. I can't do either of the times you suggested. Would any of these work instead?
>
> - `[option A: day, date, start time, requester's time zone]` (`[Pacific Time]`)
> - `[option B: day, date, start time, requester's time zone]` (`[Pacific Time]`)
>
> Reply with the one you'd prefer and I'll send the invoice. `[confirm: how long proposed times are held]`
>
> Nothing is booked or charged until a time is agreed, you've paid the invoice, and I've emailed you a confirmation.
>
> `[Coach name]`

### 3c. Decline a request that can't be offered

Use when the requested times fall outside the confirmed availability (Sunday, or a start before 8 a.m. or after 5 p.m. Pacific, after conversion) or are less than 48 hours away. Prefer template 3b where possible.

**Subject:** Your lesson request

> Hi `[requester first name]`,
>
> Thanks for your request. Lessons run Monday–Saturday, starting between 8 a.m. and 5 p.m. Pacific Time, and need to be requested at least 48 hours ahead. `[the times you suggested fall outside that]`. You're welcome to send a new request with other times.
>
> `[Coach name]`

### 3d. Confirm a verified payment and send joining details

**Subject:** Confirmed: your `[lesson option]` on `[date]`

> Hi `[requester first name]`,
>
> I've received your payment, and your lesson is confirmed:
>
> - **When:** `[day, date, start time, requester's time zone]` (`[Pacific Time]`), `[duration]` minutes
> - **How to join:** FaceTime. `[FaceTime contact details, shared privately by the coach]`
> `[For a student under 18:]` - **Parent/guardian:** a parent or guardian needs to be present during the lesson.
>
> Policies: one reschedule is allowed with at least 24 hours' notice. Late cancellations and no-shows are nonrefundable. If I need to cancel, you can choose another time or a refund.
>
> See you then!
>
> `[Coach name]`

---

## 4. Booking ledger: column specification

A minimal shared spreadsheet, **filled in by hand** (nothing updates it automatically). It deliberately holds **no student names, emails, ages or free-text answers**. Use the request reference to look the person up in Tally when needed.

| Column | Meaning |
| --- | --- |
| `request_ref` | A short reference from the Tally submission (e.g. its submission ID). Non-identifying. |
| `invoice_ref` | The PayPal invoice number. Blank until an invoice is sent. |
| `session_date` | Date of the lesson in ISO format (YYYY-MM-DD), in Pacific Time. Blank until a time is agreed. |
| `duration_min` | `30` or `60`. |
| `gross_payment_usd` | Amount the student paid, before fees. |
| `processing_fee_usd` | The **actual** fee PayPal charged, read from the coach's PayPal account. Not an estimate. |
| `refund_usd` | Amount refunded, if any. |
| `revenue_share_adjustment` | `[TBD: calculation per the final agreement]`. Do not fill in until the agreement is final. |
| `status` | One of the statuses in section 5. |
| `monthly_settlement` | The settlement month (YYYY-MM) in which this row is settled. Blank until then. |
| `request_deleted_on` | *Optional.* The date the original Tally request and its notification email were deleted (section 6). Blank until then. Holds no student information. |

Keep the ledger in a private, access-controlled sheet shared only with the parties to the agreement. The operator receives **payment summaries only**, built from these columns: never student names, contact details or children's age groups.

---

## 5. Manual operating steps

**Statuses used in the ledger:** `requested` → `time proposed` → `time approved, awaiting payment` → `paid, confirmed` → `completed`. Closing statuses: `declined`, `released`, `cancelled`, `rescheduled`, `refunded`.

1. **New request arrives.** The coach gets an email from Tally. Add a ledger row (`request_ref`, `duration_min`, status `requested`). Reply within 24 hours.
2. **Check the request against the confirmed rules.**
   - The requester's two times are **entered in the requester's own time zone**. Convert each to **America/Los_Angeles** with a calendar or time-zone tool that handles daylight saving. Do not rely on a fixed offset, and re-check the **weekday after conversion**, because conversion can change the day.
   - The converted **start** must be **Monday–Saturday** and between **8 a.m. and 5 p.m. Pacific**.
   - The start must be at least **48 hours** after the request was submitted.
   - For a minor: check the form shows the guardian acknowledgment and an age group (4–7, 8–12, 13–17). The student must be 4 or older.
3. **Check for conflicts.** Check the coach's calendar for existing lessons, holds and personal commitments, including any time already offered to another student that hasn't been released. Compare in Pacific Time.
4. **Reply.**
   - If one of the student's options works: send template 3a. Place a **tentative hold** on the calendar. Status `time approved, awaiting payment`.
   - If neither works but another time does: send template 3b. Status `time proposed`.
   - If the request can't be offered (outside availability or lead time): send template 3c, or 3b with alternatives. Status `declined`.
5. **Send the PayPal invoice** from the coach's own PayPal account for the right amount ($30 or $40 USD). Record `invoice_ref`. Payment is due within 24 hours of approval.
6. **Verify payment** in the coach's PayPal account, not from a screenshot or the student's say-so. Record `gross_payment_usd` and the actual `processing_fee_usd`.
7. **Confirm.** Send template 3d with joining details. Turn the calendar hold into a firm entry. Status `paid, confirmed`. Fill in `session_date`.
8. **If payment doesn't arrive** within 24 hours after approval: the operating assumption is to remove the calendar hold, set status `released`, and tell the requester by email that the time was released and they're welcome to request again. `[confirm with the coach: not a stated policy]`
9. **Reschedule request.** One reschedule is allowed with at least 24 hours' notice. Move the calendar entry and update `session_date`; note the reschedule was used (outside the ledger's student-free columns, e.g. in the coach's calendar entry). Anything beyond that (a second reschedule, or a request with less than 24 hours' notice) isn't covered by a stated policy. The coach decides, and the answer should be recorded for next time.
10. **Cancellations.**
    - Late cancellations and no-shows are nonrefundable. The "late" cut-off is not specified (see section 1), so the coach confirms what applies before replying.
    - If the **coach** cancels, offer the student another time **or** a refund (their choice). For a refund, issue it from PayPal, then record `refund_usd` and status `refunded`.
11. **After the lesson**, set status `completed`.
12. **Data cleanup.** Delete old requests and notification emails on the schedule in section 6. This is manual.
13. **Monthly settlement:** `[TBD: process per the final agreement]`. At month end, fill in `revenue_share_adjustment` and `monthly_settlement` for that month's rows by hand.

---

## 6. Data retention and manual cleanup

**Approved by the coach** (retention periods):

- **Unbooked requests** (never became a confirmed lesson: declined, released, abandoned, no reply) and their notification emails are deleted **after 90 days**. `[confirm: counted from the day the request was received]`
- **Completed lessons:** the original request and its notification email are deleted **90 days after the lesson**.
- **Kept separately, and not deleted on this schedule:** records needed for ongoing lessons, for payment recordkeeping, or for unresolved refunds or disputes. These are kept for those purposes only. `[TBD: where payment records are kept and for how long. Recordkeeping obligations haven't been assessed.]`

**This cleanup is manual. No automation exists** (no scheduled job, no Tally rule, no mail filter). It happens only when the coach does it, so set a recurring reminder in the coach's own calendar (for example monthly) and keep to it.

**Deleting is two stages.** As reported from Tally's documentation, a deleted item first goes to **Trash**. It is **not** permanently removed until the Trash is emptied, or until a further 90 days pass. "Deleted" is therefore not "gone". **⚠ VERIFY** this in the coach's Tally account; it has not been confirmed here.

### Cleanup steps (the coach, in his own accounts)

1. **List what's due.** In the ledger, find rows that are `declined`, `released`, `cancelled` or unanswered with a request more than 90 days old, and `completed` rows whose `session_date` was more than 90 days ago. Use `request_ref` to find each request in Tally.
2. **Check the exceptions first.** Don't delete a request that is still needed for an ongoing student, for payment recordkeeping, or for an unresolved refund or dispute. Make sure the record that is needed is kept separately before deleting the original.
3. **Delete the request in Tally.** It goes to Trash.
4. **Empty Tally's Trash** to remove those items permanently. If you don't, they remain in Trash until Tally removes them (reported as another 90 days).
5. **Delete the matching notification email** in the coach's mailbox. Also empty the mailbox's own Trash/Bin if it keeps deleted mail for a while. **⚠ VERIFY** how the coach's mail provider handles deleted items.
6. **Record it** by filling in `request_deleted_on` in the ledger.
7. **Never** copy student names, emails or answers into the ledger, the operator's summaries, or this repository.

---

## 7. Remaining launch tasks and inputs

| Item | Notes |
| --- | --- |
| **Compare the live forms with the spec** | A person opens both Tally forms and checks fields, wording, conditional guardian logic, age bands and policy text against `request-form-spec.md`. Also confirm the live titles and prices match (30 min, $30 USD / 60 min, $40 USD). |
| **Approved privacy notice** | The draft in the form spec is **not ready to publish**. Retention and the public contact are now filled in; the owner's identity, Tally/PayPal details, who else sees summaries, and legal review for children are still open. The form's privacy checkbox (field 13) is added only after the notice is approved. |
| **Where the privacy notice and contact appear** | The coach approved the email for public student/privacy contact. Whether and where to show it on the website (for example the footer or a privacy page) needs a specific instruction. |
| **Answers to the "Not specified" items** (section 1) the coach wants applied | Late-cancellation cut-off, timely-cancellation refunds, reschedule details, technical problems, guardian absence, missed payment |
| **Payment-record retention** | Where and for how long payment records are kept (section 6) |
| **Launch decision and deployment** | The site is not merged or deployed and stays `noindex`. Deployment, removing `noindex`, and any merge are separate, explicitly authorized steps. |
| **Final agreement** (including revenue share) | Needed before the ledger's adjustment column can be used. Kept outside this repository. |
| **Home photo/video** | The home page uses a decorative graphic until one is supplied. |
