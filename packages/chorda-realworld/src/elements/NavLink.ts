import { Blueprint, InferBlueprint, Injector, Listener, mix, observable } from "@chorda/core"
import { ReactDomEvents } from "@chorda/react"
import * as React from "react"

type NavLinkScope = {
    text: string
    href: string
    active: boolean
    name: string
    image: Blueprint<unknown>
    icon: string
}

type NavLinkProps<T, E> = {
    text?: string
    icon?: string
    href?: string
    name?: string
    image?: Blueprint<T, E>
    active$?: Injector<T>
    text$?: Injector<T>
    href$?: Injector<T>
    image$?: Injector<T>
    as?: Blueprint<T, E>
    onClick?: Listener<T, React.MouseEvent>
}


export const NavLink = <T, E>(props: NavLinkProps<T&NavLinkScope, E>) : InferBlueprint<T, E> => {
    return mix<NavLinkScope, ReactDomEvents>({
        templates: {
            content: {
                tag: 'a',
                css: 'nav-link',
                templates: {
                    icon: {
                        tag: 'i',
                        weight: -10,
                        reactions: {
                            icon: (v) => ({classes: {[v]: !!v}})
                        }
                    },
                    image: {
                        tag: 'img',
                        weight: -10,
                    }
                },
                reactions: {
                    active: (v) => ({classes: {'active': v == true}}),
                    text: (v) => ({text: v}),
                    href: (v) => ({dom: {href: v}}),
                    icon: (v) => ({components: {icon: !!v}}),
                    image: (v) => ({components: {image: v}}),
                },
                components: {
                    icon: false,
                    image: false,
                }
            }
        }
    },
    props?.as,
    props && {
        defaults: {
            text: () => observable(props.text),
            href: () => observable(props.href || '#'),
            name: () => props.name,
            icon: () => props.icon,
            image: () => props.image,
        },
        injections: {
            active: props.active$,
            text: props.text$,
            href: props.href$,
            image: props.image$
        },
        events: {
            $dom: {
                click: props.onClick
            }
        }
    })
}