import { Blueprint, HtmlBlueprint, InferBlueprint, mix } from "@chorda/core"



export type DropdownTriggerProps<T, E> = {
    content?: Blueprint<T, E>
}

export const DropdownTrigger = <T, E>(props: DropdownTriggerProps<T, E>) : InferBlueprint<T, E> => {
    return mix({
        css: 'dropdown-trigger',
    }, {
        templates: {
            content: props.content
        },
    })
}
