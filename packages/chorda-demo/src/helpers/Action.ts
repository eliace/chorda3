import { HtmlBlueprint, Listener, mix } from "@chorda/core"
import { ReactDomEvents } from "@chorda/react"
import * as React from "chorda-react/node_modules/@types/react"


type ActionProps<T> = {
    icon?: string,
    css?: string,
    onClick: Listener<T, React.MouseEvent>
}

export const Action = <T>(props: ActionProps<T>) : HtmlBlueprint<T> => {
    return mix<unknown, ReactDomEvents>({
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
            $dom: {
                click: props.onClick
            }
        },
        templates: {
            icon: {
                css: props.icon
            }
        }
    })
}
