<!-- Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/ -->

<script setup lang="ts">
import { computed, toRef } from 'vue'

import { useApplicationStore } from '#shared/stores/application.ts'
import { useSessionStore } from '#shared/stores/session.ts'

const config = toRef(useApplicationStore(), 'config')
const user = toRef(useSessionStore(), 'user')

const productName = computed(() => config.value.product_name || 'Zammad')
const mark = computed(() => productName.value.trim().charAt(0).toUpperCase())
</script>

<template>
  <div data-amber="workspace" class="flex items-center gap-2.5">
    <span data-amber="workspace-mark" aria-hidden="true">{{ mark }}</span>
    <span class="flex min-w-0 flex-col">
      <span data-amber="workspace-name" class="truncate">{{ productName }}</span>
      <span v-if="user?.fullname" data-amber="workspace-user" class="truncate">{{
        user.fullname
      }}</span>
    </span>
  </div>
</template>
