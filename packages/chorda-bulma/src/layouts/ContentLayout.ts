import { HtmlBlueprint, mix } from "@chorda/core";


export const ContentLayout = <T>(elements: HtmlBlueprint<T>[]) : HtmlBlueprint<T> => {
    return mix({css: 'content'}, {items: elements})
}