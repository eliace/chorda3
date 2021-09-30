import { Blueprint, HtmlBlueprint, Keyed, mix } from "@chorda/core"


export type FieldScope = {

}

export enum Color {
    Success = 'is-success',
    Danger = 'is-danger',
}


export type FieldProps<T> = {
    label?: string
    control?: HtmlBlueprint<T>
    help?: string
    addons?: Keyed<Blueprint<T>>
    expanded?: boolean
    color?: Color
}




export const Field = <T>(props: FieldProps<T&FieldScope>): HtmlBlueprint<T> => {
    
    const isLabel = props.label != null
    const isHelp = !!props.help
    const isContent = !!props.control
    const isAddons = !!props.addons
    const isColor = !!props.color
    
    return mix({
        css: 'field',
        templates: {
            label: {
                css: 'label'
            },
            control: {
                css: 'control'
            }
        }
    }, props && {
        classes: {
            'has-addons': isAddons
        },
        components: {
            label: isLabel,
            control: isContent,
            ...props.addons,
        },
        templates: {
            label: {
                text: props.label
            },
            control: {
                classes: {
                    'is-expanded': props.expanded
                },
                templates: {
                    content: {
                        classes: {
                            [props.color]: isColor
                        }
                    },
                    help: {
                        css: 'help',
                        text: props.help,
                        classes: {
                            [props.color]: isColor
                        }
                    }
                },
                components: {
                    content: props.control,
                    help: isHelp
                }
            }
        }
    })
}