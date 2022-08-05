<script lang="ts" setup>
import { useDrag } from '@vueuse/gesture'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { Motion, Presence } from 'motion/vue'
import { spring } from 'motion'

interface TheModalCardProps {
    visible: boolean
}

interface TheModalCardEmits {
    (e: 'close'): void
}

const props = defineProps<TheModalCardProps>()

const emit = defineEmits<TheModalCardEmits>()

const { visible } = toRefs(props)

const content = ref()

const dy = ref(0)

const contentElement = computed(() => content.value.root)

const SCROLLBREAK = 150

const onDragHandler = ({ movement: [_x, _y], dragging, swipe: [_swipe_x, _swipe_y] }) => {
    dy.value = dragging ? _y : 0

    if (_y >= SCROLLBREAK) {
        emit('close')
    }
}

useDrag(onDragHandler, {
    domTarget: contentElement,
    bounds: { top: -SCROLLBREAK, bottom: SCROLLBREAK, left: 0, right: 0 },
})

onMounted(() => {
    disableBodyScroll(contentElement.value)
})

onBeforeUnmount(() => {
    enableBodyScroll(contentElement.value)
})
</script>

<template>
    <Presence>
        <Motion
            v-show="visible"
            tag="section"
            ref="content"
            class="the-modal-card bg-white rounded-t-3xl p-6 pb-64 w-full shadow-lg -mb-48 md:rounded-3xl md:pb-6 md:mb-0 md:w-96 before:content-[''] md:before:content-none"
            :initial="{ opacity: 0, y: 200 }"
            :animate="{
                opacity: 1.0,
                y: dy,
            }"
            :transition="{
                duration: 2,
                easing: spring({
                    stiffness: 300,
                    damping: 20,
                    mass: 1.4,
                }),
            }"
            @click.stop
        >
            <button class="absolute hidden md:block text-neutral-400 m-6 top-0 right-0" @click="emit('close')">
                ✕
            </button>
            <slot />
        </Motion>
    </Presence>
</template>

<style lang="postcss" scoped>
.the-modal-card::before {
    @apply w-16 h-1 bg-neutral-300 mx-auto rounded-full mb-4 -mt-2 block;
}
</style>
