<script lang="ts" setup>
import type { Ref } from 'vue'
import { RouteParams } from 'vue-router'
import { Presence, Motion } from 'motion/vue'
import { useStorage } from '@vueuse/core'
import type { TxPromiseSummary, Transaction, TxPromise } from '@/types'
import SeriesDetailTransactions from '~~/components/SeriesDetailTransactions.vue'
import SeriesDetailSummary from '~~/components/SeriesDetailSummary.vue'

interface SeriesIdParams extends RouteParams {
    id: string
}

const route = useRoute()

const { id } = route.params as SeriesIdParams

const googleSheets = useGoogleSheet(id)

const { data: dataResponse } = await googleSheets('data')

const data = computed(() => dataResponse.value.data)

const metadata = computed(() => metaResponse.value.data)
const {
    summaries,
    spends,
    transactions,
}: {
    participants: Ref<string[]>
    transactions: Ref<Transaction[]>
    promises: Ref<TxPromise[]>
    summaries: Ref<TxPromiseSummary[]>
    spends: Ref<Record<string, number>>
} = useSeries(useCsv({ raw: data }))

const { data: metaResponse } = await googleSheets('meta')

const {
    title,
    accounts,
}: {
    title: Ref<string>
    accounts: Ref<Record<string, string>>
} = useMeta(useCsv({ raw: metadata }))

const profileSelectHandler = (_name: string) => {
    name.value = _name
    closeProfiles()
}

const closeProfiles = () => {
    if (name.value) {
        toggleProfiles(false)
    }
}

const name = useStorage(id, '')

const [isProfilesToggled, toggleProfiles] = useToggle(name.value === '')

const dates = computed<Date[]>(() =>
    transactions.value.map((t) => t.date).sort((a, b) => (a.getTime() > b.getTime() ? 1 : -1))
)

const [start, end] = [
    computed<Date>(() => (dates.value.length > 0 ? dates.value.at(0) : new Date())),
    computed<Date>(() => (dates.value.length > 0 ? dates.value.at(-1) : new Date())),
]

useHead({
    title: `Split ─ ${title.value}`,
    meta: [{ name: 'description', content: `✨ Let's split the bills ─ ${title.value}` }],
})
</script>

<template>
    <article class="container mx-auto px-6 my-24">
        <section class="mb-12">
            <h1 class="text-2xl font-bold">{{ title }}</h1>
            <span class="text-sm font-light text-neutral-500">
                {{ $d(start) }}
                <template v-if="start.getTime() !== end.getTime()">- {{ $d(end) }}</template>
            </span>
        </section>

        <presence>
            <motion
                :initial="{ opacity: 0 }"
                :animate="{ opacity: 1, transition: { delay: 0.5 } }"
                :exit="{ opacity: 0 }"
                v-if="name"
                :key="name"
            >
                <div class="grid gap-10 md:grid-cols-5">
                    <section class="md:col-span-2">
                        <series-detail-summary
                            :name="name"
                            :accounts="accounts"
                            :spends="spends"
                            :summaries="summaries"
                            @click-profile="toggleProfiles(true)"
                        />
                    </section>

                    <section class="md:col-span-3">
                        <series-detail-transactions :transactions="transactions" :name="name" />
                    </section>
                </div>
            </motion>
        </presence>

        <the-modal :visible="isProfilesToggled" @close="closeProfiles()">
            <h2 class="text-xl font-medium mb-4">Select Profile</h2>
            <div class="grid grid-cols-2 gap-4">
                <button
                    class="w-full rounded-xl p-4 transition-all"
                    :class="{
                        'bg-primary-500 border border-primary-600 text-neutral-100 shadow-lg': name === _name,
                        'bg-gray-100 text-neutral-500': name !== _name,
                    }"
                    v-for="(_amount, _name) in spends"
                    @click="profileSelectHandler(_name)"
                >
                    <span class="block">{{ _name }}</span>
                    <span class="bg-neutral-700/10 px-2 rounded-md py-0.5 text-sm">{{ $n(_amount) }}</span>
                </button>
            </div>
        </the-modal>
    </article>
</template>
