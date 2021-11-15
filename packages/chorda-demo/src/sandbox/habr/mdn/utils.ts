import { Blueprint, HtmlScope, Infer, mix, watch } from "@chorda/core"


export function isFuzzySearchString(str: string) {
    // Данная функция возвращает `true`,
    // если строка начинается с `/` и не содержит пробелов
    return str.startsWith('/') && !/\s/.test(str)
}

export const stringToParts = (s: string, q: string) : {text: string, highlight: boolean}[] => {
    const words = q.trim().toLowerCase().split(/[ ,]+/)
    const regexWords = words.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    const regex = `\\b(${regexWords.join('|')})`
    const parts = s.split(new RegExp(regex, 'gi'))
    return parts.map(part => {
        if (words.includes(part.toLowerCase())) {
            return {text: part, highlight: true}
        }
        else {
            return {text: part, highlight: false}
        }
    })
}


export const withAutoFocus = <T, E>(props?: Blueprint<T, E>) : Infer.Blueprint<T, E> => {
    return mix<HtmlScope>({
        joints: {
            autoFocus: ({$dom}) => {

                watch(() => {
                    if ($dom.$value) {
                            $dom.$value.focus()
                    }
                }, [$dom])

            },
        }
    },
    props)
}
