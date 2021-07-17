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
            reactors: {
                columns: (v) => patch({components: {content: v}})
            }
        },
        reactors: {
            columns: (v) => patch({items: v})
        }
    }, {
        injectors: {
            columns: () => iterable(elements, 'columns')
        }        
    })
}