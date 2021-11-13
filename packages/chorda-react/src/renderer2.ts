import { AsyncEngine, Dom, VdomProps, Keyed, Observable, ownTaskFilter, Renderable, Renderer, Scheduler, subscriptionTaskFilter, unknownTaskFilter, VNodeFactory } from "@chorda/core";
import * as React from "react";
import * as ReactDOM from "react-dom";



type RenderRoot = {
    el: Element
    node: Renderable
}


export const EVENT_MAP : Keyed<string> = {
    click: 'onClick',
    doubleClick: 'onDoubleClick',
    change: 'onChange',
    input: 'onInput',
    focus: 'onFocus',
    blur: 'onBlur',
    keyUp: 'onKeyUp',
    keyDown: 'onKeyDown',
    submit: 'onSubmit',
}



export class ReactRenderer2 extends AsyncEngine implements Renderer, VNodeFactory {

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
        queueMicrotask(() => {
//        requestAnimationFrame(() => {
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

    createVNode <P, O extends VdomProps>(key: string, vnodeProps: P, dom: O&Dom&Observable<HTMLElement>, children: any[]) {
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



export const createReactRenderer = () : Scheduler&Renderer&VNodeFactory => {
    return new ReactRenderer2()
}


// export type ReactEvents = {
//     click: React.MouseEvent
// }

export type ReactAttributes = Partial<{
    id: string
}>

//export type ReactBlueprint<D> = HtmlBlueprint<D&ReactEvents, ReactAttributes>


export type ReactDomEvents = {
    $dom: {
        click: () => React.MouseEvent
        doubleClick: () => React.MouseEvent
        change: () => React.ChangeEvent
        input: () => React.FormEvent
        focus: () => React.FocusEvent
        blur: () => React.FocusEvent
        keyUp: () => React.KeyboardEvent
        keyDown: () => React.KeyboardEvent
        submit: () => React.FormEvent
    }
}
