import { AsyncEngine, Dom, HtmlProps, Keyed, Observable, ownTaskFilter, Renderable, Renderer, Scheduler, subscriptionTaskFilter, unknownTaskFilter, VNodeFactory } from "@chorda/core";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { EVENT_MAP } from "./renderer";



type RenderRoot = {
    el: Element
    node: Renderable
}


class ReactRenderer2 extends AsyncEngine implements Renderer, VNodeFactory {

    roots: RenderRoot[]

    constructor () {
        super()
        this.roots = []
    }
    
    attach(el: Element, node: Renderable): void {
        this.roots.push({el, node})
    }

    detach(node: Renderable): void {
        this.roots = this.roots.filter(root => root.node != node)
    }

    schedule () {
        this.scheduled = true
        requestAnimationFrame(() => {
//            console.log('[react] render start')
            this.scheduled = false

            this.processing = true

            let tasks = this.tasks
            this.tasks = []

            const rendered = this.roots.map(root => root.node.render(true))

            this.roots.forEach((root, i) => {
                ReactDOM.render(rendered[i], root.el, () => {
//                    console.log('[react] dom ready')

                    tasks
                        .filter(ownTaskFilter(this))
                        .filter(subscriptionTaskFilter(this.subscriptions))
                        .filter(unknownTaskFilter(this.subscriptions))

                    console.log('[react] render end', tasks.length)                    
                })
            })

            this.processing = false
        })
    }

    get events() : Keyed<any> {
        return EVENT_MAP
    }
    
    isAttached (node: Renderable) : boolean {
        return this.roots.find((root) => root.node == node) != null
    }

    createVNode <P, O extends HtmlProps>(key: string, vnodeProps: P, dom: O&Dom&Observable<HTMLElement>, children: any[]) {
        const tag = dom.tag
        const props: any = {
            ...vnodeProps,
            key, 
            className: dom.className, 
            style: dom.styles,
    //        ref: dom.$ref
        }
        if (dom.html) {
            props.dangerouslySetInnerHTML = {__html: dom.html}
        }
    
        if (dom.$isSubscribed) {
            let f = domMap.get(dom)
            if (f == null) {
                f = (el: HTMLElement) => dom.$publish(el)
                domMap.set(dom, f)
            }
            props.ref = f//(el: HTMLElement) => dom.$publish(el)
        }
    
        const events = dom.$eventHandlers
        for (let n in events) {
            if (EVENT_MAP[n]) {
                props[EVENT_MAP[n]] = events[n]
            }
        }
    
        return tag === false ? children : React.createElement((!tag || tag === true ) ? 'div' : tag, props, children)
    }

}


const domMap = new WeakMap<any, Function>()



export const createRenderScheduler = () : Scheduler&Renderer&VNodeFactory => {
    return new ReactRenderer2()
}
