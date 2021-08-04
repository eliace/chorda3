import { Blueprint, HtmlBlueprint, InferBlueprint, mix } from "@chorda/core"


export interface SelectProps<T> {
    options?: Blueprint<T>[]
    size?: number
    value?: string
    defaultOption?: Blueprint<T>
    as?: Blueprint<T>
}

export const Select = <T>(props: SelectProps<T>) : InferBlueprint<T> => {
    return mix({
        tag: 'select',
        defaultItem: Option
    }, 
    props?.as, 
    props && {
        items: props.options,
        defaultItem: props.defaultOption,
        dom: {
            size: props.size,
            defaultValue: props.value
        }
    })
}


export type OptionProps<T> = {
    text?: string
    value?: string
    selected?: boolean
    as?: Blueprint<T>
}

export const Option = <T>(props: OptionProps<T>) : InferBlueprint<T> => {
    return mix({
        tag: 'option'
    },
    props?.as, 
    props && {
        text: props.text,
        dom: {
            value: props.value,
            selected: props.selected
        }
    })
}