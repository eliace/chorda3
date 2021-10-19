import { AsyncEngine, Dom, Keyed, Observable, ownTaskFilter, Renderable, Renderer, Scheduler, subscriptionTaskFilter, unknownTaskFilter, VdomProps, VNodeFactory } from "@chorda/core";
import { render, createElement } from "preact"

type RenderRoot = {
    el: Element
    node: Renderable
}



class PreactRenderer extends AsyncEngine implements Renderer, VNodeFactory {

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
        queueMicrotask(() => {
            console.log('[preact] render start', this.roots.length)
            //if (this.roots.length == 0) return
            this.scheduled = false

            this.processing = true

            let tasks = this.tasks
            this.tasks = []

            const rendered = this.roots.map(root => root.node.render(true))

            this.roots.forEach((root, i) => {
                render(rendered[i], root.el)
//                    console.log('[preact] dom ready')

                tasks
                    .filter(ownTaskFilter(this))
                    .filter(subscriptionTaskFilter(this.subscriptions))
                    .filter(unknownTaskFilter(this.subscriptions))

                console.log('[preact] render end')
                
            })

            if (this.roots.length == 0) {
                console.log('[preact] render end. no registered roots')
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
            className: dom.className, 
            style: dom.styles,
        }
        let ref = null
        if (dom.$isSubscribed) {
            let f = domMap.get(dom)
            if (f == null) {
                f = (el: HTMLElement) => dom.$publish(el)
                domMap.set(dom, f)
            }
            ref = f
        }
        if (dom.html) {
            props.dangerouslySetInnerHTML = {__html: dom.html}
            //return createTextVNode(dom.html, dom.key as any)
        }
        return createElement((dom.tag as any) || 'div', props, children)
    }

}




export const createPreactRenderer = () : Scheduler&Renderer&VNodeFactory => {
    return new PreactRenderer()
}


const domMap = new WeakMap<any, Function>()
