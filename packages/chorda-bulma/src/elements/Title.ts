import { Blueprint, buildClassName, HtmlBlueprint, Injector, mix } from "@chorda/core"


type TitleScope = {
    text: string
}

type TitleProps<T> = {
    text?: string,
    text$?: Injector<T>,
    size?: string
    css?: string
    as?: Blueprint<T>
}

export const Title = <T>(props: TitleProps<T&TitleScope>) : HtmlBlueprint<T> => {
    return mix({
        css: 'title',
        reactions: {
            text: (v: any) => ({text: v})
        }
    },
    props?.as, 
    props && {
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
            text: (v: any) => ({text: v})
        }
    }, {
        injections: {
            text: props.text$// (ctx: any) => observable(props.text || ctx.text)
        },
        css: buildClassName(props.css, props.size),
        text: props.text
    })
}