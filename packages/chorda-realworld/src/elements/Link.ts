import { HtmlBlueprint, mix, Injector, patch, Blueprint, InferBlueprint } from "@chorda/core";


type LinkScope = {
    text: string
    href: string
}

export type LinkProps<T, E> = {
    href?: string
    text?: string
    css?: string
    content?: Blueprint<T, E>
    text$?: Injector<T>
    href$?: Injector<T>
    as?: Blueprint<T, E>
}

export const Link = <T, E>(props: LinkProps<T&LinkScope, E>) : InferBlueprint<T, E> => {
    return mix<LinkScope>({
        tag: 'a'
    }, 
    props?.as, 
    props && {
        text: props.text,
        css: props.css,
        dom: {
            href: props.href
        },
        templates: {
            content: props.content
        },
        injections: {
            text: props.text$,
            href: props.href$
        },
        reactions: {
            text: (v) => patch({text: v}),
            href: (v) => patch({dom: {href: v}})
        }
    })
}