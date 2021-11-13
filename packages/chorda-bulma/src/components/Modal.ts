import { Blueprint, InferBlueprint, Injector, mix, observable } from "@chorda/core"
import { Delete } from "../elements"
import { RendererEvents } from "../utils"




type ModalScope = {
    active: boolean
}

export type ModalProps<T, E> = {
    closeBtn?: Blueprint<T, E>,
    content?: Blueprint<T, E>,
    active?: boolean
    active$?: Injector<T, boolean>
}


export const Modal = <T, E>(props: ModalProps<T&ModalScope, E>) : InferBlueprint<T, E> => {
    return mix<ModalScope, RendererEvents>({
        css: 'modal',
        templates: {
            background: {
                weight: -10,
                css: 'modal-background',
                events: {
                    $dom: {
                        click: (evt, {active}) => {
                            active.$value = false
                        },    
                    }
                }        
            },
            content: {
                css: 'modal-content',
            },
            closeBtn: {
                weight: 10,
                css: 'modal-close'
            }
        },
        components: {
            closeBtn: Delete({
                css: 'is-large',
                onClick: (evt, {active}) => {
                    active.$value = false

                }
            })
        },
        reactions: {
            active: (v) => ({classes: {'is-active': v}})
        },
    }, props && {
        components: {
            background: true,
            closeBtn: props.closeBtn,
            content: {
                components: {
                    content: props.content
                }
            }
        },
        defaults: {
            active: () => observable(props.active)
        },
        injections: {
            active: props.active$
        }
    })
}
