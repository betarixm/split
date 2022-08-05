<script lang="ts" setup>
import { spring } from 'motion'
import { Motion, Presence } from 'motion/vue'
import { getIdfromUrl } from '@/functions/gsheet'

const router = useRouter()

const url = ref('')

const id = computed(() => getIdfromUrl(url.value))

const enterHandler = () => {
    router.push({ name: 'series-id', params: { id: id.value } })
}
</script>

<template>
    <article class="container px-6 w-full flex flex-col items-center justify-center mx-auto overflow-x-hidden h-screen">
        <h1 class="font-extrabold text-9xl mb-16 text-center">
            Play. <br />
            Gather. <br />
            <span class="text-primary-500">Split.</span>
        </h1>
        <div class="relative flex w-full mx-auto flex-row transition-all md:w-3/4 lg:w-1/2">
            <input
                class="bg-white shadow-xl p-4 rounded-xl border border-neutral-200 transition-all mb-0 flex-grow"
                :class="{ 'mr-20': url }"
                type="text"
                v-model="url"
                placeholder="Google Spreadsheet Link..."
                @keyup.enter="enterHandler"
            />
            <Presence>
                <Motion
                    v-if="url"
                    :initial="{ opacity: 0, scale: 0 }"
                    :animate="{ opacity: 1, scale: 1 }"
                    :exit="{ opacity: 0, scale: 0 }"
                    :transition="{
                        easing: spring({
                            mass: 0.5,
                        }),
                    }"
                    class="right-0 absolute mt-0"
                >
                    <nuxt-link
                        class="bg-primary-500 shadow-xl p-4 rounded-xl border border-neutral-200 text-white text-center w-full block"
                        :to="{ name: 'series-id', params: { id } }"
                    >
                        Split
                    </nuxt-link>
                </Motion>
            </Presence>
        </div>
        <a
            href="https://docs.google.com/spreadsheets/d/1ubGM6Qj4ZeRGKoyRFIkh0k4dPz9_U4qu14muktZmExs/edit#gid=125200710"
            class="underline text-neutral-400 mt-6 font-light text-sm"
        >
            Copy Sample Spreadsheet ↗
        </a>
    </article>
</template>
