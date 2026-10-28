// Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

// Amber addon: the structural half of the Amber skin (`styles/custom/amber/` is the visual half).
// Woven into core SFCs at build time (see `app/frontend/build/addonWeave/README.md`), so no core file
// is edited. Each rule names the core component it extends; a stale anchor fails the build loudly.

const ADDON = '#desktop/addons/amber'

export const addonWeaveRules = [
  // Every page header can swap its breadcrumb for richer content (used by the overview switcher).
  {
    target: 'apps/desktop/components/layout/LayoutContent.vue',
    template: [
      {
        match: { component: 'CommonBreadcrumb' },
        wrap: { open: '<slot name="breadcrumb">', close: '</slot>' },
      },
    ],
  },

  // Overviews: a view switcher in the header bar replaces the second-level sidebar, plus a Create
  // button, as in Frappe Helpdesk's ticket list.
  {
    target: 'apps/desktop/pages/ticket-overviews/views/TicketOverviews.vue',
    scriptSetup: [
      `import AmberOverviewSwitcher from '${ADDON}/AmberOverviewSwitcher.vue'`,
      `import AmberCreateTicketButton from '${ADDON}/AmberCreateTicketButton.vue'`,
    ].join('\n'),
    template: [
      { match: { root: true }, setAttribute: { name: ':class', value: "''" } },
      { match: { id: 'ticket-overviews' }, remove: true },
      {
        match: { component: 'LayoutContent' },
        append:
          '<template #breadcrumb><AmberOverviewSwitcher :current-overview="currentOverview" :count="currentOverviewCount" /></template>',
      },
      { match: { component: 'TicketBulkEditButton' }, insertAfter: '<AmberCreateTicketButton />' },
    ],
  },

  // Ticket list: quick filter + refresh toolbar above the table; the state icon column gives way to
  // the State column when the overview shows one.
  {
    target: 'apps/desktop/pages/ticket-overviews/components/TicketList.vue',
    scriptSetup: [
      `import AmberOverviewToolbar from '${ADDON}/AmberOverviewToolbar.vue'`,
      `import { useAmberTicketListFilter } from '${ADDON}/useAmberTicketListFilter.ts'`,
      'const __amberFilter = useAmberTicketListFilter()',
    ].join('\n'),
    template: [
      {
        match: { component: 'TicketListTable' },
        insertBefore:
          '<AmberOverviewToolbar v-model:number="__amberFilter.number.value" v-model:title="__amberFilter.title.value" @refresh="ticketsQuery.refetch({ renewCache: true })" />',
        setAttribute: { name: ':items', value: '__amberFilter.filter(tickets)' },
      },
      {
        match: { component: 'TicketListTable' },
        setAttribute: { name: ':headers', value: '__amberFilter.headers(localHeaders)' },
      },
    ],
  },

  // Ticket table cells: status dot + label, priority bars + label, assignee avatar + name.
  {
    target: 'apps/desktop/components/Ticket/TicketListTable.vue',
    scriptSetup: [
      `import AmberStateCell from '${ADDON}/AmberStateCell.vue'`,
      `import AmberPriorityCell from '${ADDON}/AmberPriorityCell.vue'`,
      `import AmberOwnerCell from '${ADDON}/AmberOwnerCell.vue'`,
      // The owner column gets its own cell; drop core's generic user popover slot for it.
      "userPopoverSlots.splice(userPopoverSlots.findIndex((slot) => slot.slotName === 'column-cell-owner_id'), 1)",
    ].join('\n'),
    template: [
      {
        match: { component: 'CommonAdvancedTable' },
        // Default column widths (the subject gets the most room); user-resized widths still win.
        // NOTE: restates core's `title` / `number` extensions, since a weave replaces the binding —
        // re-check against TicketListTable.vue after a Zammad upgrade.
        setAttribute: {
          name: ':attribute-extensions',
          value: [
            '{',
            'title: { headerPreferences: { displayWidth: 270 }, columnPreferences: { link: goToItemLinkColumn, tooltip: (item: TicketByList) => item.title } },',
            'number: { label: config.ticket_hook, headerPreferences: { displayWidth: 90 }, columnPreferences: { link: goToItemLinkColumn } },',
            'state_id: { headerPreferences: { displayWidth: 120 } },',
            'priority_id: { headerPreferences: { displayWidth: 110 } },',
            'owner_id: { headerPreferences: { displayWidth: 160 } },',
            'group_id: { headerPreferences: { displayWidth: 110 } },',
            'customer_id: { headerPreferences: { displayWidth: 140 } },',
            'updated_at: { headerPreferences: { displayWidth: 110 } },',
            '}',
          ].join(' '),
        },
        append: [
          '<template #column-cell-state_id="{ item }"><AmberStateCell :ticket="item" /></template>',
          '<template #column-cell-priority_id="{ item }"><AmberPriorityCell :ticket="item" /></template>',
          '<template #column-cell-owner_id="{ item }"><AmberOwnerCell :ticket="item" /></template>',
        ].join(''),
      },
    ],
  },

  // Primary sidebar: a workspace header (product mark, product name, signed-in user) on top.
  {
    target: 'apps/desktop/components/layout/LayoutPage.vue',
    scriptSetup: `import AmberWorkspaceHeader from '${ADDON}/AmberWorkspaceHeader.vue'`,
    template: [
      {
        match: { component: 'LeftSidebarHeader' },
        insertBefore: '<AmberWorkspaceHeader v-if="!isCollapsed" class="px-3 pt-3" />',
      },
    ],
  },

  // The dev-only dashboard placeholder forwards to the ticket list (production has no dashboard).
  {
    target: 'apps/desktop/pages/dashboard/views/Dashboard.vue',
    scriptSetup: [
      "import { useRouter as __amberUseRouter } from 'vue-router'",
      "__amberUseRouter().replace({ name: 'TicketOverview' })",
    ].join('\n'),
  },

  // Ticket view: one activity tab state per ticket, shared by the header tabs and the feed.
  {
    target: 'apps/desktop/pages/ticket/components/TicketDetailView/TicketDetailViewContent.vue',
    scriptSetup: [
      `import { provideAmberArticleTab } from '${ADDON}/useAmberArticleTab.ts'`,
      'provideAmberArticleTab()',
    ].join('\n'),
  },

  // Ticket header: a status pill beside the actions, and Activity / Public / Internal tabs below.
  {
    target:
      'apps/desktop/pages/ticket/components/TicketDetailView/TicketDetailTopBar/components/TopBarHeaderFull.vue',
    scriptSetup: [
      `import AmberTicketStatePill from '${ADDON}/AmberTicketStatePill.vue'`,
      `import AmberArticleTabs from '${ADDON}/AmberArticleTabs.vue'`,
    ].join('\n'),
    template: [
      {
        match: { component: 'HighlightMenu' },
        insertBefore: '<AmberTicketStatePill v-if="ticket" :ticket="ticket" />',
      },
      {
        match: { root: true },
        append: '<AmberArticleTabs v-if="ticket" class="col-span-2" />',
      },
    ],
  },

  // Ticket feed: rows follow the activity tab (hidden, not removed, so scrolling logic is unchanged).
  {
    target: 'apps/desktop/pages/ticket/components/TicketDetailView/ArticleList.vue',
    scriptSetup: [
      `import { isAmberArticleRowVisible, useAmberArticleTab } from '${ADDON}/useAmberArticleTab.ts'`,
      'const __amberArticleTab = useAmberArticleTab()',
    ].join('\n'),
    template: [
      {
        match: { element: 'article' },
        addAttribute: 'v-show="isAmberArticleRowVisible(__amberArticleTab, row)"',
      },
    ],
  },

  // Ticket sidebar: the customer as a contact block above the attributes.
  {
    target:
      'apps/desktop/pages/ticket/components/TicketSidebar/TicketSidebarInformation/TicketSidebarInformationContent.vue',
    scriptSetup: `import AmberTicketContact from '${ADDON}/AmberTicketContact.vue'`,
    template: [
      {
        match: { id: 'ticket-attributes' },
        insertBefore: '<AmberTicketContact v-if="ticket" :ticket="ticket" />',
      },
    ],
  },
]
