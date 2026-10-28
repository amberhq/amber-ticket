<!-- Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/ -->

<script setup lang="ts">
import type { TicketById } from '#shared/entities/ticket/types.ts'

defineProps<{
  ticket: TicketById
}>()
</script>

<template>
  <span data-amber="state-pill" class="flex items-center gap-2">
    <span
      data-amber="state-dot"
      :data-state-type="ticket.state.stateType.name"
      :data-state-color="ticket.stateColorCode"
      aria-hidden="true"
    />
    {{ $t(ticket.state.name) }}
  </span>
</template>
