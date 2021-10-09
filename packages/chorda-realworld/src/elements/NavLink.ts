import { Blueprint, InferBlueprint, Injector, Listener, mix, observable, patch, Scope } from "@chorda/core"
import { DomEvents } from "@chorda/react"
import * as React from "react"

type NavLinkScope = {
    text: string
    href: string
    active: boolean
    name: string
    image: string
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
    return mix<NavLinkScope, DomEvents>({
        templates: {
            content: {
                tag: 'a',
                css: 'nav-link',
                templates: {
                    icon: {
                        tag: 'i',
                        weight: -10,
                        reactions: {
                            icon: (v) => patch({classes: {[v]: !!v}})
                        }
                    },
                    image: {
                        tag: 'img',
                        weight: -10,
                    }
                },
                reactions: {
                    active: (v) => patch({classes: {'active': v == true}}),
                    text: (v) => patch({text: v}),
                    href: (v) => patch({dom: {href: v}}),
                    icon: (v) => patch({components: {icon: !!v}})
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
        initials: {
            text: () => observable(props.text),
            href: () => observable(props.href || '#'),
            name: () => props.name,
            icon: () => props.icon,
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