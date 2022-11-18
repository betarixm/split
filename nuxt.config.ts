// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    modules: ['@nuxtjs/tailwindcss', '@intlify/nuxt3', '@vueuse/nuxt'],

    intlify: {
        vueI18n: {
            locale: 'ko',
        },
    },
    ssr: false,
})
