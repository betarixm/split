import { parse } from 'csv-parse/browser/esm/sync'

export const rawCsvToRecord: (csv: string) => string[][] = parse

export const getHeaderFromCsvRecord = (data: string[][]): string[] => data[0]

export const getContentFromCsvRecord = (data: string[][]): string[][] => data.slice(1)

