<script lang="ts" setup>
import { Ref } from 'vue'
import { AxiosError } from 'axios'
import { Motion, Presence } from 'motion/vue'

useHead({
    title: 'Split',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    charset: 'utf-8',
    meta: [{ name: 'description', content: '✨ Play. Gather. Split.' }],
})

const route = useRoute()

const router = useRouter()

const nuxtApp = useNuxtApp()

const loading = ref(false)

const isAxiosError = (e: Error): e is AxiosError => e.name === 'AxiosError'

const errorMessage = (e: Ref<Error>) => {
    const error = e.value

    if (isAxiosError(error)) {
        return { message: `The requested spreadsheet was not found on Google.`, detail: error.message }
    } else {
        return { message: `The requested spreadsheet is malformed to split.`, detail: e.value.message }
    }
}

const errorHandler = (e: Ref<Error>) => {
    loading.value = false
    router.afterEach(() => {
        e.value = null
    })
}

nuxtApp.hook('page:start', () => {
    window.scrollTo(0, 0)
    loading.value = true
})

nuxtApp.hook('page:finish', () => {
    window.scrollTo(0, 0)
    loading.value = false
})
</script>

<template>
    <div>
        <the-header></the-header>

        <presence>
            <motion v-if="loading" :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :exit="{ opacity: 0 }">
                <div class="w-screen h-screen flex items-center justify-center">
                    <div class="inline-block w-8 h-8 border-4 rounded-full" role="status">
                        <span class="hidden">Loading...</span>
                    </div>
                </div>
            </motion>
        </presence>

        <presence>
            <motion
                :initial="{ opacity: 0, x: -25 }"
                :animate="{ opacity: 1, x: 0 }"
                :exit="{ opacity: 0 }"
                :key="route.fullPath"
                class="absolute w-full"
            >
                <div class="min-h-screen">
                    <nuxt-error-boundary>
                        <slot />

                        <template #error="{ error }">
                            <article class="container mx-auto px-6 my-24">
                                <h1 class="text-2xl font-bold mb-6">Oops</h1>
                                <p class="w-full bg-gray-100 rounded-xl p-4">
                                    <span class="block">{{ errorMessage(error).message }}</span>
                                    <span class="block text-sm text-neutral-600 mt-4 font-light">{{
                                        errorMessage(error).detail
                                    }}</span>
                                </p>
                            </article>
                            {{ errorHandler(error) }}
                        </template>
                    </nuxt-error-boundary>
                </div>

                <the-footer></the-footer>
            </motion>
        </presence>
    </div>
</template>
