import { createHtmlContext, createHtmlOptions, Html, InferBlueprint, observable, patch } from "@chorda/core";
import { createAsyncPatcher } from "@chorda/engine";
import { createEmbedReactRenderer, DomEvents } from "@chorda/react";
import * as React from "react";


let roots = null
let html = null

export const Test = () : InferBlueprint<{value: string}, DomEvents> => {
    return {
        initials: {
            value: () => observable('')
        },
        items: [{
            tag: 'input',
            events: {
                $dom: {
                    change: (e, {value}) => {
                        value.$value = (e.currentTarget as HTMLInputElement).value
                    }
                }
            }
        }, {
            tag: 'p',
            reactions: {
                value: v => patch({text: v})
            }
        }]
    }
}

export const ChordaComponent = () => {

    const [ignored, forceUpdate] = React.useReducer((x) => x + 1, 0)


    React.useEffect(() => {
//        console.log('effect')

        if (!html) {

            const patcher = createAsyncPatcher()
            const renderer = createEmbedReactRenderer((r: any[]) => {
                roots = html.render(true)// r[0]
                forceUpdate()
            })
            
            html = new Html(createHtmlOptions(Test()), createHtmlContext(patcher, renderer))
            
            renderer.attach(null, html)

            return () => {
                html.destroy()
            }
        }
    }, [])

    return roots// vnode ? vnode : null//React.createElement('h1', {}, 'aaaa')// vnode ? vnode : null

    // const ref = (el: HTMLElement) => {
    //     if (el) {
    //         renderer.attach(el, html)
    //     }
    //     else {
    //         renderer.detach(html)
    //     }
    // }

    // return React.createElement('div', {
    //     ref
    // })
}