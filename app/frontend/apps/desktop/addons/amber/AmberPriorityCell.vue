<!-- Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/ -->

<script setup lang="ts">
import { computed } from 'vue'

import type { TicketByList } from '#shared/entities/ticket/types.ts'
import { getIdFromGraphQLId } from '#shared/graphql/utils.ts'

const props = defineProps<{
  ticket: TicketByList
}>()

// Zammad's default priorities are 1 low, 2 normal, 3 high; anything above fills all bars.
const level = computed(() =>
  props.ticket.priority
    ? Math.min(Math.max(getIdFromGraphQLId(props.ticket.priority.id), 1), 3)
    : 0,
)
</script>

<template>
  <span v-if="ticket.priority" data-amber="priority-cell" class="flex min-w-0 items-center gap-2">
    <svg data-amber="priority-bars" viewBox="0 0 12 10" width="12" height="10" aria-hidden="true">
      <rect
        v-for="bar in 3"
        :key="bar"
        :x="(bar - 1) * 4.5"
        :y="10 - bar * 3 - 1"
        width="3"
        :height="bar * 3 + 1"
        rx="0.5"
        :data-active="bar <= level"
      />
    </svg>
    <span class="truncate">{{ $t(ticket.priority.name) }}</span>
  </span>
</template>
