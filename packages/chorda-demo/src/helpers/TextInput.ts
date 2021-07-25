import { HtmlBlueprint, HtmlScope, Injector, Listener, mix, observable, patch } from "@chorda/core";
import { DomEvents } from "@chorda/react";


type TextInputScope = {
    value: string
}

type TextInputProps<T> = {
    value$?: Injector<T>
    onInput?: Listener<T, string>
    onFocus?: Listener<T, void>
    onEsc?: Listener<T, void>
}

export const TextInput = <T>(props: TextInputProps<T&TextInputScope>) : HtmlBlueprint<T> => {
    return mix<TextInputScope&HtmlScope, DomEvents>({
        tag: 'input',
        css: 'input',
    },
    props && {
        events: {
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
        },
        initials: {
            value: () => observable(''),
        },
        injectors: {
            value: props.value$
        },
        reactors: {
            value: (v) => patch({dom: {defaultValue: v || ''}})
        },
        joints: {
            domValue: ({value, $dom}) => {

                const changeValue = () => {
                    const el = $dom.$value
                    if (el) {
                        const htmlValue = (el as HTMLInputElement).value
                        if (htmlValue != value.$value) {
                            (el as HTMLInputElement).value = value
                        }
                    }
                }

                value.$subscribe(changeValue)
                $dom.$subscribe(changeValue)

            },
        }

    })
}