import { Blueprint, HtmlBlueprint, Infer, InferBlueprint, iterable, mix, observable, patch } from "@chorda/core"


export type ColumnLayoutScope = {
    columns: (Blueprint<unknown>|ColumnProps<unknown>)[]
    column: (Blueprint<unknown>|ColumnProps<unknown>)
//    __it: HtmlBlueprint
}

interface ColumnProps<T> {
    css?: string
    content: Blueprint<T>
}

const isColumn = (v: any) : v is ColumnProps<unknown> => {
    return (v as ColumnProps<unknown>).content != null
}

export const ColumnLayout = <T>(elements: (Blueprint<T>|ColumnProps<T>)[]) : InferBlueprint<T> => {
    return mix<ColumnLayoutScope>({
        css: 'columns',
        defaultItem: {
            css: 'column',
            reactions: {
                column: (v) => isColumn(v) ? {components: {content: v.content}, css: v.css} : {components: {content: v}}
            }
        },
        reactions: {
            columns: (v) => patch({items: v})
        }
    }, {
        injections: {
            columns: () => iterable(elements, 'column')
        }        
    })
}


export const Column = <T>(props: ColumnProps<T>) : ColumnProps<T> => {
    return props
}