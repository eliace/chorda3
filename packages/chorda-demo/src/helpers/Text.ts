import { Blueprint, HtmlBlueprint, InferBlueprint, Injector, Listener, mix, patch } from "@chorda/core"
import { ReactDomEvents } from "@chorda/react"





type TextScope = {
    text: string|boolean
}

type TextProps<T> = {
    as?: Blueprint<T>
    text?: string
    css?: string
    text$?: Injector<T>
    onClick?: Listener<T, React.MouseEvent>
}


export const Text = <T>(props: TextProps<T&TextScope>) : InferBlueprint<T> => {
    return mix<TextScope, ReactDomEvents>(props.as || {tag: 'span'}, {
//        tag: 'span',
        reactions: {
            text: (v) => {
//                console.log('s', v)
                patch({text: String(v)})
            }
        },
    }, {
        css: props.css,
        initials: {
            text: () => props.text
        },
        injections: {
            text: props.text$
        },
        events: {
            $dom: {
                click: props.onClick
            }
        }
    })
}
