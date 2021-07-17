import { HtmlBlueprint, Injector, mix, patch } from "@chorda/core";


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
        reactors: {
            items: (v) => patch({items: v})
        },
    }, props && {
        items: props.items,
        defaultItem: props.defaultItem,
        injectors: {
            items: props.items$
        }
    })
}



export type ListItemScope = {
    text: string
}

type ListItemProps<T> = {
    css?: string
    text: string
    text$?: Injector<T>
}

export const ListItem = <T>(props: ListItemProps<T&ListItemScope>) : HtmlBlueprint<T> => {
    return mix<ListItemScope>({
        reactors: {
            text: (v) => patch({text: v})
        }
    }, props && {
        css: props.css,
        text: props.text,
        injectors: {
            text: props.text$
        }
    })
}
