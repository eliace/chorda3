import { HtmlBlueprint, mix } from "@chorda/core"




export const Paragraph = <T>(props: HtmlBlueprint<T>) : HtmlBlueprint<T> => {
    return mix({
        tag: 'p'
    }, props)
}