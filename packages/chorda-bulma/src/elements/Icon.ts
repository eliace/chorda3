import { HtmlBlueprint, mix } from "@chorda/core"



interface IconProps<T> {
    icon?: string
    css?: string
    as?: HtmlBlueprint<T>
}


export const Icon = <T>(props: IconProps<T>) : HtmlBlueprint<T> => {
    return mix({
        css: 'icon',
    }, 
    props?.as,
    props && {
        css: props.css,
        classes: {
            [props.icon]: true
        }
    })
}
