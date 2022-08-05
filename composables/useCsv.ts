import type { Ref } from 'vue'
import { getContentFromCsvRecord, getHeaderFromCsvRecord, rawCsvToRecord } from '@/functions/csv'

export const useCsv = ({ raw }: { raw: Ref<string> }) => {
    const data = computed(() => rawCsvToRecord(raw.value))
    const header = computed(() => getHeaderFromCsvRecord(data.value))
    const content = computed(() => getContentFromCsvRecord(data.value))

    return {
        data,
        header,
        content,
    }
}
