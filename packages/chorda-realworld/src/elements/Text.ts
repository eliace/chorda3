import { Blueprint, InferBlueprint, Injector, mix, patch } from "@chorda/core"



type TextScope = {
    text: string
}

type TextProps<T, E> = {
    as?: Blueprint<T, E>
    css?: string
    text?: string
    text$?: Injector<T>
    id?: string
}

export type TextPropsType<T, E> = TextProps<T&TextScope, E>

export const Text = <T, E>(props: TextProps<T&TextScope, E>) : InferBlueprint<T, E> => {
    return mix<TextScope>(
        props && props.as,
        props && {
            css: props.css,
            text: props.text,
            dom: {
                id: props.id
            },
            reactions: {
                text: (v) => patch({text: v})
            },
            injections: {
                text: props.text$
            }
        }
    )
}
