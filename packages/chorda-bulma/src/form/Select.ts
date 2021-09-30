import { Blueprint, InferBlueprint, mix } from "@chorda/core"


interface SelectProps<T> {
    options: Blueprint<T>[],
    fullwidth?: boolean
}

interface SelectOptionProps {
    text?: string
}

export const Select = <T>(props: SelectProps<T>) : InferBlueprint<T> => {
    return mix({
        tag: 'span',
        css: 'select',
        templates: {
            content: {
                tag: 'select',
                defaultItem: {
                    tag: 'option'
                },
            }
        }
    },
    props && {
        classes: {
            'is-fullwidth': props.fullwidth
        },
        templates: {
            content: {
                items: props.options
            }
        }
    })
}

export const Option = <T>(props: SelectOptionProps) : InferBlueprint<T> => {
    return {
        tag: 'option',
        text: props.text
    }
}
