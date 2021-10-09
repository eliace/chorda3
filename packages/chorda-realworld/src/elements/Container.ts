import { Blueprint, InferBlueprint, Injector, mix, patch } from "@chorda/core"

type ContainerScope = {
    components: {[key: string]: Blueprint<unknown>}
}

type ContainerProps<T, E> = {
    css?: string
    content?: Blueprint<T, E>
    items?: Blueprint<T, E>[]
    addons?: {[key: string]: Blueprint<T, E>}
    addons$?: Injector<T>
} 

export const Container = <T, E>(props: ContainerProps<T&ContainerScope, E>) : InferBlueprint<T, E> => {
    return mix<ContainerScope>({
        css: 'container',
        reactions: {
            components: (v) => patch({components: v})
        }
    }, {
        css: props.css,
        templates: {
            content: props.content,
            ...props.addons
        },
        items: props.items,
        injections: {
            components: props.addons$
        },
    })
}
