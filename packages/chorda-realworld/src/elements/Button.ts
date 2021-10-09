import { HtmlBlueprint, mix, Injector, patch, Listener, Blueprint, InferBlueprint, observable } from "@chorda/core"
import { DomEvents } from "@chorda/react"
import { flags } from "../utils"


type ButtonScope = {
    text: string
    addons: HtmlBlueprint[]
}

type ButtonProps<T, E> = {
    as?: Blueprint<T, E>
    css?: string
    text?: string
    text$?: Injector<T>
    onClick?: Listener<T, unknown>
    icon?: Blueprint<T, E>
    order?: number
    addons?: {[key: string]: Blueprint<T, E>}
    addons$?: Injector<T>
}

export const Button = <T, E>(props: ButtonProps<T&ButtonScope, E>) : InferBlueprint<T, E> => {
    return mix<ButtonScope, DomEvents>({
        tag: 'button',
        css: 'btn',
        reactions: {
            text: (v) => patch({text: v}),
            addons: (v) => patch({components: v}),
        },
        templates: {
            icon: {
                tag: 'i',
                weight: -10
            }
        }
    }, 
    props && props.as, 
    props && {
        css: props.css,
        text: props.text,
        weight: props.order,
        initials: {
            addons: () => observable(null),
        },
        injections: {
            text: props.text$,
            addons: props.addons$
        },
        components: {
            icon: props.icon,
            ...flags(props.addons)
        },
        templates: {
            ...props.addons
        },
        events: {
            $dom: {
                click: props.onClick
            }
        }
    })
}
