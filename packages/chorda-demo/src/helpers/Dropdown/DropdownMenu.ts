import { Blueprint, HtmlBlueprint, InferBlueprint, mix, NoInfer } from "@chorda/core"


export type DropdownMenuProps<T, E> = {
    content?: Blueprint<T, E>
    as?: Blueprint<T, E>
}

export const DropdownMenu = <T, E>(props: DropdownMenuProps<T, E>) : InferBlueprint<T, E> => {
    return mix({
        css: 'dropdown-menu',
        templates: {
            content: {
                css: 'dropdown-content'
            }
        }
    }, props?.as, props && {
        templates: {
            content: props.content
        },
    })
}
