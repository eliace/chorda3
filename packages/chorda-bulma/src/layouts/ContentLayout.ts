import { HtmlBlueprint, mix } from "@chorda/core";





export const ContentLayout = <T>(content: HtmlBlueprint<T>) : HtmlBlueprint<T> => {
    return mix({css: 'content'}, content)
}