import { Blueprint, InferBlueprint, Injector, mix, patch } from "@chorda/core"




export const Columns = <T, E>(columns: Blueprint<T, E>[]) : InferBlueprint<T, E> => {
    return mix({
        css: 'row',
    }, {
//        css: props.css,
        items: columns// props.columns
    })
}



type ColumnProps<T, E> = {
    content?: Blueprint<T, E>
    css?: string
    as?: Blueprint<T, E>
    items?: Blueprint<T, E>[]
}

export const Column = <T, E>(props: ColumnProps<T, E>) : InferBlueprint<T, E> => {
    return mix({
        css: props.css,
        templates: {
            content: props.content
        },
        items: props.items
    }, props?.as)
}

/*
type ColumnScope = {
    addons: {[key: string]: Blueprint<unknown>}
    items: unknown[]
    item: unknown
    _it: unknown
}

type ColumnProps<T> = {
    css?: string
    content?: Blueprint<T>
    items?: Blueprint<T>[]
    item?: Blueprint<T>
//    bindings?: Bindings<T>
    addons?: {[key: string]: Blueprint<T>}
    addons$?: Injector<T>
    items$?: Injector<T>
}


export const Column = <T>(props: ColumnProps<T&ColumnScope>) : InferBlueprint<T> => {
    return mix<ColumnScope>({
        css: props.css,
        templates: {
            content: props.content,
            ...props.addons
        },
        items: props.items,
        defaultItem: props.item,
        reactions: {
            addons: (v) => patch({components: v}),
            items: (v) => patch({items: iterator(v, 'item')}),
//            ...props.bindings
        },
        injections: {
            addons: props.addons$,
            items: props.items$
        },
        components: {
            content: props.content,
            ...props.addons
        }
    })
}
*/
