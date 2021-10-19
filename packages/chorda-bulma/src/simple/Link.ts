import { HtmlBlueprint, InferBlueprint, Injector, mix, patch } from "@chorda/core"




type LinkScope = {
    text: string
    link: string
}

type LinkProps<T> = {
    link?: string
    text?: string
    link$?: Injector<T>
    text$?: Injector<T>
}


export const Link = <T, E>(props: LinkProps<T&LinkScope>) : InferBlueprint<T, E> => {
    return mix<LinkScope>({
        tag: 'a',
        reactions: {
            text: (v) => patch({text: v}),
            link: (v) => patch({dom: {href: v}})
        }
    }, props && {
        dom: {
            href: props.link
        },
        text: props.text,
        injections: {
            text: props.text$,
            link: props.link$
        }

    })
}