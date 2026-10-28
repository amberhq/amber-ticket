<!-- Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/ -->

<script setup lang="ts">
import { type AmberArticleTab, useAmberArticleTab } from './useAmberArticleTab.ts'

const tab = useAmberArticleTab()

const tabs: { value: AmberArticleTab; label: string; icon: string }[] = [
  { value: 'all', label: __('Activity'), icon: 'list' },
  { value: 'public', label: __('Public'), icon: 'chat-left-text' },
  { value: 'internal', label: __('Internal'), icon: 'lock' },
]
</script>

<template>
  <div
    data-amber="article-tabs"
    class="flex items-end gap-5"
    role="group"
    :aria-label="$t('Activity')"
  >
    <button
      v-for="item in tabs"
      :key="item.value"
      type="button"
      data-amber="article-tab"
      class="flex items-center gap-1.5"
      :aria-pressed="tab === item.value"
      @click="tab = item.value"
    >
      <CommonIcon :name="item.icon" size="tiny" decorative />
      {{ $t(item.label) }}
    </button>
  </div>
</template>
