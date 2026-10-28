<!-- Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/ -->

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { useSessionStore } from '#shared/stores/session.ts'

import CommonButton from '#desktop/components/CommonButton/CommonButton.vue'

const router = useRouter()

const { hasPermission } = useSessionStore()

const canCreate = computed(() => hasPermission(['ticket.agent', 'ticket.customer']))
</script>

<template>
  <CommonButton
    v-if="canCreate"
    data-amber="create-ticket"
    variant="primary"
    prefix-icon="plus"
    @click="router.push({ name: 'TicketCreate' })"
  >
    {{ $t('New ticket') }}
  </CommonButton>
</template>
