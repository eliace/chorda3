import { Blueprint, InferBlueprint } from "@chorda/core"



type AddonProps<T> = {
    weight?: number
    content?: Blueprint<T>
}


export const Addon = <T>(props: AddonProps<T>): InferBlueprint<T> => {
    return {
        css: 'control',
        weight: props.weight,
        templates: {
            content: props.content
        }
    }
}