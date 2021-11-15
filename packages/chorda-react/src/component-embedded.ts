import { Blueprint, buildHtmlContext, buildHtmlOptions, Html, MicrotaskEngine, Scheduler } from "@chorda/core"
import * as React from "react"
import { createEmbedReactRenderer } from "./embedded"



type EmbeddedProps = {
    blueprint: Blueprint<unknown, unknown>
}


export const ChordaEmbedded = (props: EmbeddedProps) => {

    const [ignored, forceUpdate] = React.useReducer((x) => x + 1, 0)
    const html = React.useRef(null)

    //const roots: any = React.createElement('div')

    if (html.current == null) {

        const renderer = createEmbedReactRenderer((r: any[]) => {
            html.current = [_html, renderer, r[0]]
            forceUpdate()
            //updateRoots(html.render(true))
            // roots = html.render(true)// r[0]
            // forceUpdate()
        })

        const patcher = new MicrotaskEngine()

        const _html = new Html(buildHtmlOptions(props.blueprint), buildHtmlContext(renderer, patcher))

        html.current = [_html, renderer, null]

        //_html.scope.$patcher.flush()
    }


    React.useEffect(() => {

        html.current[0].attach(null)

        return () => {
            html.current[0].destroy()
        }
    }, [])

    // React.useEffect(() => {
    //     console.log('effect')

    //     const renderer = createEmbedReactRenderer((r: any[]) => {
    //         //debugger
    //         //updateRoots(html.render(true))
    //         // roots = html.render(true)// r[0]
    //         // forceUpdate()
    //     })

    //     debugger
        
    //     const html = new Html(buildHtmlOptions(props.blueprint), buildHtmlContext(renderer))
        
    //     html.attach(null)
    //     //renderer.attach(null, html)

    //     return () => {
    //         html.destroy()
    //     }
    // }, [])

    return html.current && html.current[2] //React.createElement('div')//roots// vnode ? vnode : null//React.createElement('h1', {}, 'aaaa')// vnode ? vnode : null
}