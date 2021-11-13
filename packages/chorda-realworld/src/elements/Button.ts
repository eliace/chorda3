import { HtmlBlueprint, mix, Injector, Listener, Blueprint, InferBlueprint, observable } from "@chorda/core"
import { ReactDomEvents } from "@chorda/react"
import { flags } from "../utils"


type ButtonScope = {
    text: string
    addons: {[key: string]: HtmlBlueprint}
    disabled: boolean
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
    disabled$?: Injector<T>
}

export const Button = <T, E>(props: ButtonProps<T&ButtonScope, E>) : InferBlueprint<T, E> => {
    return mix<ButtonScope, ReactDomEvents>({
        tag: 'button',
        css: 'btn',
        reactions: {
            text: (v) => ({text: v}),
            addons: (v) => ({components: v}),
            disabled: (v) => ({dom: {disabled: v}})
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
            disabled: () => observable(null),
        },
        injections: {
            text: props.text$,
            addons: props.addons$,
            disabled: props.disabled$,
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
