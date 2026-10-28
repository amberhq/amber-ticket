<!-- Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/ -->

<script setup lang="ts">
import { computed } from 'vue'

import type { TicketByList } from '#shared/entities/ticket/types.ts'
import { getIdFromGraphQLId } from '#shared/graphql/utils.ts'

const props = defineProps<{
  ticket: TicketByList
}>()

// User 1 is Zammad's system user, which owns every ticket nobody is assigned to.
const isUnassigned = computed(
  () => !props.ticket.owner || getIdFromGraphQLId(props.ticket.owner.id) === 1,
)

const initials = computed(() =>
  (props.ticket.owner?.fullname ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join(''),
)
</script>

<template>
  <span v-if="isUnassigned" data-amber="unassigned">{{ $t('Unassigned') }}</span>
  <span v-else data-amber="owner-cell" class="flex min-w-0 items-center gap-2">
    <span data-amber="initials" aria-hidden="true">{{ initials }}</span>
    <span class="truncate">{{ ticket.owner?.fullname }}</span>
  </span>
</template>
