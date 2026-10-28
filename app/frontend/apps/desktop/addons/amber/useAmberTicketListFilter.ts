// Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

import { ref } from 'vue'

import type { TicketByList } from '#shared/entities/ticket/types.ts'

/**
 * Quick filter for one ticket list: narrows the rows already loaded by ticket number and title,
 * and drops the state icon column when the overview has a real State column.
 */
export const useAmberTicketListFilter = () => {
  const number = ref('')
  const title = ref('')

  const filter = (tickets: TicketByList[]) => {
    const numberTerm = number.value.trim().replace(/^#/, '')
    const titleTerm = title.value.trim().toLowerCase()

    if (!numberTerm && !titleTerm) return tickets

    return tickets.filter(
      (ticket) =>
        (!numberTerm || ticket.number.includes(numberTerm)) &&
        (!titleTerm || ticket.title.toLowerCase().includes(titleTerm)),
    )
  }

  const headers = (localHeaders: string[]) =>
    localHeaders.includes('state_id')
      ? localHeaders.filter((header) => header !== 'stateIcon')
      : localHeaders

  return { number, title, filter, headers }
}
