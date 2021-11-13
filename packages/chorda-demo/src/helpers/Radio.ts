import { Blueprint, callable, HtmlScope, InferBlueprint, Injector, Listener, mix, observable, passthruLayout } from "@chorda/core"
import { ReactDomEvents } from "@chorda/react"

import "bulma-checkradio/dist/css/bulma-checkradio.min.css"
import { watch } from "../utils"

type RadioScope = {
    value: boolean
    name: string
}

type RadioProps<T, E> = {
    name?: string
    label?: string
    value?: boolean
    as?: Blueprint<T, E>
    value$?: Injector<T>
    onChange?: Listener<T, boolean>
}

export const Radio = <T, E>(props: RadioProps<T&RadioScope, E>) : InferBlueprint<T, E> => {
    return mix<RadioScope, ReactDomEvents>({
        layout: passthruLayout,
        templates: {
            input: <Blueprint<RadioScope&HtmlScope>>{
                tag: 'input',
                css: 'is-checkradio',
                dom: {
                    type: 'radio'
                },
                reactions: {
//                     value: v => ({dom: {
//                         value: v && 'checked', 
// //                        defaultChecked: v && 'checked'
//                     }}),
                    name: v => ({dom: {id: v}}),
                },
                joints: {
                    setValue: ({value, $dom}) => {
                        
                        watch(() => {
                            if ($dom.$value) {
                                ($dom.$value as HTMLInputElement).checked = value.$value
                            }
                        }, [value, $dom])

                    }
                }
            },
            label: {
                tag: 'label',
                reactions: {
                    name: v => ({dom: {htmlFor: v}})
                }
            }
        }
    },
    props?.as,
    props && {
        templates: {
            label: {
                text: props.label
            },
            input: {
                events: {
                    $dom: {
                        change: props.onChange && ((e, scope) => {
                            props.onChange(true, scope as any)
                        })
                    }
                }
            }
        },
        defaults: {
            value: () => observable(props.value),
            name: () => props.name,
        },
        injections: {
            value: props.value$
        }
    })
}