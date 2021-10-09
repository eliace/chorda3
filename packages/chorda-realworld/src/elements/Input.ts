import { Injector, HtmlBlueprint, mix, patch, observable, HtmlScope, InferBlueprint } from "@chorda/core"
import { DomEvents } from "@chorda/react"
import { watch } from "../utils"


export type InputScope = {
    value: string
}

export type InputProps<T> = {
    css?: string
    type?: string
    placeholder?: string
    value$?: Injector<T>
    autoFocus?: boolean
}

export const Input = <T, E>(props: InputProps<T&InputScope>) : InferBlueprint<T, E> => {
    return mix<InputScope&HtmlScope, DomEvents>({
        tag: 'input',
        reactions: {
            value: (v) => patch({dom: {defaultValue: v}})
        },
    }, props && {
        css: props.css,
        dom: {
            type: props.type,
            placeholder: props.placeholder,
        },
        initials: {
            value: () => observable('')
        },
        injections: {
            value: props.value$
        },
        events: {
            $dom: {
                change: (evt, {value, $dom}) => {
                    value.$value = (evt.currentTarget as HTMLInputElement).value
                }    
            }
        },
        joints: {
            autoFocus: ({$dom, $renderer}) => {
                watch([$dom], () => {
                    if ($dom.$value && props.autoFocus) {
                        $renderer.publish($renderer.task(() => {
                            $dom.$value.focus()
                        }))
                    }
                })
            },
        }
    })
}
