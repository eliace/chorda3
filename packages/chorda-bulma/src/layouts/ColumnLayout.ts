import { HtmlBlueprint, iterable, mix, observable, patch } from "@chorda/core"


export type ColumnLayoutScope = {
    columns: HtmlBlueprint[]
    __it: HtmlBlueprint
}

export const ColumnLayout = <T>(elements: HtmlBlueprint<T>[]) : HtmlBlueprint<T> => {
    return mix<ColumnLayoutScope>({
        css: 'columns',
        defaultItem: {
            css: 'column',
            reactions: {
                columns: (v) => patch({components: {content: v}})
            }
        },
        reactions: {
            columns: (v) => patch({items: v})
        }
    }, {
        injections: {
            columns: () => iterable(elements, 'columns')
        }        
    })
}