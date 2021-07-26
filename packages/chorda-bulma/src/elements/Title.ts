import { buildClassName, HtmlBlueprint, Injector, mix, patch } from "@chorda/core"


type TitleScope = {
    text: string
}

type TitleProps<T> = {
    text?: string,
    text$?: Injector<T>,
    size?: string
    css?: string
}

export const Title = <T>(props: TitleProps<T&TitleScope>) : HtmlBlueprint<T> => {
    return mix({
        css: 'title',
        reactions: {
            text: (v: any) => patch({text: v})
        }
    }, {
        injections: {
            text: props.text$// || ((ctx: any) => observable(props.text || ctx.text))
        },
        css: buildClassName(props.css, props.size),
        text: props.text
    })
}



export const Subtitle = <T>(props: TitleProps<T&TitleScope>) : HtmlBlueprint => {
    return mix({
        css: 'subtitle',
        reactions: {
            text: (v: any) => patch({text: v})
        }
    }, {
        injections: {
            text: props.text$// (ctx: any) => observable(props.text || ctx.text)
        },
        css: buildClassName(props.css, props.size),
        text: props.text
    })
}