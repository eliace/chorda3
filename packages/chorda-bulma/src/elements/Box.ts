import { HtmlBlueprint, mix } from "@chorda/core"



type BoxProps<T> = {
    content?: HtmlBlueprint<T>
    css?: string
    styles?: {[key: string]: string|number}
    text?: string
    html?: string
    items?: HtmlBlueprint<T>[]
}

export const Box = <T>(props: BoxProps<T>) : HtmlBlueprint<T> => {
    return mix({
        css: 'box',
    }, props && {
        css: props.css,
        styles: props.styles,
        templates: {
            content: props.content
        },
        text: props.text,
        html: props.html,
        items: props.items
    })
}