import { Ref } from 'vue'
import axios from 'axios'
import useSWRV from 'swrv'
import { IResponse } from 'swrv/dist/types'
import { SWRV_STATES } from '@/composables/useSwrvState'

export interface SwrvResponse extends IResponse {
    state: Ref<SWRV_STATES>
}

export const useGoogleSheet = (id: string) => (sheet?: string) =>
    new Promise<SwrvResponse>((resolve, reject) => {
        const { data, error, isValidating, mutate } = useSWRV(
            () => `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv${sheet ? `&sheet=${sheet}` : ''}`,
            (key) => axios.get(key),
            {
                shouldRetryOnError: false,
            }
        )

        mutate().then(() => {
            if (data.value) {
                resolve({ data, error, isValidating, mutate, state: useSwrvState(data, error, isValidating) })
            } else {
                reject(error.value)
            }
        })
    })
