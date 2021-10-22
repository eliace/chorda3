import { Blueprint, InferBlueprint, mix } from "@chorda/core"

type AddonScope = {
    name: string
}

type AddonProps<T> = {
    weight?: number
    content?: Blueprint<T>
    name?: string
}


export const Addon = <T>(props: AddonProps<T&AddonScope>): InferBlueprint<T> => {
    return mix<AddonScope>({
        css: 'control',
        weight: props.weight,
        templates: {
            content: props.content
        },
        initials: {
            name: () => props.name
        }
    })
}