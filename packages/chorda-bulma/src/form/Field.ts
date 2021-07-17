import { HtmlBlueprint, mix } from "@chorda/core"


export type FieldScope = {

}


export type FieldProps<T> = {
    label?: string
    control?: HtmlBlueprint<T>
}




export const Field = <T>(props: FieldProps<T&FieldScope>): HtmlBlueprint<T> => {
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
        components: {
            label: props.label != null,
            control: !!props.control
        },
        templates: {
            label: {
                text: props.label
            },
            control: {
                templates: {

                },
                components: {
                    input: props.control
                }
            }
        }
    })
}