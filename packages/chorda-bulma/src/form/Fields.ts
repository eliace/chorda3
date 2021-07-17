import { HtmlBlueprint, mix } from "@chorda/core"



type FieldsProps<T> = {
    fields?: HtmlBlueprint<T>[]
    labelSize?: string
    label?: string
}

export const Fields = <T>(props: FieldsProps<T>) : HtmlBlueprint<T> => {
    return mix({
        css: 'field is-horizontal',
        templates: {
            label: {
                weight: -10,
                css: 'field-label',
                templates: {
                    label: {
                        tag: 'label',
                        css: 'label',
                    }
                }
            },
            body: {
                css: 'field-body',
            }
        }
    }, props && {
        components: {
            body: true,
            label: props.label != null
        },
        templates: {
            label: {
                classes: {
                    [props.labelSize]: true,
                    'is-normal': true
                },
                templates: {
                    label: {
                        text: props.label
                    }
                }
            },
            body: {
                items: props.fields
            }
        }
    })
}
