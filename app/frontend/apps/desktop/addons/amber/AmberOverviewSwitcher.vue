<!-- Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/ -->

<script setup lang="ts">
import { computed } from 'vue'

import CommonPopover from '#desktop/components/CommonPopover/CommonPopover.vue'
import { usePopover } from '#desktop/components/CommonPopover/usePopover.ts'
import CommonPopoverMenu from '#desktop/components/CommonPopoverMenu/CommonPopoverMenu.vue'
import type { MenuItem } from '#desktop/components/CommonPopoverMenu/types.ts'
import { useTicketOverviews } from '#desktop/pages/ticket-overviews/composables/useTicketOverviews.ts'

interface Props {
  currentOverview?: { id: string; name: string; link: string }
  count?: number
}

defineProps<Props>()

const { overviews } = useTicketOverviews()

const { popover, popoverTarget, toggle, isOpen } = usePopover()

const items = computed<MenuItem[]>(() =>
  overviews.value.map((overview) => ({
    key: overview.id,
    label: overview.name,
    link: `/tickets/view/${overview.link}`,
  })),
)
</script>

<template>
  <nav
    data-amber="overview-switcher"
    class="flex min-w-0 items-center gap-1.5"
    :aria-label="$t('Overviews')"
  >
    <span data-amber="crumb">{{ $t('Tickets') }}</span>
    <span data-amber="crumb" aria-hidden="true">/</span>

    <button
      ref="popoverTarget"
      data-amber="view-button"
      class="flex min-w-0 items-center gap-1.5"
      aria-controls="amber-overview-switcher"
      :aria-expanded="isOpen"
      @click="toggle(true)"
    >
      <CommonIcon name="list" size="tiny" decorative />
      <span class="truncate">{{
        currentOverview ? $t(currentOverview.name) : $t('Overviews')
      }}</span>
      <CommonIcon name="chevron-down" size="xs" decorative />
    </button>

    <CommonBadge v-if="count !== undefined" data-amber="view-count" size="xs" rounded>{{
      count
    }}</CommonBadge>

    <CommonPopover
      id="amber-overview-switcher"
      ref="popover"
      :owner="popoverTarget"
      orientation="autoVertical"
      placement="start"
      hide-arrow
    >
      <CommonPopoverMenu :popover="popover" :items="items" />
    </CommonPopover>
  </nav>
</template>
