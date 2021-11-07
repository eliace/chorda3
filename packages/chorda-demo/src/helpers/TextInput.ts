import { BasicDomEvents, Blueprint, callable, HtmlBlueprint, HtmlScope, Infer, Injector, Listener, mix, observable } from "@chorda/core";
import { watch } from "../utils";


export type TextInputScope = {
    value: string
}

type TextInputActions = {
    onInput: (e: InputEvent) => InputEvent,
    onFocus: () => void,
    onBlur: () => void,
    onEsc: () => void,
}

type TextInputProps<T, E> = {
    type?: string
    value?: string
    value$?: Injector<T>
    onInput?: Listener<T, InputEvent>
    onFocus?: Listener<T, void>
    onBlur?: Listener<T, void>
    onEsc?: Listener<T, void>
    placeholder?: string
    as?: Blueprint<T, E>
//    autoFocus?: boolean
}

export const TextInput = <T, E>(props: TextInputProps<T&TextInputScope, E>) : Infer.Blueprint<T, E> => {
    return mix<TextInputScope&HtmlScope&TextInputActions, BasicDomEvents&TextInputActions>({
        tag: 'input',
        css: 'input',
    },
    props?.as,
    props && {
        events: {
            $dom: {
                input: (e, scope) => {
                    scope.value.$value = (e.target as any).value
                    scope.onInput(e)
                },
                focus: (e, scope) => {
                    scope.onFocus()
                },
                blur: (e, scope) => {
                    scope.onBlur()
                },
                keydown: (e, scope) => {
                    if (e.code == 'Escape') {
                        scope.onEsc()
                    }
                }    
            },
            onInput: props.onInput,
            onFocus: props.onFocus,
            onBlur: props.onBlur,
            onEsc: props.onEsc,
        },
        initials: {
            value: () => observable(props.value || ''),
            onInput: () => callable(null),
            onFocus: () => callable(null),
            onBlur: () => callable(null),
            onEsc: () => callable(null),
        },
        injections: {
            value: props.value$
        },
        reactions: {
            value: (v) => ({dom: {defaultValue: v || ''}})
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
            // autoFocus: props.autoFocus && (({$dom}) => {
            //     watch(() => {
            //         if ($dom.$value) {
            //             $dom.$value.focus()
            //         }
            //     }, [$dom])
            // })
        },
        dom: {
            placeholder: props.placeholder,
            type: props.type,
        }
    })
}