<!-- Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/ -->

<script setup lang="ts">
import { toRef, useId } from 'vue'

import { useApplicationStore } from '#shared/stores/application.ts'

import CommonButton from '#desktop/components/CommonButton/CommonButton.vue'
import CommonInputSearch from '#desktop/components/CommonInputSearch/CommonInputSearch.vue'

const number = defineModel<string>('number', { required: true })
const title = defineModel<string>('title', { required: true })

defineEmits<{
  refresh: []
}>()

const config = toRef(useApplicationStore(), 'config')

// The search input labels itself "Search…"; `aria-labelledby` wins over that and names each filter.
const numberLabelId = useId()
const titleLabelId = useId()
</script>

<template>
  <div data-amber="overview-toolbar" class="flex items-center gap-2 pb-3">
    <span :id="numberLabelId" class="sr-only">{{ config.ticket_hook }}</span>
    <CommonInputSearch
      v-model="number"
      :placeholder="config.ticket_hook"
      :aria-labelledby="numberLabelId"
    />
    <span :id="titleLabelId" class="sr-only">{{ $t('Title') }}</span>
    <CommonInputSearch v-model="title" :placeholder="$t('Title')" :aria-labelledby="titleLabelId" />
    <CommonButton
      class="ms-auto"
      variant="secondary"
      icon="arrow-clockwise"
      :aria-label="$t('Reload')"
      @click="$emit('refresh')"
    />
  </div>
</template>
