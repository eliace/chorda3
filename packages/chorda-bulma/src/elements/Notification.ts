import { Blueprint, InferBlueprint, mix } from "@chorda/core";
import { Delete } from "./Delete";





type NotificationProps<T, E> = {
    delete?: Blueprint<T, E>
    text?: string
    html?: string
    css?: string
}


export const Notification = <T, E>(props: NotificationProps<T, E>) : InferBlueprint<T, E> => {
    return mix({
        css: 'notification',
        templates: {
            delete: Delete
        }
    }, props && {
        css: props.css,
        text: props.text,
        components: {
            delete: props.delete == null ? true : props.delete
        }
    })
}