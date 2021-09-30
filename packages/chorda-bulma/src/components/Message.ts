import { Blueprint, InferBlueprint, Listener, mix } from "@chorda/core"
import { Delete } from "../elements"



interface MessageProps<T> {
    title?: string
    close?: boolean
    onClose?: Listener<T, unknown>
    content?: Blueprint<T>,
    html?: string
    header?: Blueprint<T>
}


export const Message = <T, E>(props: MessageProps<T>) : InferBlueprint<T, E> => {
    return mix({
        tag: 'article',
        css: 'message',
        templates: {
            header: {
                weight: -10,
                css: 'message-header',
                templates: {
                    title: {
                        tag: 'p'
                    },
                    close: Delete
                }
            },
            body: {
                css: 'message-body'
            }
        }
    }, props && {
        components: {
            body: {
                components: {
                    content: props.content
                },
                html: props.html
            },
            header: props.header == null ? true : props.header
        },
        templates: {
            header: {
                components: {
                    title: {
                        text: props.title
                    },
                    close: {
                        events: {
                            click: props.onClose
                        }
                    }
                }
            }
        }
    })
}
