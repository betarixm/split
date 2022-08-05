export interface TxPromiseBase {
    name: string
    rate: number
    amount: number
}

export interface Transaction {
    date: Date
    title: string
    description: string
    price: number
    payer: string
    promises: TxPromiseBase[]
}

export interface TxPromise {
    name: string
    rate: number
    amount: number
    transaction: Transaction
}

export interface TxPromiseSummaryBase {
    name: string
    payer: string
    amount: number
    promises: TxPromise[]
}

export interface TxPromiseSummary extends TxPromiseSummaryBase {
    merged: number
}
