import { InferBlueprint, mix } from "@chorda/core"



type ProgressProps = {
    value?: number
    max?: number
    css?: string
}


export const Progress = <T, E>(props: ProgressProps) : InferBlueprint<T, E> => {
    return mix({
        tag: 'progress',
        css: 'progress'
    }, {
        css: props.css,
        dom: {
            value: props.value,
            max: props.max
        }
    })
}