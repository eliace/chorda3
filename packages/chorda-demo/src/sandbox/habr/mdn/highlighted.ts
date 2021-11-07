import { Blueprint, computable, Infer, Injector, mix } from "@chorda/core"
import { stringToParts } from "./utils"




type HighlightedItemScope = {
    source: string
    query: string
    items: Blueprint<unknown>[] // ?
}

type HighlightedItemProps<T> = {
    text$: Injector<T>
    query$: Injector<T>
}



export const HighlightedItem = <T, E>(props: HighlightedItemProps<T&HighlightedItemScope>) : Infer.Blueprint<T, E> => {
    return mix<HighlightedItemScope>({
        templates: {
            highlighted: {
                weight: -10,
                css: 'has-text-link-dark',
                reactions: {
                    items: v => ({items: v})
                },
                injections: {
                    items: $ => computable(() => {
                        return stringToParts($.source, $.query).map(HighlightedPart)
                    })
                }
            }
        }
    },
    props && {
        injections: {
            source: props.text$,
            query: props.query$,
        }
    })
}



type HighlightedPartProps = {
    highlight: boolean
    text: string
}

const HighlightedPart = (props: HighlightedPartProps) : Infer.Blueprint<unknown> => {
    return {
        tag: props.highlight ? 'mark' : 'span',
        text: props.text,
    }
}