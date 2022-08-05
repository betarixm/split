<script setup>
const props = defineProps({
    error: Object,
})
</script>

<template>
    <nuxt-layout>
        <article class="container mx-auto px-6 my-24">
            <h1 class="text-2xl font-bold mb-6">Oops</h1>
            <p class="w-full bg-gray-100 rounded-xl p-4">
                <span class="block">{{ error }}</span>
            </p>
        </article>
    </nuxt-layout>
</template>
