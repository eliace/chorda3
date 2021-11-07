import { Blueprint, callable, HtmlBlueprint, InferBlueprint, Injector, Listener, mix, patch } from "@chorda/core"
import { ReactDomEvents } from "@chorda/react"
import * as React from "react"
import { flags } from "../utils"


type FormScope = {
    items: Blueprint<unknown>
}

type FormProps<T, E> = {
    items?: {[key: string]: Blueprint<T, E>}
    itemAs?: Blueprint<T, E>
    content?: Blueprint<T, E>
    onSubmit?: Listener<T, React.FormEvent>
    items$?: Injector<T>
}


export const Form = <T, E>(props: FormProps<T, E>) : InferBlueprint<T, E> => {
    return mix<FormScope, ReactDomEvents>({
        tag: 'form',
        reactions: {
            items: (v) => patch({components: v})
        }
    }, props && {
        templates: {
            content: props.content,
            ...props.items
        },
        defaultComponent: props.itemAs,
        events: {
            $dom: {
                submit: props.onSubmit
            }
        },
        injections: {
            items: props.items$
        }
    })
}


type FormGroupProps<T, E> = {
    control?: Blueprint<T, E>
    as?: Blueprint<T, E>
    addons?: {[key: string]: Blueprint<T, E>}
}

export const FormGroup = <T, E>(props: FormGroupProps<T, E>) : InferBlueprint<T, E> => {
    return mix(props && props.as, {
        css: 'form-group',
        templates: {
            control: {
                css: 'form-control'
            }
        }
    }, props && {
        templates: {
            control: props.control,
            ...props.addons,
        },
        components: flags({
            control: props.control,
            ...props.addons
        }),
    })
}
    



type FormControlProps<T, E> = {
    as?: Blueprint<T, E>
}

export const FormControl = <T, E>(props: FormControlProps<T, E>) : InferBlueprint<T, E> => {
    return mix(props && props.as, {
        css: 'form-control'
    })
}