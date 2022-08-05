<script lang="ts" setup>
import { TxPromiseSummary } from '~~/types.js'
import { _withToggle } from '@/functions/toggle'
import { summaryToSend, summaryToReceive } from '@/functions/parse'

interface SeriesDetailSummaryProps {
    name: string
    spends: Record<string, number>
    accounts: Record<string, string>
    summaries: TxPromiseSummary[]
}

interface SeriesDetailSummaryEmits {
    (e: 'click-profile'): void
}

const props = defineProps<SeriesDetailSummaryProps>()

const emit = defineEmits<SeriesDetailSummaryEmits>()

const { name, spends, summaries } = toRefs(props)

const spend = computed<number>(() => spends.value[name.value])

const [tx, rx] = [
    computed(() => _withToggle(summaryToSend(summaries.value)(name.value))),
    computed(() => _withToggle(summaryToReceive(summaries.value)(name.value))),
]

const getComparisonTargets = (a: string, b: string) => {
    return {
        a: summaries.value.filter((s) => s.name === a && s.payer === b)[0],
        b: summaries.value.filter((s) => s.name === b && s.payer === a)[0],
    }
}
</script>

<template>
    <div class="flex gap-4 flex-col">
        <button
            class="w-full bg-gradient-to-b from-primary-400 to-primary-500 rounded-xl p-4 shadow-lg justify-between text-neutral-50"
            @click="emit('click-profile')"
        >
            <ul class="flex justify-between items-center gap-3">
                <li class="font-medium">{{ name }}</li>
                <li class="flex-grow text-right">{{ $n(spend) }}</li>
            </ul>
        </button>

        <series-detail-summary-list
            title="To Send"
            :name="name"
            :targets="summaryToSend(summaries)(name)"
            :summaries="summaries"
            :accounts="accounts"
        ></series-detail-summary-list>

        <series-detail-summary-list
            title="Receive from"
            :name="name"
            :targets="summaryToReceive(summaries)(name)"
            :summaries="summaries"
            :accounts="accounts"
        ></series-detail-summary-list>
    </div>
</template>
