import { Blueprint, HtmlBlueprint, InferBlueprint, Injector, iterable, Listener, mix, observable } from "@chorda/core"
import { ReactDomEvents } from "@chorda/react"
import { IteratorScope } from "../utils"
import { ItemScope, ListScope } from "./List"

export type BlockScope = {
    addons: {[key: string]: Blueprint<unknown>}
//    items: I[]
//    item: I
}

type BlockProps<I, T> = {
    as?: Blueprint<T>
    css?: string
    //asMap?: {[key: string]: HtmlBlueprint<T>}
    content?: Blueprint<T>
    addons?: {[key: string]: Blueprint<T>}
    items?: Blueprint<T>[]
    itemAs?: Blueprint<T&I>
    items$?: Injector<T>
    onClick?: Listener<T, unknown>
    addons$?: Injector<T>
    project?: boolean
}

type BlockPropsType<I, T> = BlockProps<ItemScope<I>, T&ListScope<I>&BlockScope>

export const Block = <T>(props: BlockPropsType<unknown, T>) : InferBlueprint<T> => {
    return mix<BlockScope&ListScope<unknown>&IteratorScope, ReactDomEvents>({
        reactions: {
            items: (v) => ({items: v}),
            addons: (v) => ({components: v})
        }
    }, 
        props && props.as,
        props && {
            css: props.css,
            //components: props.asMap,
            templates: {
                ...props.addons,
                content: props.content,
            },
            items: props.items,
            defaultItem: props.itemAs,
            initials: {
                addons: () => observable(null),
            },
            injections: {
                items: props.items$,
                addons: props.addons$,
                __it: $ => iterable($.items, props.project ? null : 'item')
            },
            events: {
                $dom: {
                    click: props.onClick
                }
            }
    })
}


