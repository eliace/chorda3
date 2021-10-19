import { AsyncEngine, Dom, VdomProps, Keyed, Observable, ownTaskFilter, Renderable, Renderer, Scheduler, subscriptionTaskFilter, unknownTaskFilter, VNodeFactory } from "@chorda/core";
import { createTextVNode, createVNode, Ref, render } from "inferno";
import { VNodeFlags, ChildFlags } from 'inferno-vnode-flags';


type RenderRoot = {
    el: Element
    node: Renderable
}




class InfernoRenderer extends AsyncEngine implements Renderer, VNodeFactory {

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
        // TODO render(null, el)
    }
    
    schedule () {
        this.scheduled = true
        requestAnimationFrame(() => {
            console.log('[inferno] render start', this.roots.length)
            //if (this.roots.length == 0) return
            this.scheduled = false

            this.processing = true

            let tasks = this.tasks
            this.tasks = []

            const rendered = this.roots.map(root => root.node.render(true))

            this.roots.forEach((root, i) => {
                render(rendered[i], root.el, () => {
//                    console.log('[inferno] dom ready')

                    tasks
                        .filter(ownTaskFilter(this))
                        .filter(subscriptionTaskFilter(this.subscriptions))
                        .filter(unknownTaskFilter(this.subscriptions))

                    console.log('[inferno] render end')
                })
            })

            if (this.roots.length == 0) {
                console.log('[inferno] render end. no registered roots')
            }

            this.processing = false
        })
    }

    get events() : Keyed<any> {
        return {}
    }

    isAttached (node: Renderable) : boolean {
        return this.roots.find((root) => root.node == node) != null
    }

    createVNode <P, O extends VdomProps>(key: string, vnodeProps: P, dom: O&Dom&Observable<HTMLElement>, children: any[]) {
        const props: any = {
            ...vnodeProps,
            key,
            style: dom.styles,
        }
        let ref: Ref = null
        if (dom.$isSubscribed) {
            let f = domMap.get(dom)
            if (f == null) {
                f = (el: HTMLElement) => dom.$publish(el)
                domMap.set(dom, f)
            }
            ref = f as Ref//(el: HTMLElement) => dom.$publish(el)
        }
        if (dom.html) {
            props.dangerouslySetInnerHTML = {__html: dom.html}
            //return createTextVNode(dom.html, dom.key as any)
        }
        return createVNode(VNodeFlags.HtmlElement, (dom.tag as any) || 'div', dom.className, children, ChildFlags.UnknownChildren, props, dom.key as any, ref)
    }

}



export const createInfernoRenderer = () : Scheduler&Renderer&VNodeFactory => {
    return new InfernoRenderer()
}


const domMap = new WeakMap<any, Function>()

// export const defaultVNodeFactory = <P, O extends HtmlProps>(key: string, vnodeProps: P, dom: O&Dom&Observable<HTMLElement>, children: any[]) => {
//     const props = {
//         ...vnodeProps
//     }
//     let ref: Ref = null
//     if (dom.$isSubscribed) {
//         let f = domMap.get(dom)
//         if (f == null) {
//             f = (el: HTMLElement) => dom.$publish(el)
//             domMap.set(dom, f)
//         }
//         ref = f as Ref//(el: HTMLElement) => dom.$publish(el)
//     }
//     return createVNode(VNodeFlags.HtmlElement, (dom.tag as any) || 'div', dom.className, children, ChildFlags.UnknownChildren, props, dom.key as any, ref)
// }
