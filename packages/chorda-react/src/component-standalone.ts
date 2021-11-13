import { Blueprint, buildHtmlContext, buildHtmlOptions, Html, Scheduler } from "@chorda/core"
import * as React from "react"
import { createReactRenderer } from "./renderer"


type StandaloneProps = {
    blueprint: Blueprint<unknown, unknown>
    context?: any
}



export const ChordaStandalone = (props: StandaloneProps) => {

    const html = new Html(
        buildHtmlOptions(props.blueprint), 
        {...props.context, ...buildHtmlContext(createReactRenderer())}
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