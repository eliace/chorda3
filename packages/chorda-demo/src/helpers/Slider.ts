import { BasicDomEvents, Blueprint, InferBlueprint, Injector, Listener, mix, observable, passthruLayout } from "@chorda/core"
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
    return mix<SliderScope, BasicDomEvents>({
        layout: passthruLayout,
        templates: {
            input: {
                tag: 'input',
                css: 'slider',
                dom: {
                    type: 'range'
                },
                reactions: {
                    value: v => ({dom: {value: v}}),
                    min: v => ({dom: {min: v}}),
                    max: v => ({dom: {max: v}}),
                    name: v => ({dom: {id: v}}),
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
                    name: v => ({dom: {htmlFor: v}}),
                    value: v => ({text: String(v)})
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
        defaults: {
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