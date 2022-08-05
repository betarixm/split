<script lang="ts" setup>
import { Motion, Presence } from 'motion/vue'

export interface TheModalProps {
    visible: boolean
}

export interface TheModalEmits {
    (e: 'close'): void
}

const props = defineProps<TheModalProps>()
const emit = defineEmits<TheModalEmits>()

const { visible } = toRefs(props)
</script>

<template>
    <Teleport to="body">
        <Presence>
            <Motion
                v-if="visible"
                :initial="{ opacity: 0 }"
                :animate="{ opacity: 1 }"
                :exit="{ opacity: 0 }"
                class="fixed top-0 w-screen h-full backdrop-blur-sm bg-black/20 flex justify-center items-end md:items-center z-50"
                @click.prevent="emit('close')"
            >
                <the-modal-card :visible="visible" @close="emit('close')"><slot /></the-modal-card>
            </Motion>
        </Presence>
    </Teleport>
</template>
