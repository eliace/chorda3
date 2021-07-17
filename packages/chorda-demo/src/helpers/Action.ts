import { HtmlBlueprint, Listener, mix } from "@chorda/core"


type ActionEvents = {
    click: any
}

type ActionProps<T> = {
    icon?: string,
    css?: string,
    onClick: Listener<T, ActionEvents>
}

export const Action = <T>(props: ActionProps<T>) : HtmlBlueprint<T> => {
    return mix({
        tag: 'a',
        css: 'is-action',
        templates: {
            icon: {
                // Icon
                weight: -10,
                css: 'is-before'
            },
            content: {
                tag: 'span'
            }
        }        
    }, {
        css: props.css,
        events: {
            click: props.onClick
        },
        templates: {
            icon: {
                css: props.icon
            }
        }
    })
}
