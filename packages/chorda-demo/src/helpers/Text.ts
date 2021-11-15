import { Blueprint, HtmlBlueprint, InferBlueprint, Injector, Listener, mix } from "@chorda/core"
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
    format?: (v: any) => string
}


export const Text = <T>(props: TextProps<T&TextScope>) : InferBlueprint<T> => {
    return mix<TextScope, ReactDomEvents>(props?.as || {tag: 'span'}, {
//        tag: 'span',
    }, props && {
        css: props.css,
        defaults: {
            text: () => props.text
        },
        injections: {
            text: props.text$
        },
        events: {
            $dom: {
                click: props.onClick
            }
        },
        reactions: {
            text: (v) => {
                return ({text: (props.format || String)(v)})
            }
        },
    })
}
