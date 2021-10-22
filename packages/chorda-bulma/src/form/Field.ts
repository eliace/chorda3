import { Blueprint, HtmlBlueprint, Keyed, mix, passthruLayout } from "@chorda/core"


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
    as?: Blueprint<T>
    addonAs?: Blueprint<T>
    horizontal?: boolean
}




export const Field = <T>(props: FieldProps<T&FieldScope>): HtmlBlueprint<T> => {
    
    const isLabel = props.label != null
    const isHelp = !!props.help
    const isContent = !!props.control
    const isAddons = !!props.addons
    const isColor = !!props.color
    const isHorizontal = !!props.horizontal
    
    return mix({
        css: 'field',
        templates: {
            label: {
                css: 'label'
            },
            control: {
                css: 'control'
            },
            addons: {
                layout: passthruLayout
            }
        }
    }, 
    props?.as, 
    props && {
        classes: {
            'has-addons': isAddons,
            'horizontal': isHorizontal,
        },
        components: {
            label: isLabel,
            control: isContent,
            addons: {
                templates: props.addons,
                defaultComponent: props.addonAs,
            }
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