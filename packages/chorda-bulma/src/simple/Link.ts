import { InferBlueprint, Injector, mix } from "@chorda/core"




type LinkScope = {
    text: string
    link: string
}

type LinkProps<T> = {
    link?: string
    text?: string
    link$?: Injector<T>
    text$?: Injector<T>
    target?: string
}


export const Link = <T, E>(props: LinkProps<T&LinkScope>) : InferBlueprint<T, E> => {
    return mix<LinkScope>({
        tag: 'a',
        reactions: {
            text: (v) => ({text: v}),
            link: (v) => ({dom: {href: v}})
        }
    }, props && {
        dom: {
            href: props.link,
            target: props.target,
        },
        text: props.text,
        injections: {
            text: props.text$,
            link: props.link$
        }

    })
}