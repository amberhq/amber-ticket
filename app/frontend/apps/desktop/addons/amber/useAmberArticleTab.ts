// Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

import { inject, provide, ref, type InjectionKey, type Ref } from 'vue'

export type AmberArticleTab = 'all' | 'public' | 'internal'

interface ArticleRow {
  type: string
  article?: { internal: boolean }
}

const AMBER_ARTICLE_TAB_KEY = Symbol('amber-article-tab') as InjectionKey<Ref<AmberArticleTab>>

/**
 * The ticket activity tab ("Activity" / "Public" / "Internal"), shared between the tab bar in the
 * ticket header and the article feed. Provided once per ticket view.
 */
export const provideAmberArticleTab = () => {
  const tab = ref<AmberArticleTab>('all')

  provide(AMBER_ARTICLE_TAB_KEY, tab)

  return tab
}

export const useAmberArticleTab = () => inject(AMBER_ARTICLE_TAB_KEY, ref<AmberArticleTab>('all'))

/**
 * Whether a feed row shows under a tab. Articles follow their visibility, "load more" always stays,
 * system and delivery messages only belong to the full activity.
 */
export const isAmberArticleRowVisible = (tab: AmberArticleTab, row: ArticleRow) => {
  if (tab === 'all' || row.type === 'more') return true
  if (row.type !== 'article-bubble' || !row.article) return false

  return tab === 'internal' ? row.article.internal : !row.article.internal
}
