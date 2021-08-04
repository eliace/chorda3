import { Blueprint, HtmlBlueprint, InferBlueprint, iterable, mix, observable, patch } from "@chorda/core"


export type RowLayoutScope = {
    rows: Blueprint<any>[]
}


export const RowLayout = <T>(elements: Blueprint<T>[]) : InferBlueprint<T> => {
    return mix<RowLayoutScope>({
        css: 'rows',
        defaultItem: {
            css: 'row',
            reactions: {
                rows: (v) => patch({components: {content: v}})
            }
        },
        reactions: {
            rows: (v) => patch({items: v})
        }
    }, {
        injections: {
            rows: () => iterable(elements, 'rows')
        }
    })
}
