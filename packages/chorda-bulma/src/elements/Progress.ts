import { InferBlueprint, mix } from "@chorda/core"



type ProgressProps = {
    value?: number
    max?: number
}


export const Progress = <T, E>(props: ProgressProps) : InferBlueprint<T, E> => {
    return mix({
        tag: 'progress',
        css: 'progress'
    }, {
        dom: {
            value: props.value,
            max: props.max
        }
    })
}