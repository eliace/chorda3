import { buildHtmlContext, buildHtmlOptions, Html, Infer, InferBlueprint, observable, patch } from "@chorda/core";
import { ChordaEmbedded, ChordaStandalone, createEmbedReactRenderer, ReactDomEvents } from "@chorda/react";
import * as React from "react";


let roots = null
let html = null

type TestScope = {
    i18n: string
}

export const Test = () : Infer.Blueprint<{value: string}&TestScope, ReactDomEvents> => {
    return {
        defaults: {
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
                value: v => ({text: v})
            }
        }, {
            tag: 'div',
            reactions: {
                i18n: v => ({text: v})
            }
        }]
    }
}

export const ChordaComponent = () => {

    const [ignored, forceUpdate] = React.useReducer((x) => x + 1, 0)


    React.useEffect(() => {
//        console.log('effect')

        if (!html) {

            const renderer = createEmbedReactRenderer((r: any[]) => {
                roots = html.render(true)// r[0]
                forceUpdate()
            })
            
            html = new Html(buildHtmlOptions(Test()), buildHtmlContext(renderer))
            
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


export const TestContext = React.createContext<TestScope>({
    i18n: 'ru'
})
  



export const ChordaComponent2 = () => {

    const ctx = React.useContext(TestContext)

    return ChordaStandalone({
        blueprint: Test(),
        context: ctx
    })
}

export const ChordaComponent3 = () => {
    return ChordaEmbedded({
        blueprint: Test(),
    })
}