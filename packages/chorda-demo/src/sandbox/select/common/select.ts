import { HtmlBlueprint, mix } from "@chorda/core"


export type SelectProps<T> = {
    options?: HtmlBlueprint<T>[]
    size?: number
    value?: string
    defaultOption?: HtmlBlueprint<T>
}

export const Select = <T>(props: SelectProps<T>) : HtmlBlueprint<T> => {
    return mix({
        tag: 'select',
        defaultItem: Option
    }, props && {
        items: props.options,
        defaultItem: props.defaultOption,
        dom: {
            size: props.size,
            defaultValue: props.value
        }
    })
}


export type OptionProps = {
    text?: string
    value?: string
    selected?: boolean
}

export const Option = <T>(props: OptionProps) : HtmlBlueprint<T> => {
    return mix({
        tag: 'option'
    }, props && {
        text: props.text,
        dom: {
            value: props.value,
            selected: props.selected
        }
    })
}