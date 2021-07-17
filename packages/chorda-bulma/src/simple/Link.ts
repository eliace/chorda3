import { HtmlBlueprint, Injector, mix, patch } from "@chorda/core"




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


export const Link = <T>(props: LinkProps<T&LinkScope>) : HtmlBlueprint<T> => {
    return mix<LinkScope>({
        tag: 'a',
        reactors: {
            text: (v) => patch({text: v}),
            link: (v) => patch({dom: {href: v}})
        }
    }, props && {
        dom: {
            href: props.link
        },
        text: props.text,
        injectors: {
            text: props.text$,
            link: props.link$
        }

    })
}