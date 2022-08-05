<script lang="ts" setup>
import { TxPromiseSummary } from '~~/types.js'
import { withToggle } from '@/functions/toggle'

export interface SeriesDetailSummaryListProps {
    name: string
    title: string
    targets: TxPromiseSummary[]
    summaries: TxPromiseSummary[]
    accounts: Record<string, string>
}

const props = defineProps<SeriesDetailSummaryListProps>()

const { targets, summaries } = toRefs(props)

const targetsWithToggle = withToggle<TxPromiseSummary>(targets)

const getComparisonTargets = (a: string, b: string) => {
    const [_a, _b] = [
        summaries.value.filter((s) => s.name === a && s.payer === b)[0],
        summaries.value.filter((s) => s.name === b && s.payer === a)[0],
    ].sort((a, b) => {
        if (b === undefined) {
            return 1
        } else if (a === undefined) {
            return -1
        } else {
            return a.amount < b.amount ? 1 : -1
        }
    })

    return { a: _a, b: _b }
}
</script>

<template>
    <div class="w-full bg-gray-100 rounded-xl p-4" v-if="targetsWithToggle.length">
        <h4 class="mb-2 font-bold">{{ title }}</h4>
        <button
            v-for="promise in targetsWithToggle"
            :key="promise.payer"
            class="flex w-full justify-between text-neutral-600"
            @click="promise.toggle(true)"
        >
            <span>{{ promise.payer }}</span>
            <span>{{ $n(promise.merged) }}</span>
            <series-detail-opponent-modal
                v-bind="getComparisonTargets(name, promise.payer)"
                :title="promise.payer"
                :visible="promise.toggled.value"
                :accounts="accounts"
                @close="promise.toggle(false)"
            ></series-detail-opponent-modal>
        </button>
    </div>
</template>
