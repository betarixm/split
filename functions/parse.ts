import type {
    Transaction,
    TxPromise,
    TxPromiseBase,
    TxPromiseSummary,
    TxPromiseSummaryBase as TxPromiseImmSummary,
} from '@/types'
import { COLUMNS } from '@/enums'
import { mutate } from '@/functions'

type GroupPromises = (promises: TxPromise[]) => Record<string, TxPromise[]>

const sumPromises =
    (promises: TxPromise[]) =>
    (getter: (p: TxPromise) => number): number =>
        promises.reduce((r, p: TxPromise) => r + getter(p), 0)

const groupPromises =
    (getter: (p: TxPromise) => string): GroupPromises =>
    (promises: TxPromise[]) =>
        promises.reduce((r, p: TxPromise) => {
            const key = getter(p)
            r[key] = r[key] ?? []
            r[key].push(p)
            return r
        }, {})

const sumPromisesByAmount = (promises: TxPromise[]): number => sumPromises(promises)((p) => p.amount)

const groupPromisesByName = (promises: TxPromise[]): { [key: string]: TxPromise[] } =>
    groupPromises((p) => p.name)(promises)

const groupPromisesByPayer = (promises: TxPromise[]): { [key: string]: TxPromise[] } =>
    groupPromises((p) => p.transaction.payer)(promises)

export const getParticipantsFromHeader = (header: string[]) => header.slice(COLUMNS.__LENGTH)

export const contentToTransactions =
    (participants: string[]) =>
    (content: string[][]): Transaction[] =>
        content.map((arr: string[]) => {
            const rates: number[] = arr.slice(COLUMNS.__LENGTH).map((r: string) => Number(r))
            const price: number = Number(arr[COLUMNS.PRICE].replace(/\D/g, ''))
            const denominator: number = rates.reduce((r, s) => r + s, 0)
            return {
                date: new Date(Number(arr[COLUMNS.YEAR]), Number(arr[COLUMNS.MONTH]) - 1, Number(arr[COLUMNS.DATE])),
                title: arr[COLUMNS.TITLE],
                description: arr[COLUMNS.DESCRIPTION],
                price: price,
                payer: arr[COLUMNS.PAYER],
                promises: rates.map((rate: number, index: number) => ({
                    name: participants[index],
                    rate: rate,
                    amount: Math.round((rate / denominator) * price),
                })),
            }
        })

export const transactionsToPromises = (transactions: Transaction[]): TxPromise[] =>
    transactions
        .map((t: Transaction) =>
            t.promises.map((p: TxPromiseBase) => ({
                ...p,
                transaction: t,
            }))
        )
        .flat()

const promisesToSummaryMap = (f: GroupPromises) => (g: GroupPromises) => (promises: TxPromise[]) =>
    mutate<TxPromise[], Record<string, TxPromiseImmSummary>>(f(promises))(([name, promises]) =>
        mutate<TxPromise[], TxPromiseImmSummary>(g(promises))(([payer, promises]) => ({
            name,
            payer,
            promises,
            amount: sumPromisesByAmount(promises),
        }))
    )

export const promisesToSummaries = (promises: TxPromise[]): TxPromiseSummary[] => {
    const imm = promisesToSummaryMap(groupPromisesByName)(groupPromisesByPayer)(promises)

    return Object.values(imm)
        .map((summaries) =>
            Object.values(summaries).map((s) => ({
                ...s,
                merged: (imm[s.payer][s.name]?.amount ?? 0) - s.amount,
            }))
        )
        .flat()
}

export const getSpendsFromPromises = (promises: TxPromise[]): Record<string, number> =>
    mutate<TxPromise[], number>(groupPromisesByName(promises))(([name, promises]) => sumPromisesByAmount(promises))

const reverseSummaryPayer = (summary: TxPromiseSummary): TxPromiseSummary => ({
    ...summary,
    name: summary.payer,
    payer: summary.name,
})

const reverseSummaryMerged = (summary: TxPromiseSummary): TxPromiseSummary => ({
    ...summary,
    merged: -summary.merged,
})

export const summaryToReceive = (summaries: TxPromiseSummary[]) => (name: string) => {
    return summaries
        .filter((s) => s.payer === name && s.merged < 0)
        .map(reverseSummaryPayer)
        .map(reverseSummaryMerged)
}

export const summaryToSend = (summaries: TxPromiseSummary[]) => (name: string) => {
    return summaries.filter((s) => s.name === name && s.merged < 0).map(reverseSummaryMerged)
}
