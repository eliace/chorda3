import { Blueprint, buildHtmlContext, buildHtmlOptions, Html, Scheduler } from "@chorda/core"
import * as React from "react"
import { createReactRenderer } from "."


type StandaloneProps = {
    blueprint: Blueprint<unknown, unknown>
    patcher: Scheduler
    context?: any
}



export const ChordaStandalone = (props: StandaloneProps) => {

    const html = new Html(
        buildHtmlOptions(props.blueprint), 
        {...props.context, ...buildHtmlContext(props.patcher, createReactRenderer())}
    )

    const ref = (el: HTMLElement) => {
        if (el) {
            html.attach(el)
        }
        else {
            html.detach()
        }
    }

    return React.createElement('div', {
        ref
    })
}