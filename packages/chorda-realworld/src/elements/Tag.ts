import { Blueprint, InferBlueprint, Injector, Listener, mix } from "@chorda/core"
import { ReactDomEvents } from "@chorda/react"
import * as React from "react"




type TagScope = {
    text: string
}

type TagProps<T> = {
    as?: Blueprint<T>
    css?: string
    text?: string
    href?: string
    onClick?: Listener<T, React.MouseEvent>
    // isDefault?: boolean
    // isPill?: boolean
    icon?: Blueprint<T>
    text$?: Injector<T>
}

export const Tag = <T>(props: TagProps<T&TagScope>) : InferBlueprint<T> => {
    return mix<TagScope, ReactDomEvents>(props.as, {
        templates: {
            icon: {
                weight: -10
            }
        },
        reactions: {
            text: (v) => ({text: v})
        }
    }, {
        css: props.css,
        dom: {
            href: props.href
        },
        events: {
            $dom: {
                click: props.onClick
            }
        },
        templates: {
            icon: props.icon
        },
        components: {
            icon: !!props.icon
        },
        injections: {
            text: props.text$
        }
    })
}
