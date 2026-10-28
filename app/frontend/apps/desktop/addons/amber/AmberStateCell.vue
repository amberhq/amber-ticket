<!-- Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/ -->

<script setup lang="ts">
import type { TicketByList } from '#shared/entities/ticket/types.ts'

defineProps<{
  ticket: TicketByList
}>()
</script>

<template>
  <span data-amber="state-cell" class="flex min-w-0 items-center gap-2">
    <span
      data-amber="state-dot"
      :data-state-type="ticket.state.stateType.name"
      :data-state-color="ticket.stateColorCode"
      aria-hidden="true"
    />
    <span class="truncate">{{ $t(ticket.state.name) }}</span>
  </span>
</template>
