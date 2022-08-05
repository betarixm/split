import type { Transaction, TxPromise, TxPromiseSummary } from 'types'
import type { Ref } from 'vue'
import {
    getParticipantsFromHeader,
    contentToTransactions,
    transactionsToPromises,
    promisesToSummaries,
    getSpendsFromPromises,
} from '@/functions/parse'

export const useSeries = ({
    header,
    content,
}: {
    header: Ref<string[]>
    content: Ref<string[][]>
}): {
    participants: Ref<string[]>
    transactions: Ref<Transaction[]>
    promises: Ref<TxPromise[]>
    summaries: Ref<TxPromiseSummary[]>
    spends: Ref<Record<string, number>>
} => {
    const participants = computed<string[]>(() => getParticipantsFromHeader(header.value))
    const transactions = computed<Transaction[]>(() => contentToTransactions(participants.value)(content.value))
    const promises = computed<TxPromise[]>(() => transactionsToPromises(transactions.value))
    const summaries = computed<TxPromiseSummary[]>(() => promisesToSummaries(promises.value))
    const spends = computed<Record<string, number>>(() => getSpendsFromPromises(promises.value))
    
    return { participants, transactions, promises, summaries, spends }
}
