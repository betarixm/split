<script setup lang="ts">
import type { TxPromiseSummary } from '@/types'
import copy from 'copy-to-clipboard'

interface SeriesDetailOpponentModalProps {
    title: string
    a?: TxPromiseSummary
    b?: TxPromiseSummary
    visible: boolean
    accounts: Record<string, string>
}

interface SeriesDetailOpponentModalEmits {
    (e: 'close'): void
}

const props = defineProps<SeriesDetailOpponentModalProps>()

const emit = defineEmits<SeriesDetailOpponentModalEmits>()

const { title, a, b, visible, accounts } = toRefs(props)

const [copied, setCopied] = useToggle()

const account = computed(() => accounts.value[title.value])

const clickHandler = (s: string) => {
    copy(s)
    setCopied(true)
}

onUpdated(() => {
    setCopied(false)
})
</script>
<template>
    <the-modal :visible="visible" @close="emit('close')">
        <h1 class="mb-4 block text-lg font-bold">{{ title }}</h1>

        <div v-for="summary in [a, b].filter((s) => s !== undefined)" class="mb-4">
            <table class="table-fixed w-full">
                <tbody>
                    <tr class="border-b border-neutral-200 font-medium">
                        <td class="">{{ summary.name }} → {{ summary.payer }}</td>
                        <td class="text-right py-0.5">{{ $n(summary.amount) }}</td>
                    </tr>
                    <tr v-for="promise in summary.promises" class="text-neutral-400">
                        <td class="py-0.5 font-normal">{{ promise.transaction.title }}</td>
                        <td class="text-right font-light">{{ $n(promise.amount) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="w-full bg-gray-100 rounded-xl p-4 mt-8 text-center">
            <span class="font-light">{{ $n(a?.amount ?? 0) }} - {{ $n(b?.amount ?? 0) }} = </span>
            <span class="font-semibold text-lg">{{ $n((a?.amount ?? 0) - (b?.amount ?? 0)) }}</span>
        </div>

        <button
            class="w-full bg-primary-500 rounded-xl p-4 mt-4 text-center text-white whitespace-nowrap"
            v-if="account"
            @click="clickHandler(account)"
        >
            <span>{{ account }}</span>
            <span v-if="copied" class="bg-neutral-700/20 px-2 rounded-md py-0.5 text-sm ml-2">Copied!</span>
        </button>
    </the-modal>
</template>
