import { HtmlBlueprint, Injector, Listener, mix, patch } from "@chorda/core"





type TextScope = {
    text: string|boolean
}

type TextProps<T> = {
    as?: HtmlBlueprint<T>
    text?: string
    css?: string
    text$?: Injector<T>
    onClick?: Listener<T, any>
}


export const Text = <S, T=unknown>(props: TextProps<T&TextScope&S>) : HtmlBlueprint<T> => {
    return mix<TextScope>(props.as || {tag: 'span'}, {
//        tag: 'span',
        reactors: {
            text: (v) => {
//                console.log('s', v)
                patch({text: String(v)})
            }
        },
    }, {
        css: props.css,
        injectors: {
            text: props.text$
        },
        events: {
            click: props.onClick
        }
    })
}
