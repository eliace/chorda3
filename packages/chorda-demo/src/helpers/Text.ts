import { HtmlBlueprint, Injector, Listener, mix, patch } from "@chorda/core"
import { DomEvents } from "@chorda/react"





type TextScope = {
    text: string|boolean
}

type TextProps<T> = {
    as?: HtmlBlueprint<T>
    text?: string
    css?: string
    text$?: Injector<T>
    onClick?: Listener<T, React.MouseEvent>
}


export const Text = <T>(props: TextProps<T&TextScope>) : HtmlBlueprint<T> => {
    return mix<TextScope, DomEvents>(props.as || {tag: 'span'}, {
//        tag: 'span',
        reactions: {
            text: (v) => {
//                console.log('s', v)
                patch({text: String(v)})
            }
        },
    }, {
        css: props.css,
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
