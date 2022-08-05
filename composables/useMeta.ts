import { Ref } from 'vue'
import { getAccountsfromMetaContent, getTitlefromMetaContent } from '~~/functions/meta'

export const useMeta = ({ content }: { content: Ref<string[][]> }) => {
    const title = computed<string>(() => getTitlefromMetaContent(content.value))
    const accounts = computed<Record<string, string>>(() => getAccountsfromMetaContent(content.value))
    return { title, accounts }
}
