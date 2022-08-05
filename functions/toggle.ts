import { Ref } from 'vue'

type WithToggle<T extends {}> = T & {
    toggle: (value?: boolean) => void
    toggled: Ref<boolean>
}

export const _withToggle = <T extends {}>(x: T[]): WithToggle<T>[] =>
    x.map((_x: T) => {
        const [toggled, toggle] = useToggle()
        return { ..._x, toggle, toggled }
    })

export const withToggle = <T extends object>(x: Ref<T[]>): Ref<WithToggle<T>[]> => computed(() => _withToggle(x.value))
