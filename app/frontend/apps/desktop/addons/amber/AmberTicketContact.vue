<!-- Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/ -->

<script setup lang="ts">
import { computed, toRef } from 'vue'

import type { TicketById } from '#shared/entities/ticket/types.ts'
import { useApplicationStore } from '#shared/stores/application.ts'

const props = defineProps<{
  ticket: TicketById
}>()

const config = toRef(useApplicationStore(), 'config')

const initials = computed(() =>
  props.ticket.customer.fullname
    ?.split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join(''),
)

const subtitle = computed(() =>
  [`${config.value.ticket_hook}${props.ticket.number}`, props.ticket.group?.name]
    .filter(Boolean)
    .join(' · '),
)
</script>

<template>
  <div data-amber="ticket-contact" class="flex items-center gap-3">
    <span data-amber="contact-initials" aria-hidden="true">{{ initials }}</span>
    <span class="flex min-w-0 flex-col">
      <span data-amber="contact-name" class="truncate">{{ ticket.customer.fullname }}</span>
      <span data-amber="contact-subtitle" class="truncate">{{ subtitle }}</span>
    </span>
  </div>
</template>
