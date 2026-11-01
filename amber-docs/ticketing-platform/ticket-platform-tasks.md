# Amber in-house ticketing on Zammad: Jira ticket breakdown

The build splits into **116 tickets across 17 epics**: 66 are P0, 45 are P1 and 2 are P2. Three more tickets are split across P0 and P1.
None of them has a dev-day estimate yet. The P0 set is well beyond the spec's 20 dev-day budget for P0 custom work (FR-12), so ticket 0.4 re-cuts the scope.

Sources:
- **AI-1284 (PoC) and AI-1283 (build epic) in Jira.** Create these epics under AI-1283.
- **Spec doc:** [Ticketing on Frappe Helpdesk: Solution & Field Spec by team](https://claude.ai/artifact/USQaoApiwWgHhxZCJmGa9H), all tabs, including the 23 and 24 Oct reviews.
- **UI design:** [Amber Helpdesk design](https://claude.ai/artifact/MzabbXfEeu8iHWcDo5s2Tg), about 190 boards.

The spec was written for Frappe Helpdesk. Every module below is re-mapped to Zammad:

| Spec concept | Zammad equivalent |
|---|---|
| Teams | Groups |
| Fields | Object attributes |
| Views | Overviews |
| Field rules | Core Workflow |
| SLAs and business hours | SLAs and Calendars |
| Sub-tickets | Native parent/child links |
| Freshdesk import | Zammad's Freshdesk importer |

## How to read the tables

| Column | Meaning |
|---|---|
| **ID** | Epic number and ticket number (E3 → 3.x). |
| **Layer** | `BE` = Rails/GraphQL backend · `FE` = Vue 3 desktop app · `Cfg` = configuration/seed data · `Ops` = infra, rollout · `Decision` = spike or sign-off. |
| **Fit** (UI tickets) | `Restyle` = exists in Zammad desktop, needs the skin · `Extend` = base exists, needs new behaviour · `New` = no Zammad equivalent · `Port` = exists only in the legacy CoffeeScript admin. |
| **Size** | Relative, not estimated: S ≈ 1–2 dev-days, M ≈ 3–5, L ≈ 2 weeks, XL = an epic that needs splitting. |
| **Trace** | IDs in the spec doc, to copy into the Jira description:<br>• Modules: P, T, W, D, TM, R<br>• Stories: US, QC, OF, KAM, FIN, REC, XT, WF<br>• Automations: AU, QAU, OAU, KAU, FAU, RAU<br>• Detail additions: RV<br>• Decisions: D-n, M-n |

## Epics

| Epic | Name | P0 | P1 | P2 |
|---|---|---|---|---|
| E0 | Foundations and decisions | 5 | 0 | 0 |
| E1 | Platform: auth, teams, roles, visibility | 9 | 0 | 0 |
| E2 | Masters sync (CRM and employee directory) | 3 | 2 | 0 |
| E3 | Ticket model | 7 | 6 | 0 |
| E4 | Shared workflow engine | 7 | 7 | 0 |
| E5 | Email channel | 4 | 2 | 0 |
| E6 | Slack app "Amber Tickets" | 5 | 1 | 1 |
| E7 | Requester portal | 2 | 0 | 0 |
| E8 | Team modules | 2 | 4 | 0 |
| E9 | Reporting | 3 | 1 | 0 |
| E10 | Migration and cut-over | 0 | 5 | 0 |
| E11 | Workflow builder (engine) | 0 | 3 | 0 |
| E12 | UI: theme, shell, login | 4 | 3 | 0 |
| E13 | UI: ticket list and views | 5 + 13.3a | 1 + 13.3b | 0 |
| E14 | UI: ticket detail | 8 | 4 | 0 |
| E15 | UI: tasks, search, analytics | 2 | 1 | 1 |
| E16 | UI: Admin settings in Vue desktop | 16.2a, 16.5a | 5 + 16.2b, 16.5b | 0 |
| | **Total** | **66 (+3 split)** | **45 (+3 split)** | **2** |

---

# P0: needed for go-live (66 tickets, plus 3 split)

### E0 · Foundations and decisions ()
| ID | Ticket | Layer | Size | Trace |
|---|---|---|---|---|
| 0.1 | Decide the fork strategy and base version (stable-7.1 or 7.2.x); keep Amber code in its own namespace; define the upgrade/rebase process | Decision | S | P6, M7 |
| 0.2 | Hosting, environments, CI, backups and a 30-minute rollback runbook | Ops | L | P1, RV-95 |
| 0.3 | Spike: check how Zammad's native states, SLAs, mentions, links and merge behave against the spec's assumptions | BE | M | T3, W2, W7, W9 |
| 0.4 | Estimate every P0 row and re-cut scope to the 20 dev-day bar | Decision | S | D-19, FR-12, M5 |
| 0.5 | Get answers on blocking open decisions: M-1/M-2 permissions, M-3 Gmail, M-10 membership, M-32 "Can also open", M-40/D-27 comment visibility, M-39 | Decision | S | Reviews 23/24 Oct |

### E1 · Platform: auth, teams, roles, visibility
| ID | Ticket | Layer | Size | Trace |
|---|---|---|---|---|
| 1.1 | Google SSO restricted to @amberstudent.com; password login off except one break-glass admin | Cfg/BE | S | P2, RV-1 |
| 1.2 | 12-hour sessions; hourly directory Active check; deactivation kills sessions and API tokens | BE | M | RV-1, RV-7 |
| 1.3 | Model the 6 queue teams and 5 collaborator-only teams as Groups; one team per person | Cfg/BE | M | P3, D-30 |
| 1.4 | Three roles (Agent, Manager, Admin), with only Managers able to reassign | BE | M | P4, M-2, XT-25 |
| 1.5 | Agent Profile: regions, job, asset agent, card holder, approver limit, shift | BE | M | P4, RV-6 |
| 1.6 | One visibility function across list, search, export, API, digest and BI, plus contract tests | BE | L | RV-3 |
| 1.7 | Collaborator access: let ticket collaborators open tickets outside their team | BE | M | W3 |
| 1.8 | Deactivation job: resumable reassignment of tickets, tasks and collaborations; block removing the last Manager or Admin | BE | M | RV-7, XT-3 |
| 1.9 | Server-side 403 checks on every GraphQL/REST method | BE | M | RV-98 |

### E2 · Masters sync
| ID | Ticket | Layer | Size | Trace |
|---|---|---|---|---|
| 2.1 | Read-only copies of providers (KAM, Recon and Content agents, domains), properties (~4.5k), regions, countries, cities and universities | BE | L | P5, D-11 |
| 2.2 | Employee directory sync: name, email, manager, active | BE | M | P5, RV-6 |
| 2.3 | Nightly 02:00 sync plus live `lookup_property` / `lookup_lead` / `lookup_provider` | BE | M | P5 |

### E3 · Ticket model
| ID | Ticket | Layer | Size | Trace |
|---|---|---|---|---|
| 3.1 | Common fields as object attributes: Providers (multi), Properties filtered by provider, Region, University, Lead, Raised by team, Source block | BE/Cfg | L | T1 |
| 3.2 | Type › Sub-type as a two-level tree-select with names unique across teams; priority defaulted from the sub-type | BE/Cfg | M | T2 |
| 3.3 | 14 custom states with category (Open/Paused/Resolved), "counts against", "requires" and requester-facing labels | BE | L | T3, RV-19 |
| 3.4 | Status rules: assignment never changes status; Pick up, reply or comment moves to In progress; comments count as first response | BE | M | D-1, D-2 |
| 3.5 | Server-side `required_fields(ticket, status)` and format checks, applied to every channel | BE | M | RV-11, RV-12 |
| 3.6 | Sub-tickets (one level, same team) on native parent/child links; parent can't close with open children; notify when the last child closes | BE | M | T4, D-4, AU-4 |
| 3.11 | Card-number masking before storage (incl. logs and job args), refusal in forms, admin Redact; 5-year retention (spike first) | BE | L | T10, RV-30–33 |

### E4 · Shared workflow engine
| ID | Ticket | Layer | Size | Trace |
|---|---|---|---|---|
| 4.1 | Intake stamping pipeline in a fixed order (source → requester → team/type → provider, property, lead, region → priority → status); second pass on the email body | BE | L | W1 |
| 4.2 | Assignment engine: ordered policy rows per team (match → strategy → pool → fallback). Strategies: provider agent, round robin, fewest open, next on shift, urgent duty, lead's Triage | BE | XL | W2, M-34 |
| 4.3 | Shifts table plus shift handover after 15 minutes | BE | M | W2, RV-37 |
| 4.4 | Concurrency-safe "Assign to me" and "Pick up"; assignment log to prove the 80% auto-assign target | BE | S | RV-36 |
| 4.5 | Collaborators model: states Active/Mentioned/Follower, sources, permitted edit fields, Follow/Unfollow | BE | L | W3, RV-40 |
| 4.6 | Waiting on <team>: an ask, hand-back (Done / Still working / Waiting on PMG), auto hand-back at 09:30, reminders, then copy the lead | BE | L | W3 |
| 4.7 | @mention adds the person as a collaborator; mention emails hide the comment text | BE | S | W9, T9 |

### E5 · Email channel
| ID | Ticket | Layer | Size | Trace |
|---|---|---|---|---|
| 5.1 | Connect the 4 team inboxes through Google OAuth, with staff-only acknowledgement | Cfg | S | D1 |
| 5.2 | Mailbox health, reconnect without losing mail, bounce/auto-reply ignore, loop protection, DMARC-verified internal senders, 25 MB limit | BE | M | RV-17, RV-50–56 |
| 5.3 | Reply all never adds collaborators; Forward sends only what the agent writes, with ticked files; original sender kept; CC pre-filled | BE | M | D2, M-41 |
| 5.4 | Domain → provider → agent routing for accounts@ | BE | S | D4, RAU-1 |

### E6 · Slack app "Amber Tickets"
| ID | Ticket | Layer | Size | Trace |
|---|---|---|---|---|
| 6.1 | Slack app and new Zammad channel driver; users matched by email; every Slack action re-checks the user | BE | L | D5 |
| 6.2 | `/ticket` modals and Every-message mode | BE | L | D5 |
| 6.3 | Ticket card in the thread: Assign to me, Pick up, Status, View & Edit, ⋯ menu | BE | M | D5 |
| 6.4 | Two-way sync: public thread ↔ public replies, private responder channel ↔ comments; edits and deletes; ordering and rate limits; backfill on re-add | BE | XL | D5, RV-59–62 |
| 6.5 | Lead-built forms and channel map: field types, routing by a form answer, mirror channel | BE | L | D6 |

### E7 · Requester portal
| ID | Ticket | Layer | Size | Trace |
|---|---|---|---|---|
| 7.1 | Portal on Zammad's customer interface: raise by team and type form, see every ticket raised from any channel, cancel | FE/BE | L | D8 |
| 7.2 | Make sure no internal content reaches requesters or PMGs (comment visibility depends on M-40) | BE | M | M-40, D-27 |

### E8 · Team modules
| ID | Ticket | Layer | Size | Trace |
|---|---|---|---|---|
| 8.1 | **Inventory:** 10 types and 36 sub-types, 26 fields (incl. Pending info checklist table), AU-1–AU-7, 7 assignment rows, go-live | All | XL | TM1, US-1–15 |
| 8.3 | **Ops-Forms:** Booking and Payment Slack forms, completeness check leading to Waiting on Sales, 4 shifts, self-pick, close-with-proof, D-16 reopen exception | All | XL | TM3, OF-1–18, OAU-1–8 |

### E9 · Reporting
| ID | Ticket | Layer | Size | Trace |
|---|---|---|---|---|
| 9.1 | Versioned SQL views on a read replica: `ticket_facts`, `status_time`, `collaborations`, `assignments`, `qc_audits`, `onboarding_lines`, `finance_facts`; no message bodies or bank details | BE | L | R2 |
| 9.2 | Metabase and a read-only API user on those views; written metric definitions | BE/Ops | M | R2, RV-87 |
| 9.3 | Per-team dashboards (Metabase or in-app, depending on M-4) | BE/FE | L | R1, D-21 |

### E12 · UI: theme, shell, login
| ID | Ticket | Fit | Size | Trace |
|---|---|---|---|---|
| 12.1 | Amber design tokens: neutrals, semantic pairs, 14 status dots, team tints, Inter type scale, radii, control heights | Restyle | M | Design tokens |
| 12.2 | Restyle shared parts: button, input, select, popover, dialog, table, tabs, badge | Restyle | M | Design tokens |
| 12.3 | New left sidebar (Search ⌘K, Notifications, Tickets, My tasks, Analytics, Admin/Team settings, Help) with badges; hide the taskbar tabs | Extend | M | Sidebar shell |
| 12.5 | Google-only login screen | Restyle | S | Main · Login |

### E13 · UI: ticket list and views
| ID | Ticket | Fit | Size | Trace |
|---|---|---|---|---|
| 13.1 | List table restyle: ID, Subject, Type, status dot, priority, assignee, running FRT clock, age, team columns | Extend | M | Menu-TeamAll |
| 13.2 | View switcher with standard views (Assigned to me, Waiting on me, Collaborating on with "My part", My team's unassigned, Raised by me, SLA alerts, Closed last 30 days) and Manager views (Waiting on my team, Triage) | Extend | M | D9, M-38 |
| 13.3a | Saved views: create/edit/duplicate/delete, share with team; needs a user-overview backend model and GraphQL | New | L | D9, M-16 |
| 13.4 | Filter builder: field picker, operators, value counts, relative dates, "Save as new view" | New | L | D9 |
| 13.6 | Bulk bar: Assign, Edit, Export CSV (Managers only) | Extend | M | D9, D-22 |
| 13.7 | New ticket pop-up: Team, Type › Sub-type, then the sub-type's intake form, which blocks Create until it's filled | Extend | M | M-42 |

### E14 · UI: ticket detail
| ID | Ticket | Fit | Size | Trace |
|---|---|---|---|---|
| 14.1 | Tabbed layout (Activity · Sub-tickets · Slack \| Emails · Comments · Tasks · Analytics) with a sticky right-hand fields panel | Extend | L | Ticket boards |
| 14.2 | Header: Pick up, Assign popover, ⋯ actions menu (Add sub-ticket, Raise request, Move, Close as duplicate, Log PMG reply, Close, Run workflow) | Extend | M | Ticket-AssignMenu |
| 14.3 | Emails tab and composer: To/Cc/Bcc, quoted text, Reply / Reply all with an external-address confirm, Forward with ticked files and preview | Extend | M | M-41 |
| 14.4 | Slack tab: thread view, "Also send to channel", posts as the agent | New | M | D5 |
| 14.5 | Comments with @mention-as-collaborator and a "Pulled in" panel | Extend | M | W9 |
| 14.6 | Saved replies picker (Global / Team / Personal) and New saved reply, on Zammad text modules | Extend | M | T9, M-31, M-47 |
| 14.7 | Status-change dialogs: Waiting on <team>, Waiting on Sales checklist, Waiting on PMG, Pending reason and date | Extend | M | W3, W5 |
| 14.10 | Sub-tickets tab: progress bar, per-child SLA, Add sub-ticket pop-up, child page, close a child from the parent | Extend | L | T4 |

### E15 · UI: search
| ID | Ticket | Fit | Size | Trace |
|---|---|---|---|---|
| 15.2 | ⌘K command palette (recent tickets, navigate, create ticket, jump to advanced search) | Extend | M | Search-Palette |
| 15.3 | Advanced search restyle with Team, Status, Priority and Type filters, and a Freshdesk/booking ID search | Restyle | S | RV-66 |

### E16 · UI: Admin (P0 parts only)
| ID | Ticket | Fit | Size | Trace |
|---|---|---|---|---|
| 16.2a | Members: Deactivate with reassignment of open work | Port + New | M | P9, RV-7 |
| 16.5a | Mailbox lost-access alert | New | S | P12 |

---

# P1: soon after go-live, or needed for later team go-lives (45 tickets, plus 3 split)

### E2 · Masters sync
| ID | Ticket | Layer | Size | Trace |
|---|---|---|---|---|
| 2.4 | Provider-owner change moves open work | BE | S | RV-8, RAU-8 |
| 2.5 | Sync health monitoring and alerts | BE | S | P5, P12 |

### E3 · Ticket model
| ID | Ticket | Layer | Size | Trace |
|---|---|---|---|---|
| 3.7 | System-set Related links: Raised from, Audits, Follows, Merged into | BE | S | T5 |
| 3.8 | Close reasons model: 6 global plus team extras; each with what it needs, metrics flag, QC flag; Duplicate merges | BE | M | T6, M-43 |
| 3.9 | Reopen: within 7 days reopens to the last assignee and increments the reopen count; after that creates a Follows ticket; SLA restarts | BE | M | T7, RV-27 |
| 3.10 | Move to team: history kept, FRT restarts, lands unassigned; a second move back flags Disputed | BE | M | T8 |
| 3.12 | Comments editable for 15 minutes, then redact only; collision detection | BE | S | RV-13, RV-14 |
| 3.13 | Possible-duplicate flag (same team, within 24 hours), never auto-merged | BE | S | M-49 |

### E4 · Shared workflow engine
| ID | Ticket | Layer | Size | Trace |
|---|---|---|---|---|
| 4.8 | Raise request to another team: requester carried over, raiser follows, choose files, host goes Pending or closes | BE | M | W4, D-3, M-42 |
| 4.9 | Pending: reason and follow-up date, 09:30 reminder, auto-return for self-clearing reasons and after 2 working days overdue | BE | M | W5, M-46 |
| 4.10 | Tasks model: due date and time, reminders, snooze; never changes status | BE | M | W5, RV-43 |
| 4.11 | Time-in-status log in working time per team | BE | M | W6 |
| 4.12 | SLA per team × sub-type ("No target" allowed), IST team calendars, Pending and Waiting pause resolution, per-ticket SLA snapshot (becomes P0 if the snapshot is needed) | BE/Cfg | L | W7, M-35, M-36 |
| 4.13 | Alerts: immediate DM for 8 event types, digest at 10:00 and 16:00, quiet hours, about-to-breach warning (30 minutes or 10%) | BE | L | W8, M-37 |
| 4.14 | Log PMG reply action | BE | S | RV-41 |

### E5 · Email channel
| ID | Ticket | Layer | Size | Trace |
|---|---|---|---|---|
| 5.5 | Gmail outbound capture (accounts@ in To/Cc/Bcc creates a ticket) (spike first) | BE | L | D3, RAU-2, D-12 |
| 5.6 | API intake with idempotent `external_id` (ambermail, SEO Sentinel) | BE | M | D7, RAU-7 |

### E6 · Slack app
| ID | Ticket | Layer | Size | Trace |
|---|---|---|---|---|
| 6.6 | Slack approval and alert DMs | BE | M | FAU-5, W8 |

### E8 · Team modules
| ID | Ticket | Layer | Size | Trace |
|---|---|---|---|---|
| 8.2 | **QC:** audit-set replication, Day-1 QC, QC result and fix-round/rebuttal loop, tolerance table, weekly summary, CSV import | All | XL | TM2, QC-1–15, QAU-1–11 |
| 8.4 | **Finance:** refund@ routing, approval matrix with two-person change control, Amber Payee Details restricted record, Close as Paid, double-payment and reused-reference checks, IBAN masking | All | XL | TM5, FIN-1–14, FAU-1–8, M-44 |
| 8.5 | **KAM:** 7 types and 17 sub-types, Onboarding lines with O1–O4 timings, CRM-based assignment, Triage after 30 minutes, Raise Inventory request | All | L | TM4, KAM-1–15, KAU-1–8 |
| 8.6 | **Recon:** accounts@ routing, chasers at 3/6/9 working days with a daily Slack chase list, invoice table and reminders, resume previous status on PMG reply | All | L | TM6, REC-1–14, RAU-1–8 |

The spec does not explain why Finance (8.4) is P1, since it launches together with Ops-Forms (8.3, P0) under D-6. Confirm its priority before sprint planning.

### E9 · Reporting
| ID | Ticket | Layer | Size | Trace |
|---|---|---|---|---|
| 9.4 | Usage events and outbound webhooks | BE | S | RV-88, RV-89 |

### E10 · Migration and cut-over
| ID | Ticket | Layer | Size | Trace |
|---|---|---|---|---|
| 10.1 | Customise Zammad's Freshdesk importer: Collaborator → owner, status map, private notes into a restricted record, disabled former agents, ticket numbers above ~1M | BE | L | R3, M-40 |
| 10.2 | `/helpdesk/fd/<id>` redirect, Freshdesk ID searchable, Freshdesk links in the CRM rewritten | BE | S | R3 |
| 10.3 | Full Recon Freshdesk history import and parity sign-off | Ops | M | D-14 |
| 10.4 | Suptask cut-over: open tickets with thread links, open sheet rows, /subtask off before June 2027 | Ops | M | R4 |
| 10.5 | Per-team 1-week pilot, training, and a switch calendar with no Ops/Finance switch between 15 Jul and 30 Sep | Ops | M | RV-96, RV-97 |

### E11 · Workflow builder (engine)
| ID | Ticket | Layer | Size | Trace |
|---|---|---|---|---|
| 11.1 | Spike: build on Zammad triggers, schedulers, core workflow and webhooks, or a new engine | Decision | M | W10, M-59 |
| 11.2 | Engine: triggers WT-1–10, steps WA-1–20, fill rules, before-assignment stage with a 500 ms budget, guardrails WG-1–16 | BE | XL | W10 |
| 11.3 | Versions, test dry run, run log, retry a step | BE | L | WF-1–39 |

### E12 · UI: theme, shell, login
| ID | Ticket | Fit | Size | Trace |
|---|---|---|---|---|
| 12.4 | Team switcher and "Viewing another team" banner; collaborator-only teams default to "Waiting on me" | New | M | Menu-TeamSwitch, S-7 |
| 12.6 | First-login onboarding: read-only directory details, connect Slack (and Gmail, depending on M-3) | New | M | P7, RV-2, M-3 |
| 12.7 | Notifications page (tabs, mark all read) and Help page | Extend | M | W8 |

### E13 · UI: ticket list and views
| ID | Ticket | Fit | Size | Trace |
|---|---|---|---|---|
| 13.3b | Saved views: per-agent "Set as my default view" | New | S | D9 |
| 13.5 | Multi-sort and column chooser (reorder, label, width, reset) | New | M | D9 |

### E14 · UI: ticket detail
| ID | Ticket | Fit | Size | Trace |
|---|---|---|---|---|
| 14.8 | Close dialog: team reasons and what each needs, note to requester, payment reference, Duplicate merge | New | M | T6, M-43 |
| 14.9 | Collaborator hand-back view; Move / Moved-in / Disputed banner; Raise request; Log PMG reply | New | M | W3, W4, T8 |
| 14.11 | Warnings: bank details typed in a reply, double payment, possible duplicate, owner-only tag, Follows/Freshdesk banners | New | M | S-10, M-49, T7 |
| 14.12 | Ticket Analytics tab: time in each status, time by team, SLA target vs actual | New | M | W6, W7 |

### E15 · UI: tasks
| ID | Ticket | Fit | Size | Trace |
|---|---|---|---|---|
| 15.1 | Tasks tab on the ticket and a My tasks page: new task, due/reminder picker, snooze, copy link, delete | New | L | W5, RV-43 |

### E16 · UI: Admin settings in Vue desktop
| ID | Ticket | Fit | Size | Trace |
|---|---|---|---|---|
| 16.1 | Admin shell: grouped navigation, History panel on every page, unsaved-changes bar and leave guard, Audit log with export | New | L | P8 |
| 16.2b | People: Members, Invite (work email only, 7-day expiry), Member detail; Teams (create, disable); Roles and per-person flags | Port + New | XL | P9 |
| 16.3 | Tickets config: Types and sub-types (incl. intake form), Fields, Field dependencies, Statuses (retire only), Close reasons, Saved replies, Lists, General | Port + New | XL | P10, M-48 |
| 16.4 | Automation: SLA policies (ordered, per-priority targets), Business hours, Assignment rules with "Try it", Approval rules, Notification templates | Port + New | XL | P11 |
| 16.5b | Channels and health: mailboxes with health and reconnect, Slack 5-step connect wizard, CRM/directory sync status, System health page | Port + New | L | P12, RV-10 |
| 16.6 | Manager-scoped Team settings (own team only, logged to History) | New | M | M-45 |
| 16.7 | Workflow builder UI: list, canvas, trigger and step panels, If/else, Lookup lists with CSV upload, Test, Versions, Runs log; plus the ticket-page parts (bolt icon on filled fields, Run workflow menu) | New | XL | W10, M-50–53 |

---

# P2: later (2 tickets)

| ID | Ticket | Layer / Fit | Size | Trace |
|---|---|---|---|---|
| 6.7 | Slack Home tab | BE | M | D5 |
| 15.4 | In-app Analytics: My performance, Team dashboard, KAM onboarding funnel (only if M-4 puts analytics in the app; otherwise Metabase via 9.3) | FE · New | XL | R1, M-4 |

The spec also defers these to P2. They don't have tickets yet; add them to the backlog when needed:
- Saved-reply actions on send
- Field dependency "Show when" / "Set value"
- Microsoft 365 / IMAP mailboxes
- Multiple reminders per task
- Settings export/import with a diff
- Finance ad hoc payouts and batch CSV upload
- Workflow triggers Assigned, Schedule and SLA event
- Workflow steps Add to a multi field, Clear field, Post in Slack thread and Reply to requester
- Export workflow JSON

---

## Suggested build order

1. **Foundations:** E0–E3, E12.
2. **Inventory on email:** the P0 parts of E4, E5, E13 and E14, then 8.1 goes live.
3. **Slack and cross-team:** E6, E7, then the P1 parts of E4.
4. **Team by team:** Ops-Forms (8.3) and Finance (8.4) go live together, then QC (8.2), KAM (8.5) and Recon (8.6).
5. **Migration:** E10 cut-over; retire Freshdesk and Suptask.
6. **After go-live:** E11 and 16.7, the workflow builder.
