import { Blueprint, InferBlueprint, Injector, mix } from "@chorda/core"



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

export type TextPropsType<T, E=unknown> = TextProps<T&TextScope, E>

export const Text = <T, E>(props: TextPropsType<T, E>) : InferBlueprint<T, E> => {
    return mix<TextScope>(
        props && props.as,
        props && {
            css: props.css,
            text: props.text,
            dom: {
                id: props.id
            },
            reactions: {
                text: (v) => ({text: v})
            },
            injections: {
                text: props.text$
            }
        }
    )
}
