export const mutate =
    <V, W>(o: Record<string, V>) =>
    (f: ([key, value]: [key: string, value: V]) => W): { [key: string]: W } =>
        Object.fromEntries<W>(Object.entries(o).map((x) => [x[0], f(x)]))
