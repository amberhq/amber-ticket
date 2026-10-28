// Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

import type { TicketByList } from '#shared/entities/ticket/types.ts'

import { useAmberTicketListFilter } from '../useAmberTicketListFilter.ts'

const tickets = [
  { number: '11002', title: 'Refund not received' },
  { number: '11010', title: 'Wrong currency on receipt' },
  { number: '11016', title: 'Bank details update for refund' },
] as TicketByList[]

describe('useAmberTicketListFilter', () => {
  it('returns all tickets without a filter', () => {
    const { filter } = useAmberTicketListFilter()

    expect(filter(tickets)).toHaveLength(3)
  })

  it('filters by title, case-insensitively', () => {
    const { filter, title } = useAmberTicketListFilter()

    title.value = 'REFUND'

    expect(filter(tickets).map((ticket) => ticket.number)).toEqual(['11002', '11016'])
  })

  it('filters by number, ignoring a leading hash', () => {
    const { filter, number } = useAmberTicketListFilter()

    number.value = '#11010'

    expect(filter(tickets).map((ticket) => ticket.number)).toEqual(['11010'])
  })

  it('combines both filters', () => {
    const { filter, number, title } = useAmberTicketListFilter()

    number.value = '1101'
    title.value = 'refund'

    expect(filter(tickets).map((ticket) => ticket.number)).toEqual(['11016'])
  })

  it('drops the state icon column only when a state column is shown', () => {
    const { headers } = useAmberTicketListFilter()

    expect(headers(['stateIcon', 'number', 'state_id'])).toEqual(['number', 'state_id'])
    expect(headers(['stateIcon', 'number', 'title'])).toEqual(['stateIcon', 'number', 'title'])
  })
})
