import type { Ref } from 'vue'
import { ref, watchEffect } from 'vue'

export enum SWRV_STATES {
    VALIDATING,
    PENDING,
    SUCCESS,
    ERROR,
    STALE_IF_ERROR,
}

export const useSwrvState = <T>(
    data: Ref<T | undefined>,
    error: Ref<Error | undefined>,
    isValidating: Ref<boolean>
) => {
    const state: Ref<SWRV_STATES> = ref(SWRV_STATES.PENDING)

    watchEffect(() => {
        if (data.value && isValidating.value) {
            state.value = SWRV_STATES.VALIDATING
        } else if (data.value && error.value) {
            state.value = SWRV_STATES.STALE_IF_ERROR
        } else if (data.value === undefined && !error.value) {
            state.value = SWRV_STATES.PENDING
        } else if (data.value && !error.value) {
            state.value = SWRV_STATES.SUCCESS
        } else if (data.value === undefined && error) {
            state.value = SWRV_STATES.ERROR
        }
    })

    return state
}
