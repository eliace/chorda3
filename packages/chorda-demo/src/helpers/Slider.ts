import { Blueprint, InferBlueprint, Injector, Listener, mix, observable, passthruLayout, patch } from "@chorda/core"
import { ReactDomEvents } from "@chorda/react"

import "bulma-slider/dist/css/bulma-slider.min.css"

type SliderScope = {
    value: number
    min: number
    max: number
    name: string
}

type SliderProps<T, E> = {
    value?: number
    min?: number
    max?: number
    value$?: Injector<T>
    as?: Blueprint<T, E>
    max$?: Injector<T>
    min$?: Injector<T>
    output?: Blueprint<T, E>
    name?: string
//    onChange?: Listener<T, number>
}

export const Slider = <T, E>(props: SliderProps<T&SliderScope, E>) : InferBlueprint<T, E> => {
    return mix<SliderScope, ReactDomEvents>({
        layout: passthruLayout,
        templates: {
            input: {
                tag: 'input',
                css: 'slider',
                dom: {
                    type: 'range'
                },
                reactions: {
                    value: v => patch({dom: {value: v}}),
                    min: v => patch({dom: {min: v}}),
                    max: v => patch({dom: {max: v}}),
                    name: v => patch({dom: {id: v}}),
                },
                events: {
                    $dom: {
                        change: (e, {value}) => {
                            value.$value = (e.currentTarget as HTMLInputElement).valueAsNumber
                        }
                    }
                },        
            },
            output: {
                tag: 'output',
                reactions: {
                    name: v => patch({dom: {htmlFor: v}}),
                    value: v => patch({text: v})
                }
            }
        }
    },
    props?.as,
    props && {
        templates: {
            input: {
                classes: {
                    'has-output': true
                }
            }
        },
        initials: {
            value: () => observable(props.value),
            min: () => observable(props.min),
            max: () => observable(props.max),
            name: () => props.name
        },
        injections: {
            value: props.value$,
            max: props.max$,
            min: props.min$,
        }
    })
}