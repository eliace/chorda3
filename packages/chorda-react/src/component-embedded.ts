import { Blueprint, buildHtmlContext, buildHtmlOptions, Html, Scheduler } from "@chorda/core"
import * as React from "react"
import { createEmbedReactRenderer } from "./embedded"



type EmbeddedProps = {
    blueprint: Blueprint<unknown, unknown>
    patcher: Scheduler
}


export const ChordaEmbedded = (props: EmbeddedProps) => {

//    const [ignored, forceUpdate] = React.useReducer((x) => x + 1, 0)
    //const [roots, updateRoots] = React.useState(null)

    //const roots: any = React.createElement('div')

    React.useEffect(() => {
        console.log('effect')

        const renderer = createEmbedReactRenderer((r: any[]) => {
            //debugger
            //updateRoots(html.render(true))
            // roots = html.render(true)// r[0]
            // forceUpdate()
        })

        debugger
        
        const html = new Html(buildHtmlOptions(props.blueprint), buildHtmlContext(props.patcher, renderer))
        
        html.attach(null)
        //renderer.attach(null, html)

        return () => {
            html.destroy()
        }
    }, [])

    return React.createElement('div')//roots// vnode ? vnode : null//React.createElement('h1', {}, 'aaaa')// vnode ? vnode : null

}