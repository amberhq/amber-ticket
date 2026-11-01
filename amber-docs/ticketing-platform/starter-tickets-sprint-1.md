# Amber ticketing platform: starter tickets (sprint 1)

These six Stories start the build of Amber's in-house ticketing platform on Zammad. They are agreed and ready to create in Jira under the epic **AI-1283** ("Replace ticketing (Freshdesk + Subtask)").

| # | Ticket | Size | Depends on |
|---|---|---|---|
| 1 | Apply the Amber theme and app shell to the Zammad desktop app | M–L | none |
| 2 | Google SSO login, break-glass admin and first-login onboarding (connect Slack and Gmail) | M–L | AI-1311 |
| 3 | Admin settings for teams, members, statuses and custom fields | XL | AI-1311 |
| 4 | Admin settings for ticket types and sub-types | M | 3 |
| 5 | Tickets list with the standard views | M | 3, 4 |
| 6 | Ticket detail page layout: header, tabs and fields panel | L | 3, 4 |

Tickets 1 and 2 can start at once. Ticket 1 runs alongside the rest.

**Sources**

| Source | What it holds |
|---|---|
| [AI-1284](https://amberhq.atlassian.net/browse/AI-1284) | The PoC requirement. IDs F-, C-, E-, AC- in this file come from it. |
| [AI-1311](https://amberhq.atlassian.net/browse/AI-1311) | The devops setup for the platform. |
| [Spec doc](https://claude.ai/artifact/USQaoApiwWgHhxZCJmGa9H), "Ticketing on Frappe Helpdesk — Solution & Field Spec by team" | Spec IDs P, T, W, D, RV, M-n and D-n. |
| [Amber Helpdesk design](https://claude.ai/artifact/MzabbXfEeu8iHWcDo5s2Tg) | The boards named under "Design" in each ticket. |
| [ticket-platform-tasks.md](ticket-platform-tasks.md) | The full breakdown of all 116 tickets. |

## Decisions taken while writing these tickets

| Topic | Decision |
|---|---|
| Break-glass login | Keep one break-glass admin with a password, as the spec (RV-1) and the login design say. It is protected by 2FA, a vault-held password and an alert whenever it's used. |
| Slack and Gmail | Agents connect both during first-login onboarding. Nothing uses the connections yet; their uses come in later tickets once M-3 is decided. There is no panel for managing connections for now. |
| Teams, statuses, fields, types | Nothing team-specific is seeded. Admins and Managers create teams, members, statuses, custom fields and ticket types in the app. Only defaults are added by migration: the 3 roles, 4 priorities and 4 base statuses. |
| Roles | Fixed: Agent, Manager and Admin. |
| Admin pages | Build new Vue admin pages in our own namespace. Don't modify Zammad's legacy admin (see ticket 3). |
| Provider and property data | Not part of ticket 4. It becomes a separate masters-sync ticket: a CSV import now, CRM sync later. |

Out-of-scope items in each ticket are scoping choices made for sprint 1. The items themselves are in the spec and are covered by later tickets in the full breakdown.

---

## Ticket 1: Apply the Amber theme and app shell to the Zammad desktop app

**Description**

Every screen in the Amber Helpdesk design uses the same visual language and one left-sidebar shell. We set this up once, so every later UI ticket builds on it and stock Zammad screens don't need restyling twice.

**Scope**

- **Design tokens.** Map the Amber tokens onto Zammad's Tailwind tokens in `app/frontend/apps/desktop/styles/`:
  - Neutral palette: ink `#171717`; surfaces `#FFFFFF`, `#F3F3F3`, `#F8F8F8`; borders `#EDEDED` to `#D4D4D4`.
  - Semantic pairs: danger, warning, success, purple and blue.
  - One dot colour per status and one tint per team.
- **Typography.** Inter only:
  - Body 13px, meta 12px, badges 11px.
  - Buttons and inputs 14px; headings 16–20px.
- **Sizing.**
  - Control heights 26–28px; primary buttons 32–34px.
  - Radii 6–8px on controls and 10–12px on cards and dialogs.
- **Shared components.** Restyle button, input, select, popover, dialog, table, tabs and badge.
- **Left sidebar** (220–260px wide):
  - Team name at the top.
  - Then: Search ⌘K, Notifications (unread badge), Tickets (count badge), My tasks, Analytics, Admin settings (Admins only) and Help.
  - Items whose pages don't exist yet are hidden behind a flag.
- Hide Zammad's taskbar of open tabs.

**Out of scope**

- The team switcher and the ⌘K palette's behaviour.
- The Notifications and Help pages.
- Dark mode. The design is light-only.

**Acceptance criteria**

- Every existing desktop page renders with the Amber tokens and the Inter font, and no stock Zammad colours remain. This covers login, the ticket list, ticket detail, search and personal settings.
- The sidebar matches the "Sidebar shell" board. Admin settings appears only for Admins.
- No taskbar tabs are shown. Opening a ticket navigates in place.
- The theme survives a Zammad upgrade:
  - Changes stay in the custom styles folder, plus the fewest possible component overrides.
  - The PR lists every override.

**Design:** Sidebar shell; the Menu-* boards.

**Notes:** Build on the CSS-only skin prototyped on branch `feature/amber-modern-theme`, in `app/frontend/apps/desktop/styles/custom/amber/`.

**Size:** M–L

---

## Ticket 2: Google SSO login, break-glass admin and first-login onboarding (connect Slack and Gmail)

**Description**

Every Amber employee signs in with their Google work account, and nobody else can sign in.

On first sign-in, a short onboarding flow confirms the person's details and connects their Slack and Gmail accounts. The connections are stored for later use; no feature uses them yet.

A single break-glass admin account with a password keeps a way in if Google login fails.

**Scope**

*Login*

- Turn on Zammad's Google OAuth login.
  - The Google app is set to *Internal* in Google Workspace.
  - The server also checks that the email ends in `@amberstudent.com`.
- On first sign-in, create the user automatically and link it by email.
- Hide the password form from the login screen.
- The login screen matches the "1 · Login" board:
  - "Log in to Amber Helpdesk".
  - A "Continue with Google" button.
  - A note saying which domain is accepted.
- Sessions last at most 12 hours.

*Break-glass admin*

- One Admin account signs in with a password. It uses a documented route that isn't shown on the login screen.
- The account requires 2FA. Its password and 2FA secret are kept in the team vault.
- Every sign-in to this account is logged and sends an alert.
- Check whether hiding the password form also blocks password login at the API for every other user. If it doesn't, block it on the server.

*First-login onboarding*

Shown once, until it's complete.

- **Step 1, "Your details":** name, work email, team and reporting manager. They are read-only, with a lock icon.
  - For now, name and email come from Google, and team comes from the Zammad user record.
  - Reporting manager shows "—" until the directory sync exists.
- **Step 2, "Connect Gmail and Slack":** one card for each account, with a Connect button and a "Connected" state.
  - **Slack:** OAuth through the existing **Amber Tickets** Slack app. Check that the Slack account's email matches the user's Amber email, and refuse a mismatch.
  - **Gmail:** Google OAuth consent for Gmail access. Use incremental authorisation so more scopes can be added later without redoing this flow.
  - For each user, store each connection's external user ID, scopes and an encrypted token.
- "Go to my dashboard" stays disabled until both are connected, as in the design. This is a setting, so it can be relaxed without a code change.
- The break-glass admin skips onboarding.

**Out of scope**

- Using the connections: replying from the agent's Gmail, posting to Slack as the agent, and Gmail outbound capture (D3). Each comes with its own feature ticket once M-3 is decided.
- Managing connections after onboarding (Reconnect or Disconnect). This comes with the first feature that uses the connections.
- Filling Step 1 from the employee directory, the hourly Active check and clearing sessions on deactivation. These need the directory sync (P5, RV-1, RV-7).

**Acceptance criteria**

- An `@amberstudent.com` Google account can sign in. On first sign-in it lands on onboarding; afterwards it lands on Tickets.
- A Gmail or other-domain account is refused with a clear message, and no user record is created.
- The login screen shows no password form. A non-admin user can't sign in with a password through the UI or the API.
- The break-glass admin can sign in with password and 2FA. The sign-in is logged and the alert fires.
- Connecting a Slack account whose email doesn't match is refused, with a message.
- After both accounts are connected, "Go to my dashboard" is enabled, and onboarding doesn't show again.
- A session expires 12 hours after sign-in.

**Open questions**

| Question | Suggested answer |
|---|---|
| Which Gmail scopes for now? | The minimum until M-3 is decided: identity plus `gmail.readonly`. Is `gmail.send` wanted from the start? |
| Which Slack user scopes? | Identity and email only. `chat:write`, for posting as the agent, can be added later. |
| Who gets the break-glass alert, and who holds the vault entry? | |

**Design:** 1 · Login (Main); 2 · Onboarding step 1 "Your details"; 3 · Onboarding step 2 "Connect Gmail and Slack" (OnboardingSlack).

**Trace:** F-16, P2, P7, RV-1, RV-2, M-3

**Depends on:**

- AI-1311 (environment).
- The Amber Tickets Slack app, which already exists.
- A Google Cloud OAuth client with the Gmail API enabled.

**Size:** M–L

---

## Ticket 3: Admin settings for teams, members, statuses and custom fields

**Description**

Admins and Managers set up the helpdesk themselves in the app. Nothing team-specific is hard-coded.

This ticket adds admin pages to the Vue desktop app for teams, members, statuses and custom fields. Today Zammad has admin pages only in the legacy UI. Each person can do only what their role allows. The three roles are fixed, and anything we want present by default is added by migration.

**Decision: build new admin pages; don't modify the legacy admin**

- **What we build.** New Vue pages in our own namespace (route `/amber/settings`, folder `pages/amber-settings/`) with our own GraphQL mutations.
- **Why.** Zammad's desktop app has no admin pages yet; its `develop` branch had none as of 26 Oct 2026. The legacy CoffeeScript admin is being phased out.
  - Editing Zammad's own files causes merge conflicts on every upgrade, and the work is lost when Zammad removes the legacy UI.
  - Adding our own files conflicts with nothing.
- **Thin wrappers.** The pages wrap Zammad's own records: Group, User, Role, Ticket::State and ObjectManager attributes. If Zammad later ships its own desktop admin, both admins edit the same data and stay consistent. Where Zammad's page then does the same job (likely plain user management), we drop ours. Amber-specific pages stay.
- **No edits to the legacy admin.** Admins keep it for settings we don't build: email channels, integrations and system settings.
- **Manager access.** Managers get a new `amber.team_settings` permission, never Zammad's `admin.*`. Granting `admin.*` would also open the whole legacy admin to them.

**Scope**

*Admin shell*

- An "Admin settings" area in the desktop app, reached from the sidebar. Admins see it as Admin settings; Managers see it as "Team settings".
- Grouped navigation in the Frappe style: People and access · Tickets. Later tickets add more groups.
- An unsaved-changes bar.
- A leave guard: Stay / Discard and leave / Save and leave.

*Roles (fixed)*

- Exactly three roles: Agent, Manager and Admin. They are created by migration and can't be created, renamed or deleted in the UI.
- The Roles page is read-only and shows what each role can do.

*Teams and members*

- A Teams list and a New team form: name, colour, description and Manager(s).
- A team page with its member list and Add members.
- Each person belongs to exactly one team. Adding someone who is already in a team asks to move them.
- Set each member's role: Agent, Manager or Admin.
- A Members list across all teams, with search and filters by team, role and status.
- Invite by work email:
  - Only `@amberstudent.com` addresses are accepted.
  - The user is created ahead of time and linked on their first Google sign-in.
  - Invites expire after 7 days.
- Teams are disabled, not deleted. A team with open tickets can't be disabled.
- In Zammad terms, a team is a Group. Group permissions come from the person's team and role.

*Statuses*

- One status list for all teams.
- Each status has:
  - A name and a colour.
  - A category: Open, Paused or Resolved. Paused stops the SLA resolution clock.
  - The teams that use it.
- A team's tickets offer only the statuses that team uses.
- A status that has been used can only be retired; an unused one can be deleted (M-48).
- In Zammad terms, statuses are ticket states. The category maps to the state type, and per-team availability is set through Core Workflow.

*Custom fields*

- A fields library. Create a field with:
  - A label and a type: text, long text, number, date, date-time, yes/no, select or multi-select.
  - Options, for select types.
  - Help text.
  - The teams it shows on.
- Required or optional, set per team.
- Fields can be edited. A field with values can only be retired; a field without values can be deleted.
- In Zammad terms, fields are object manager attributes on the ticket. Per-team visibility is set through Core Workflow.

*Permissions*

| Action | Admin | Manager | Agent |
|---|---|---|---|
| Create and disable teams | ✓ | – | – |
| Add and move members; set role | ✓ | Own team only, up to Manager | – |
| Invite people | ✓ | Into own team | – |
| Create, edit and retire statuses | ✓ | – | – |
| Choose which statuses their team uses | ✓ | Own team | – |
| Create, edit and retire custom fields | ✓ (any team) | Own team's fields only | – |

Every check is enforced on the server, not only hidden in the UI (RV-98).

*Defaults added by migration*

- The 3 roles.
- 4 priorities: Urgent, High, Medium and Low.
- 4 base statuses: Open, In progress, Pending and Closed. Tickets work before anyone configures anything.
- Everything else is created by users in the UI.

**Out of scope**

- The History panel on each admin page, and the Audit log.
- Deactivating a member and reassigning their open work.
- Per-person flags: card holder, approver and asset agent.
- Regions and shifts on members.
- Field types for amount + currency, tables and checklist tables.
- Field dependencies: "Limit options" and "Require when".

**Acceptance criteria**

- An Admin creates a team, adds 3 members and makes one of them Manager. Those members see only that team's tickets.
- A Manager can add members to their own team, but not to another team. Calling the API for another team returns 403.
- An Agent sees no Admin settings or Team settings entry. Calls to the admin API return 403.
- Inviting an address outside `@amberstudent.com` is refused. An invite that isn't accepted within 7 days can no longer be used.
- A status limited to team A is not offered on team B's tickets.
- A status that has been used can't be deleted; it can only be retired.
- A field created for team A appears only on team A's tickets.
- A field marked required for team A blocks saving a team A ticket without it, through the UI or the API.
- A field with values can't be deleted; it can only be retired.
- Leaving a page with unsaved changes shows the leave guard.
- On a fresh install, the migrations create the 3 roles, 4 priorities and 4 base statuses.

**Design**

- Admin-Teams, Admin-NewTeam, Admin-TeamPage, Admin-AddMembers, Admin-TeamDisable
- Admin-Members, Admin-Invite, Admin-InviteError
- Admin-Roles, Admin-RolePage
- Admin-Statuses, Admin-NewStatus, Admin-StatusDelete
- Admin-Fields, Admin-NewField, Admin-FieldDelete
- Admin-TeamSettingsManager, Admin-Leave

**Trace:** F-2, F-3, F-4, P3, P4, P9, P10, T1, T3, M-45, M-48, RV-98

**Technical risk:** Adding an object manager attribute in Zammad needs a database migration step; the legacy admin has an "Update database" step for it. Check early how to run this safely from the new UI.

**Size:** XL. Suggested sub-tasks:

- a. Admin shell and roles.
- b. Teams, members and invite.
- c. Statuses.
- d. Custom fields.

---

## Ticket 4: Admin settings for ticket types and sub-types

**Description**

Each team classifies its tickets with its own list of types, each with sub-types. Admins and Managers create and maintain these lists in the app. Nothing is seeded.

**Scope**

- A "Ticket types" admin page. Types are grouped by team, and each type has sub-types: two levels.
- Create, edit and reorder types and sub-types. Sub-type names must be unique across all teams.
- Settings for each sub-type:
  - A default priority.
  - Intake fields: which custom fields from ticket 3 are required when a ticket of this sub-type is created.
  - Active or retired.
- A type or sub-type that tickets already use can be retired, not deleted.
- On a ticket, the Type › Sub-type picker offers only the active types of the ticket's team.
- Picking a sub-type sets the default priority. The agent can still change it.
- Required intake fields are enforced on the server. This covers every channel: the UI, the API, and later Slack and email.
- Permissions:
  - Admins manage every team's types.
  - Managers manage their own team's types (M-45).
  - Agents have no access.

**Out of scope**

- Further sub-type settings: metrics, whether QC audits it, who can raise it, host outcome and SLA.
- The new-ticket pop-up UI.
- Provider and property data, which is a separate masters-sync ticket.

**Acceptance criteria**

- An Admin creates the type "Price / availability update" for Supply Support, with sub-types "Price" and "Sold out". Only Supply Support tickets offer them.
- Creating a sub-type whose name another team already uses is refused.
- With "Sold out" set to a default priority of High, picking it on a ticket sets the priority to High.
- With a field marked required for "Sold out", the API refuses to create a ticket of that sub-type without the field, and the error names the field (AC-15).
- Retiring a sub-type removes it from the picker but keeps it on existing tickets.
- A Manager can edit their own team's types only. Editing another team's types returns 403.

**Design:** Admin-Types, Admin-NewType, Admin-SubtypeDetail, Ticket-NewTicketMissing

**Trace:** F-11, F-22, T2, M-42, M-45, RV-12

**Dev note:** Use a dedicated type/sub-type model, not a tree-select attribute. Each sub-type carries its own settings, and more will be added later.

**Depends on:** ticket 3

**Size:** M

---

## Ticket 5: Tickets list with the standard views

**Description**

Agents work from one Tickets page with a view switcher instead of Zammad's overview sidebar. This ticket builds the list and the standard views that don't need a new data model.

**Scope**

- A Tickets page at the sidebar's "Tickets" item, with the breadcrumb header "Tickets / <view> ▾".
- **Default columns:** ID, Subject, Ticket type, Status (with a coloured dot), Priority, Assignee, FRT and Age.
  - The FRT cell is amber while the first-response clock is still running.
  - A team's own fields can be added as columns.
- A "Create" button that opens the existing ticket-create flow.
- **Standard views**, as Zammad overviews created by migration:
  - All tickets (the default).
  - Assigned to me.
  - My team's unassigned tickets, oldest first.
  - Raised by me.
  - Closed, last 30 days.
  - SLA alerts, hidden until SLAs exist.
- **A Manager-only view:** Triage, showing unassigned tickets with a reason column.
- A view-switcher popover and count badges, restyled to the design.
- Basic sorting from the column header, plus pagination or infinite scroll.

**Out of scope**

- Views that need the collaborator model: Waiting on me, Collaborating on, and Waiting on my team.
- Saved or personal views, the filter builder, multi-sort and the column chooser.
- The bulk-actions bar.

**Acceptance criteria**

- In every view, an agent sees only their own team's tickets.
- Each view lists exactly the tickets its rule defines. There is one spec per view.
- The Triage view and its reason column appear only for Managers.
- The list loads in under 1.5 seconds with 10,000 tickets in the sandbox.
- The page matches the Menu-TeamAll, Menu-Assigned, Menu-Queue, Menu-Raised and Menu-Closed boards.

**Design:** Menu-TeamAll, Menu-Assigned, Menu-Queue, Menu-Raised, Menu-Closed, Menu-Triage, Tickets-ViewMenu

**Trace:** PO-2, F-10, D9, M-38

**Depends on:** tickets 3 and 4

**Size:** M

---

## Ticket 6: Ticket detail page layout: header, tabs and fields panel

**Description**

This ticket restructures the ticket page from Zammad's single article stream into the design's layout:

- A header with actions.
- Tabs that separate emails from comments.
- A sticky right-hand panel with the ticket's fields.

Later tickets plug into this frame: sub-tickets, Slack, tasks and the status dialogs.

**Scope**

- **Header**
  - `#id via <source> · <team>`, the subject, and status and priority badges.
  - **Pick up**: assigns the ticket to me and sets In progress.
  - An **Assign** popover listing members of the ticket's team.
  - A ⋯ menu that shows only the existing Zammad actions for now.
- **Tabs**
  - **Activity:** a who-did-what feed from ticket history.
  - **Emails:** email articles only, with Reply, Reply all and Forward. They use Zammad's existing composer, restyled.
  - **Comments:** internal notes with @mention. Comments are never emailed, and the mention notification doesn't contain the note text.
  - The Sub-tickets, Slack, Tasks and Analytics tabs stay hidden until those features ship.
- **Right panel**
  - The common fields plus the ticket's team fields (from ticket 3), editable in place.
  - The type and sub-type (from ticket 4).
  - A read-only Source block.
- Status changes from the panel, offering only the team's statuses.
- Each ticket ID has a stable URL that can be used as a proof link.

**Out of scope**

- Sub-tickets, the Slack tab, tasks and per-ticket analytics.
- The status-change dialogs: Waiting on, Pending and Close.
- Raise request, Move to team and saved replies.

**Acceptance criteria**

- Pick up on an unassigned ticket assigns it to me and sets In progress in a single action. Two agents clicking at once don't conflict.
- The Emails tab shows only email articles. The Comments tab shows only internal notes.
- A comment never emails the requester, and an @mention notification doesn't contain the comment text (AC-6).
- Editing a field in the panel saves it and adds an entry to the Activity feed.
- The page matches the Ticket, TicketEmail, Ticket-EmailReply, TicketComments and Ticket-AssignMenu boards.

**Design:** Ticket (Activity), TicketEmail, Ticket-EmailReply, TicketComments, Ticket-CommentMention, Ticket-AssignMenu

**Trace:** F-1, F-6, F-7, F-21, D-1, D-2, RV-36

**Depends on:** tickets 3 and 4

**Size:** L
