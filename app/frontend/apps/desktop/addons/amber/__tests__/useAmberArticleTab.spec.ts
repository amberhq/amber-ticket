// Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

import { isAmberArticleRowVisible } from '../useAmberArticleTab.ts'

const publicArticle = { type: 'article-bubble', article: { internal: false } }
const internalArticle = { type: 'article-bubble', article: { internal: true } }
const systemMessage = { type: 'system' }
const loadMore = { type: 'more' }

describe('isAmberArticleRowVisible', () => {
  it('shows every row in the full activity', () => {
    for (const row of [publicArticle, internalArticle, systemMessage, loadMore]) {
      expect(isAmberArticleRowVisible('all', row)).toBe(true)
    }
  })

  it('shows only public articles under "Public"', () => {
    expect(isAmberArticleRowVisible('public', publicArticle)).toBe(true)
    expect(isAmberArticleRowVisible('public', internalArticle)).toBe(false)
    expect(isAmberArticleRowVisible('public', systemMessage)).toBe(false)
  })

  it('shows only internal articles under "Internal"', () => {
    expect(isAmberArticleRowVisible('internal', internalArticle)).toBe(true)
    expect(isAmberArticleRowVisible('internal', publicArticle)).toBe(false)
  })

  it('keeps the "load more" row under every tab', () => {
    expect(isAmberArticleRowVisible('internal', loadMore)).toBe(true)
  })
})
