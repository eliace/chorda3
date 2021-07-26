import { HtmlBlueprint, iterable, mix, observable, patch } from "@chorda/core"


export type RowLayoutScope = {
    rows: HtmlBlueprint[]
}


export const RowLayout = <T>(elements: HtmlBlueprint<T>[]) : HtmlBlueprint<T> => {
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
