import { Blueprint, HtmlBlueprint, InferBlueprint, Injector, iterable, mix, patch, Scope } from "@chorda/core";


export type ListScope<I> = {
    items: I[]
}

export type ItemScope<I> = {
    item: I
}

export type ListProps<I, T, E> = {
    items?: Blueprint<T&I, E>[]
    items$?: Injector<T>
    itemAs?: Blueprint<T&I, E>
    as?: Blueprint<T, E>
    project?: boolean
}

export type ListPropsType<I, T, E> = ListProps<ItemScope<I>, T&ListScope<I>, E>


export const List = <T extends Scope, E>(props: ListPropsType<unknown, T, E>) : InferBlueprint<T, E> => {
    return mix<ListScope<unknown>&ItemScope<unknown>&{__it: unknown[]}>({
        // tag: 'ul',
        // defaultItem: {
        //     tag: 'li',
        // },
        reactions: {
            __it: (v) => patch({items: v})
        }
    }, 
    props?.as,
    props && {
        defaultItem: props.itemAs,
        items: props.items,
        injections: {
            __it: ($) => iterable($.items, props.project ? null : 'item'),
            items: props.items$,
        }
    })
}


type ItemProps = {
    text?: string
}

export const Item = <T, E>(props: ItemProps) : InferBlueprint<T, E> => {
    return {
        text: props.text
    }
}