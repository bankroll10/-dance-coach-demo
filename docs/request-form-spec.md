# Request form specification (Tally)

**Specification only. No form exists yet, and none should be created, published or linked until launch is explicitly approved.** The website stays preview-only (`bookingEnabled = false`, empty form URLs) until then.

This is for the **coach-owned** Tally account. Nothing here is a live form, and this repository must never contain submissions, the coach's notification email, personal contact details, or credentials.

**Needs verification.** The author has *not* verified Tally's current features, limits, pricing or data settings. Every item tagged **⚠ VERIFY** depends on a Tally capability that must be checked in the coach's account before relying on it. Don't assume a feature exists, works as described, or is free until you've seen it. If a capability is missing, use the stated fallback.

Related: [`pilot-operations.md`](pilot-operations.md) (confirmed facts, email templates, ledger, manual steps).

---

## 1. Structure: one reusable form, two lesson options

Build the form once, then duplicate it. The two copies differ **only** in these two values:

| | 30-minute form | 60-minute form |
| --- | --- | --- |
| `{{DURATION}}` | 30 | 60 |
| `{{PRICE}}` | 30 | 40 |
| Form name (shown in notification emails) | `Lesson request: 30 min, $30 USD` | `Lesson request: 60 min, $40 USD` |

The site accepts a separate URL for each (`requestForms` in `js/content.js`). If you ever use one shared form instead, add a required "Lesson option" choice (`30 minutes, $30 USD` / `60 minutes, $40 USD`) and point both settings at the same URL.

Optionally add a hidden field `lesson` with the value `30` or `60`. **⚠ VERIFY** that hidden fields are available. Fallback: the form name above identifies the lesson in each notification.

---

## 2. Form title and introduction

**Title:** `Request a {{DURATION}}-minute lesson`

**Introduction (text block):**

> **{{DURATION}}-minute private lesson · ${{PRICE}} USD · FaceTime**
>
> This form sends a lesson **request**. Nothing is booked or charged yet. The coach reviews your request and emails you, and a lesson is confirmed only after you pay his PayPal invoice and he emails you a confirmation.

---

## 3. Fields

Order matters. "Required" = the respondent can't submit without it.

### 3.1 Requester

| # | Exact label | Type | Required | Help text |
| --- | --- | --- | --- | --- |
| 1 | `Your name` | Short text | **Required** | `The adult making this request. If the lesson is for your child, this is you, the parent or guardian.` |
| 2 | `Your email` | Email | **Required** | `The coach replies here, and the invoice and confirmation are sent here.` |

### 3.2 Who the lesson is for

| # | Exact label | Type | Required | Options / help text |
| --- | --- | --- | --- | --- |
| 3 | `Who is this lesson for?` | Single choice | **Required** | `Myself (I am 18 or older)` · `My child or dependent (under 18)`<br>Help: `Students must be 4 or older.` |

**Conditional on field 3 = "My child or dependent (under 18)"** (show only then; hide otherwise). **⚠ VERIFY** that conditional logic is available. Fallback: always show both fields and mark them `Only if this lesson is for a child or dependent`. Note that "required" can't then be enforced for minors only, so the coach must check manually.

| # | Exact label | Type | Required (when shown) | Help text |
| --- | --- | --- | --- | --- |
| 4 | `Parent or guardian acknowledgment` | Checkbox | **Required** | Checkbox text: `I am the student's parent or guardian. I will handle the request, payment and communication, and I will be present during the whole lesson.` |
| 5 | `Student's age group` | Single choice | **Required** | Options: `4–7` · `8–12` · `13–17`<br>Help: `Choose an age group. We don't ask for a date of birth.` |

### 3.3 Time zone and preferred times

| # | Exact label | Type | Required | Help text |
| --- | --- | --- | --- | --- |
| 6 | `Student's time zone` | Dropdown | **Required** | Help: `Choose the time zone the student will be in for the lesson. Enter your two preferred times below in this time zone.`<br>Options: `Pacific Time (Los Angeles)` · `Mountain Time (Denver)` · `Mountain Time, Arizona (Phoenix)` · `Central Time (Chicago)` · `Eastern Time (New York)` · `Alaska Time (Anchorage)` · `Hawaii Time (Honolulu)` · `Other (tell us below)` |
| 6a | `Your time zone (city and region)` | Short text | **Required** when field 6 = `Other (tell us below)` | Shown only for "Other". Help: `For example: "London, UK".` **⚠ VERIFY** conditional logic. Fallback: make it optional and say `Only if you chose "Other"`. |
| 7 | `First choice: date` | Date | **Required** | Help (use for fields 7–8): see "Time help text" below. |
| 8 | `First choice: start time` | Time | **Required** | Same help text. |
| 9 | `Second choice: date` | Date | **Required** | Same help text. |
| 10 | `Second choice: start time` | Time | **Required** | Same help text. |

**Time help text (exact; show once above field 7, or under each time field):**

> `Enter these in the time zone you chose above. The lesson must start Monday–Saturday (no Sundays), between 8 a.m. and 5 p.m. Pacific Time, and at least 48 hours from now. For example: 8 a.m. Pacific is 11 a.m. Eastern, and 5 p.m. Pacific is 8 p.m. Eastern. Choose two different times. The coach will check the conversion and his availability.`

Notes:

- "Start" times only. The lesson then runs for the chosen length (30 or 60 minutes), so a 5 p.m. start is allowed for either option.
- The Pacific time zone is **America/Los_Angeles** (daylight saving applies). Never hard-code "PST" or a UTC offset in the form or in checks.
- The Eastern example above is correct year-round (the two zones change clock on the same dates). Don't add examples for other zones without checking them.
- **Date and time restrictions:** **⚠ VERIFY** whether Tally can set a minimum date, or block certain weekdays or time ranges. Even if it can, it works in one fixed zone and cannot convert from the student's zone to Pacific, so it **cannot** enforce the rule. See section 5.

### 3.4 Optional goal

| # | Exact label | Type | Required | Help text |
| --- | --- | --- | --- | --- |
| 11 | `Dance goal (optional)` | Long or short text, short limit **⚠ VERIFY** | Optional | `A sentence is plenty, for example: "learn a few basics for a wedding." Please don't include contact details, health information, or details about other people.` |

### 3.5 Policies and acknowledgment

**Policy text block (exact; show immediately above field 12):**

> **Lesson policies**
>
> - Lessons are held by FaceTime, Monday–Saturday (no Sundays). Lessons start between 8 a.m. and 5 p.m. Pacific Time.
> - Please request at least 48 hours ahead. The coach aims to reply within 24 hours.
> - Payment is due within 24 hours after the coach approves a time. A lesson is confirmed only after payment is received and the coach has emailed you a confirmation.
> - Students must be 4 or older. For anyone under 18, a parent or guardian handles the request, payment and communication, and is present during the lesson.
> - One reschedule is allowed with at least 24 hours' notice.
> - Late cancellations and no-shows are nonrefundable.
> - If the coach cancels, you can choose another time or a refund.

| # | Exact label | Type | Required | Checkbox text |
| --- | --- | --- | --- | --- |
| 12 | `Policies and request` | Checkbox | **Required** | `I've read the lesson policies above. I understand this form sends a request, not a confirmed booking: nothing is booked or charged until the coach approves a time, I pay his PayPal invoice, and he emails me a confirmation.` |
| 13 | `Privacy notice` | Checkbox | **Required once the notice is approved** | `I've read the privacy notice.` (link to the approved notice). **Do not add this field, or publish the form, until the privacy notice in section 7 is finished and approved.** |

The policy text mirrors the public page ("Before you request"). If the coach changes any term, change the page, this block, and the email templates together.

### 3.6 Deliberately not collected

No child's email, full date of birth, address, health information, file uploads, or payment details. No FaceTime number or Apple ID: the coach arranges those privately after approval, by email.

---

## 4. Thank-you message (exact)

**Title:** `Request received — needs review`

> Thank you, `[name]`. We've received your request.
>
> **Nothing is booked and nothing has been charged.** Your request needs the coach's review first.
>
> What happens next:
>
> 1. The coach aims to reply by email within 24 hours to approve one of your times or suggest another.
> 2. After he approves a time, he'll send a PayPal invoice. Payment is due within 24 hours of approval.
> 3. Once he has received your payment, he'll email your confirmation. Your lesson is confirmed only then.
>
> For students under 18, replies go to the parent or guardian email you entered.

Insert the respondent's name only if Tally supports it on the thank-you page (**⚠ VERIFY**). Otherwise delete `Thank you, [name].` and start at `We've received your request.`

**Do not** say "booked", "confirmed", "scheduled" or "paid" about the request itself.

---

## 5. Time zones and availability: how it's checked

The confirmed rule is **Monday–Saturday, start times 8 a.m. through 5 p.m. in America/Los_Angeles, after conversion from the student's time zone**, with at least 48 hours' lead time.

**For this manual pilot, the coach checks it. Nothing validates it automatically.** The form's help text states the rules, but a request can still arrive with a time outside them. When it does, the coach follows `pilot-operations.md`, section 5, step 2:

1. Convert each requested time from the student's zone to America/Los_Angeles using a tool that handles daylight saving.
2. Re-check the **weekday after conversion** (conversion can move a time into a different day, including into Sunday).
3. Confirm the start is between 8 a.m. and 5 p.m. Pacific inclusive, and at least 48 hours after submission.
4. If neither time fits, offer other times (template 3b) or decline (template 3c).

Do not describe this as automated validation anywhere (form, site, emails) unless it has been built and verified.

---

## 6. Setup checklist (coach-owned account)

The coach, or the operator acting on his direction, does these. Never share account passwords in chat or files. **⚠ VERIFY** how Tally lets a second person help (for example, workspace invitations) and whether that works on the coach's plan.

- [ ] The coach creates or signs in to his own Tally account. **⚠ VERIFY** current plan and limits, including whether everything in this spec (conditional logic, hidden fields, custom thank-you page, notifications) is available on the plan he uses, and whether any of it costs money. Don't enable a paid plan without his explicit approval.
- [ ] Build the 30-minute form from sections 2–4.
- [ ] Duplicate it for the 60-minute form and change only `{{DURATION}}`, `{{PRICE}}` and the form name.
- [ ] Set the **notification email** to the coach's private address (`[HELD OUTSIDE REPO]`). Confirm that the notification includes every answer and the form name. **⚠ VERIFY**
- [ ] Decide whether respondents get an emailed copy of their answers. **⚠ VERIFY** whether it's available. If it is, consider the privacy implications for minors' requests first.
- [ ] Set the custom thank-you page from section 4. **⚠ VERIFY**
- [ ] Review Tally's data-handling settings: where responses are stored, who can see them, how entries are exported and deleted. **⚠ VERIFY** and record the answers for the privacy notice. Check that Tally's own branding or tracking settings are acceptable to the coach.
- [ ] Turn off any option that would add fields, uploads or integrations not in this spec.
- [ ] Copy each form's public share link. Both must be `https://tally.so/...` (the site accepts **only** the host `tally.so`). If Tally gives a different address, such as a custom domain, the site will treat it as invalid and stay preview-only. Send the two links to the operator privately.
- [ ] **Do not publish the forms or share the links publicly yet.** Keep them private until the end-to-end test passes and launch is approved.

Nothing on the website changes until a later, explicitly authorized step sets the two URLs in `js/content.js` and flips `bookingEnabled` to `true`.

---

## 7. Draft privacy notice

> **DRAFT. NOT READY TO PUBLISH.** Unresolved items are marked `[TBD]`. It needs the coach's review, and legal review where indicated. Don't publish it, link it, or represent it as final.

**Who we are.** `[TBD: the name of the person or business responsible for this information. Needs the coach's decision. Keep any legal name outside the public repo until approved for publication.]`

**What we collect, and why.** When you request a lesson, we collect:

- the requester's **name** and **email**, to reply to you, send the PayPal invoice and confirm your lesson;
- whether the lesson is for an adult or for a child or dependent, and, for a child, an **age group** (4–7, 8–12 or 13–17) and the parent or guardian acknowledgment, to follow our age and supervision rules;
- your **time zone** and **two preferred dates and start times**, to find a time;
- an optional **dance goal**, so the coach can prepare;
- your acknowledgment of the lesson policies.

We do **not** ask for a child's email, date of birth, address, health information, files, or payment details on this form.

**Who handles it.** The form is provided by Tally, which processes the responses for us. `[TBD: describe Tally's role and storage location once verified, and link its own notice.]` Payment is handled separately through PayPal invoices sent by the coach. `[TBD: PayPal's role and link.]` `[TBD: whether anyone else, such as an assistant or operator, can see responses. Any financial ledger holds no student names or contact details.]`

**FaceTime details.** If your lesson goes ahead, the coach arranges FaceTime contact details privately by email after approval.

**Children.** Requests for anyone under 18 must come from a parent or guardian. `[Needs legal review: rules for collecting information about children, such as US COPPA for under-13s, have not been assessed.]`

**How long we keep it.** `[TBD: retention period, and when requests are deleted if no lesson takes place. Needs the coach's decision.]`

**Your choices.** You can ask to see, correct or delete your information. `[TBD: how to contact the coach. Depends on whether he approves a public contact email. Until he does, no address is published.]`

**Changes.** `[TBD: date and how updates are noted.]`

---

## 8. End-to-end test checklist

Run on the coach's forms, before launch approval. Use obviously fake test data and a throwaway email address that you control. **Never test with a real student's information, and never send a real PayPal invoice.** Delete the test submissions afterwards (**⚠ VERIFY** that Tally allows it) and record that you did.

**Content and rules**

- [ ] The title, duration, price and "FaceTime" are correct on **both** forms (30 → $30; 60 → $40), and nothing else differs.
- [ ] Every label, help text and the policy text match this document exactly.
- [ ] No field collects anything listed in section 3.6.

**Adult flow**

- [ ] Choose "Myself (I am 18 or older)": the guardian acknowledgment and age-group fields do **not** appear.
- [ ] A complete adult submission succeeds. The thank-you message matches section 4.

**Minor flow**

- [ ] Choose "My child or dependent (under 18)": the guardian acknowledgment and age group appear and are required.
- [ ] The age options are exactly 4–7, 8–12 and 13–17, with no date-of-birth field.
- [ ] A complete minor submission succeeds.

**Required fields**

- [ ] Submitting with each required field empty is blocked (name, email, who it's for, time zone, both dates and times, policy checkbox).
- [ ] An invalid email address is rejected.
- [ ] "Other" time zone makes the extra text field appear (and required, if conditional logic is verified).

**Time handling (manual, so test the coach's checking, not the form)**

- [ ] A request in Eastern Time for **11 a.m. on a Monday** converts to 8 a.m. Pacific: acceptable.
- [ ] **8 p.m. Eastern on a Saturday** converts to 5 p.m. Pacific: acceptable.
- [ ] **9 p.m. Eastern on a Saturday** converts to 6 p.m. Pacific: **not** acceptable (start after 5 p.m.).
- [ ] A time that is **Sunday in Pacific time** after conversion: **not** acceptable, even if it's Monday for the student.
- [ ] A request less than 48 hours away: **not** acceptable.
- [ ] A date near a daylight-saving change converts correctly using the coach's tool (no fixed offset).

**Notification**

- [ ] An email reaches the coach's private address for each test, identifies the lesson option (form name or hidden field), and shows every answer including the policy acknowledgment. **⚠ VERIFY**
- [ ] No notification goes to any other address.

**Hand-off**

- [ ] Both share links are on `https://tally.so/...` and open without logging in.
- [ ] The links have been given to the operator privately, and no link is public anywhere.
- [ ] The coach approves launch in writing before `bookingEnabled` is set to `true`.

---

## 9. Unresolved before launch

- The privacy notice (section 7), including retention, public contact and legal review for children.
- Whether to add the privacy acknowledgment (field 13).
- The Tally capabilities and plan limits marked **⚠ VERIFY**.
- Answers to the "Not specified" items in `pilot-operations.md`, section 1, that the coach wants stated to students (for example the "late" cancellation cut-off).
- The coach's private notification address and the two form links (held outside the repo).
