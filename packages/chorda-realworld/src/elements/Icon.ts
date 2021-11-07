import { Blueprint, InferBlueprint, Listener, mix, Scope } from "@chorda/core"
import { ReactDomEvents } from "@chorda/react"
import * as React from "react"



type IconProps<T> = {
    icon: string,
    onClick?: Listener<T, React.MouseEvent>
}

export const Icon = <T, E>(props: IconProps<T>) : InferBlueprint<T, E&ReactDomEvents> => {
    return mix<unknown, ReactDomEvents>({
        tag: 'i',
        css: props.icon,
        events: {
            $dom: {
                click: props.onClick
            }
            //click: props.onClick
        }
//        weight: props.order
    })
}

