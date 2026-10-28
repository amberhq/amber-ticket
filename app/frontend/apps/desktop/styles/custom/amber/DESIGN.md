<!-- Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/ -->

# Amber skin — DESIGN.md

A build-time skin for the Zammad **desktop (Vue 3)** app. It restyles Zammad toward the
Amber Helpdesk design (a calm, monochrome, Frappe-Helpdesk-like UI) **without touching any
component, page, text or behaviour**. Visual source of truth: the Amber Helpdesk design doc
(`AgentApp` / `Admin` boards). Secondary reference: Frappe Helpdesk.

## How the wrapper works

The files in this folder are picked up by `../index.ts` (Zammad's official custom-skin hook)
and load unlayered after Tailwind, so they win over utility classes without `!important`.

| File                | Layer                                                                                                  | Depends on                               |
| ------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| `00-fonts.css`      | Inter webfont (self-hosted, CSP `font-src 'self'`)                                                     | —                                        |
| `10-tokens.css`     | Re-maps Zammad's design tokens (`--color-*`, `--text-*`, `--radius-*`, font)                           | token names only                         |
| `20-base.css`       | Typography, focus ring, scrollbars, selection                                                          | element selectors                        |
| `30-shell.css`      | App skeleton: primary sidebar, main area, headers                                                      | `#primary-sidebar`, `data-zammad-target` |
| `40-components.css` | Shared components: buttons, inputs, tables, menus, dialogs, flyouts, tabs, badges                      | `data-zammad-target`                     |
| `50-variants.css`   | Adapter for the few Zammad semantics only expressed as utility classes (e.g. the yellow submit button) | utility class names                      |

Rules of the wrapper:

1. **Tokens first.** Almost every colour/size change is a token re-map, so any page Zammad adds
   later inherits the look automatically.
2. **Components, never pages.** Selectors target shared components via
   `[data-zammad-target='<ComponentName>']`. No selector names a route or a page. Teleported
   panels carry no marker, so they are reached through Zammad's stable id prefixes
   (`[id^='popover-']`, `aside[id^='flyout-']`, `[role='dialog'][id^='dialog-']`) and dropdowns
   through their ARIA `listbox`.
3. **No content changes.** No text, labels, icons or DOM are altered.
4. **Utility-class selectors are quarantined** in `50-variants.css`; it is the only file to
   re-check after a Zammad upgrade.
5. Remove the `amber/` folder and Zammad looks stock again.

### Structure: the Amber addon

Layout changes that CSS cannot make live in `apps/desktop/addons/amber/`, woven into core components
at build time by Zammad's addon weave (`amber.weave.mjs`, see `app/frontend/build/addonWeave/`).
Core files stay untouched; the addon renders semantic markup with `data-amber` hooks and
`60-addon.css` styles them.

| Change                                                                                                          | Core component                    |
| --------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| Workspace header (product mark, product name, user) on top of the sidebar                                       | `LayoutPage`                      |
| Page headers accept a `#breadcrumb` slot                                                                        | `LayoutContent`                   |
| Overview switcher in the header bar instead of the second-level sidebar; New ticket button                      | `TicketOverviews`                 |
| Ticket#/Title quick filter + reload above the list; state icon column dropped when State is shown               | `TicketList`                      |
| State (dot + label), priority (bars + label), owner (initials + name / Unassigned) cells; default column widths | `TicketListTable`                 |
| Dev-only dashboard placeholder forwards to the ticket list                                                      | `Dashboard`                       |
| Ticket view: one Activity / Public / Internal tab state per ticket                                              | `TicketDetailViewContent`         |
| Ticket header: status pill beside the actions, activity tabs as the last header row                             | `TopBarHeaderFull`                |
| Ticket feed rows follow the activity tab (hidden, not removed)                                                  | `ArticleList`                     |
| Ticket sidebar: customer contact block above the attributes                                                     | `TicketSidebarInformationContent` |

Overview columns are admin configuration (Overview → "Attributes"), not code; the reference layout
uses Ticket#, Title, State, Priority, Group, Customer, Owner, Updated at.

Known limits of a CSS-only skin: charts render to `<canvas>` (their font and colours come from
JS options), and the Zammad logo, user avatar colours and the "BETA UI" bar are content, not style.

## Colour

Monochrome UI; colour is reserved for status.

| Role                  | Light                  | Notes                                                                                      |
| --------------------- | ---------------------- | ------------------------------------------------------------------------------------------ |
| Text / primary action | `#171717`              | buttons, active text, links                                                                |
| Text secondary        | `#525252`              | body copy, table cells                                                                     |
| Text muted            | `#6B6B6B`              | meta, timestamps; helper text `#737373`, placeholders `#8F8F8F` (AA 4.5:1 on all surfaces) |
| App surface           | `#FFFFFF`              | content area, cards, dialogs                                                               |
| Sidebar surface       | `#F8F8F8`              | primary navigation                                                                         |
| Subtle fill           | `#F3F3F3`              | inputs, hover rows, chips                                                                  |
| Border                | `#E6E6E6`              | dividers, card borders; strong `#E2E2E2`, hairline `#EDEDED`                               |
| Danger                | `#9F1D17` on `#FDECEC` | errors, overdue, "to assign"                                                               |
| Warning               | `#7A5300` on `#FCF3DC` | pending, SLA warning                                                                       |
| Success               | `#1E6B45` on `#E6F4EC` | closed, resolved                                                                           |

Dark mode keeps Zammad's dark structure, re-tinted to neutral greys.

## Typography

- Family: **Inter** (variable, 400–700), fallback `system-ui`.
- Scale: 11 / 12 / **13 (UI base)** / 14 (nav, inputs) / 16 / 20 px.
- Weights: 400 body, 500 controls & nav, 600 headings & badges.
- Tabular numerals for counts, IDs and times.

## Spacing, radius, elevation

- 4 px grid; common gaps 6 / 8 / 12 px.
- Radius: 6 px chips, **8 px controls & nav items**, 10–12 px cards, dialogs and popovers.
- Shadows (sparingly): control `0 1px 2px rgba(0,0,0,.08)`;
  popover `0 8px 24px rgba(0,0,0,.10)`; dialog `0 20px 50px rgba(0,0,0,.20)`.

## Skeleton

- **Primary sidebar** 240–260 px, `#F8F8F8`, 1 px right border. Nav rows 32 px, 14 px text,
  16 px stroke icons, 8 px radius. Active row: white fill + control shadow, `#171717` text.
- **Sidebar search**: a nav row ("Search"), no box; `#EDEDED` on hover/focus.
- **Sidebar footer**: 32 px account avatar.
- **Content**: white, page header bar 48 px with a 1 px `#EDEDED` hairline, breadcrumb in
  `#6B6B6B / #171717`.
- **Secondary list sidebar** (e.g. overviews): same row style as primary nav.
- **Tables** (reference: Frappe ticket list): header as a `#F7F7F7` band, 36 px, rounded ends,
  13 px `#525252` labels; 42 px rows, 13 px `#171717` cells, no zebra, 1 px `#F3F3F3` dividers;
  hover `#F8F8F8`; selected `#F3F3F3`.
- **Ticket view** (reference: Frappe ticket page): 48 px breadcrumb + actions bar on a hairline;
  title block aligned left; Activity / Public / Internal tabs with a 2 px ink underline; sidebar
  header bar, contact block, sections split by hairlines with 14 px ink headings, fields as
  label | value rows (borderless until hover); reply composer as a floating card, internal replies
  in the warm comment frame, editor with a 3 px ink leading edge.
- **Avatars**: initials avatars are `#EDEDED` discs with `#404040` 600 initials; photos untouched.

## Components

- **Primary button**: `#171717` fill, white text, 8 px radius, 32 px high, 500 weight.
- **Secondary button** (labelled): `#F3F3F3` fill, `#171717` text, 32 px, 8 px radius,
  `#EDEDED` on hover — the reference's toolbar buttons (Filter, Columns, Last modified).
- **Icon / ghost button**: no fill, `#171717` icon, `#F3F3F3` on hover.
- **Danger**: `#FDECEC` fill, `#9F1D17` text.
- **Form field**: white, 1 px `#E2E2E2` edge, 8 px radius, ink outline on focus, 14 px text.
- **Search / filter input** (stand-alone): `#F3F3F3` fill, no edge, 32 px, 8 px radius.
- **Badge / count**: pill, 11–12 px 600, neutral `#F3F3F3 / #404040`; status pairs above.
- **Popover / menu**: white, 1 px `#E6E6E6`, 10 px radius, popover shadow, 32 px items.
- **Dialog / flyout**: white, 12 px radius (flyouts square to the edge), dialog shadow,
  20 px padding.
- **Focus**: 2 px `#171717` outline at 1 px offset (visible keyboard focus only).
