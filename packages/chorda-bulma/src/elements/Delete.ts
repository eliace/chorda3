import { InferBlueprint, Listener, mix } from "@chorda/core";
import { RendererEvents } from "../utils";



export type DeleteProps<T> = {
    onClick?: Listener<T, unknown>
    css?: string
}


export const Delete = <T, E>(props: DeleteProps<T>) : InferBlueprint<T, E> => {
    return mix<unknown, RendererEvents>({
        css: 'delete'
    }, props && {
        css: props.css,
        events: {
            $dom: {
                click: props.onClick
            }
        }
    })
}