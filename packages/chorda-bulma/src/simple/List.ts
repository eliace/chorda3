import { Blueprint, HtmlBlueprint, HtmlScope, InferBlueprint, Injector, mix, observable, patch } from "@chorda/core";


export type ListScope = {
    items: any[]
}

type ListProps<T> = {
    items?: HtmlBlueprint<T>[]
//    type?: string
    defaultItem?: HtmlBlueprint<T>
    items$?: Injector<T>
}


export const List = <T>(props: ListProps<T&ListScope>) : HtmlBlueprint<T> => {
    return mix<ListScope>({
        tag: 'ul',
        defaultItem: {
            tag: 'li'
        },
        reactions: {
            items: (v) => patch({items: v})
        },
    }, 
    props && {
        items: props.items,
        defaultItem: props.defaultItem,
        injections: {
            items: props.items$
        },
    })
}



export type ListItemScope = {
    text: string
}

type ListItemProps<T> = {
    css?: string
    text?: string
    text$?: Injector<T>
    as?: Blueprint<T>
}

export const ListItem = <T>(props: ListItemProps<T&ListItemScope>) : InferBlueprint<T> => {
    return mix<ListItemScope>({
        reactions: {
            text: (v) => patch({text: v})
        }
    }, props.as, props && {
        css: props.css,
        text: props.text,
        injections: {
            text: props.text$
        }
    })
}
