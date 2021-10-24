import { HtmlBlueprint, HtmlScope, Injector, Listener, mix, observable, patch } from "@chorda/core";
import { ReactDomEvents } from "@chorda/react";
import { watch } from "../utils";


type TextInputScope = {
    value: string
}

type TextInputProps<T> = {
    type?: string
    value?: string
    value$?: Injector<T>
    onInput?: Listener<T, string>
    onFocus?: Listener<T, void>
    onEsc?: Listener<T, void>
    placeholder?: string
}

export const TextInput = <T>(props: TextInputProps<T&TextInputScope>) : HtmlBlueprint<T> => {
    return mix<TextInputScope&HtmlScope, ReactDomEvents>({
        tag: 'input',
        css: 'input',
    },
    props && {
        events: {
            $dom: {
                input: (e, scope) => {
                    scope.value.$value = (e.target as any).value
                    props.onInput?.(scope.value, scope as any)
                },
                focus: (e, scope) => {
                    props.onFocus?.(null, scope as any)
                },
                keyDown: (e, scope) => {
                    if (e.code == 'Escape') {
                        props.onEsc?.(null, scope as any)
                    }
                }    
            }
        },
        initials: {
            value: () => observable(props.value || ''),
        },
        injections: {
            value: props.value$
        },
        reactions: {
            value: (v) => patch({dom: {defaultValue: v || ''}})
        },
        joints: {
            domValue: ({value, $dom}) => {

                watch(() => {
                    const el = $dom.$value as HTMLInputElement
                    if (el) {
                        if (el.value != value.$value) {
                            el.value = value
                        }
                    }
                }, [$dom, value])

                // const changeValue = () => {
                //     const el = $dom.$value
                //     if (el) {
                //         const htmlValue = (el as HTMLInputElement).value
                //         if (htmlValue != value.$value) {
                //             (el as HTMLInputElement).value = value
                //         }
                //     }
                // }

                // value.$subscribe(changeValue)
                // $dom.$subscribe(changeValue)

            },
        },
        dom: {
            placeholder: props.placeholder,
            type: props.type,
        }
    })
}