// Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

import { renderComponent } from '#tests/support/components/index.ts'

import type { TicketByList } from '#shared/entities/ticket/types.ts'
import { convertToGraphQLId } from '#shared/graphql/utils.ts'

import AmberOwnerCell from '../AmberOwnerCell.vue'
import AmberPriorityCell from '../AmberPriorityCell.vue'
import AmberStateCell from '../AmberStateCell.vue'

const ticket = (attributes: Record<string, unknown>) => attributes as unknown as TicketByList

describe('Amber ticket table cells', () => {
  describe('AmberOwnerCell', () => {
    it('shows the owner with initials', () => {
      const view = renderComponent(AmberOwnerCell, {
        props: {
          ticket: ticket({ owner: { id: convertToGraphQLId('User', 5), fullname: 'Amber Admin' } }),
        },
      })

      expect(view.getByText('Amber Admin')).toBeInTheDocument()
      expect(view.getByText('AA')).toBeInTheDocument()
    })

    it('shows the system user as unassigned', () => {
      const view = renderComponent(AmberOwnerCell, {
        props: {
          ticket: ticket({ owner: { id: convertToGraphQLId('User', 1), fullname: '-' } }),
        },
      })

      expect(view.getByText('Unassigned')).toBeInTheDocument()
    })
  })

  describe('AmberPriorityCell', () => {
    it('fills one bar per priority level', () => {
      const view = renderComponent(AmberPriorityCell, {
        props: {
          ticket: ticket({
            priority: { id: convertToGraphQLId('Ticket::Priority', 2), name: '2 normal' },
          }),
        },
      })

      expect(view.getByText('2 normal')).toBeInTheDocument()
      expect(view.container.querySelectorAll('rect[data-active="true"]')).toHaveLength(2)
    })
  })

  describe('AmberStateCell', () => {
    it('shows the state with a typed dot', () => {
      const view = renderComponent(AmberStateCell, {
        props: {
          ticket: ticket({
            state: { name: 'open', stateType: { name: 'open' } },
            stateColorCode: 'open',
          }),
        },
      })

      expect(view.getByText('open')).toBeInTheDocument()
      expect(view.container.querySelector('[data-amber="state-dot"]')).toHaveAttribute(
        'data-state-type',
        'open',
      )
    })
  })
})
