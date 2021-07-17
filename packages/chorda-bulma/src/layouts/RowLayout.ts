import { HtmlBlueprint, iterable, mix, observable, patch } from "@chorda/core"


export type RowLayoutScope = {
    rows: HtmlBlueprint[]
}


export const RowLayout = <T>(elements: HtmlBlueprint<T>[]) : HtmlBlueprint<T> => {
    return mix<RowLayoutScope>({
        css: 'rows',
        defaultItem: {
            css: 'row',
            reactors: {
                rows: (v) => patch({components: {content: v}})
            }
        },
        reactors: {
            rows: (v) => patch({items: v})
        }
    }, {
        injectors: {
            rows: () => iterable(elements, 'rows')
        }
    })
}
