import { Dom, Renderable, Renderer, VNodeFactory } from "./utils";
import { AsyncEngine, ownTaskFilter, subscriptionTaskFilter, unknownTaskFilter } from "../pipe";
import { Keyed } from "../Hub";
import { VdomProps } from "../Html";
import { Observable } from "../value";
import { flatten, getTrackingNodeCount, render, updateRefs } from ".";



type RenderRoot = {
    el: Element
    node: Renderable
}

const log = (msg: string, ...data: any) => {
    console.log.apply(this, ['%c'+msg, 'color: green', ...data])
}


export class BasicRenderer extends AsyncEngine implements Renderer, VNodeFactory {

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
            log('[basic] render start')
            this.scheduled = false

            this.processing = true

            let tasks = this.tasks
            this.tasks = []

            const rendered = this.roots.map(root => root.node.render(true))

            this.roots.forEach((root, i) => {
                try {
                    const out = {created: [] as any[], deleted: [] as any[]}
                    renderTree(rendered[i], out, el => {
                        root.el.append(el)
                        log('[basic] dom created')
                    })

                    updateRefs(out.created.concat(out.deleted))


                    log('[basic] render stats', out)
                    log('[basic] tracking', getTrackingNodeCount())
                    //root.el.append(el)

                    log('[basic] dom ready')

                    tasks
                        .filter(ownTaskFilter(this))
                        .filter(subscriptionTaskFilter(this.subscriptions))
                        .filter(unknownTaskFilter(this.subscriptions))

                    log('[basic] render end', tasks.length)   
                }
                catch (err) {
                    console.error(err)
                }


//                debugger
//                 ReactDOM.render(rendered[i], root.el, () => {
// //                    console.log('[react] dom ready')

//                     tasks
//                         .filter(ownTaskFilter(this))
//                         .filter(subscriptionTaskFilter(this.subscriptions))
//                         .filter(unknownTaskFilter(this.subscriptions))

//                     console.log('[react] render end', tasks.length)                    
//                 })
            })

            this.processing = false
        })
    }




    get events() : Keyed<any> {
        return {}
    }
    
    isAttached (node: Renderable) : boolean {
        return this.roots.find((root) => root.node == node) != null
    }

    createVNode <P, O extends VdomProps>(key: string, vnodeProps: P, dom: O&Dom&Observable<HTMLElement>, children: any[], changes?: any) {
        
        const attributes = {
            ...vnodeProps,
            //className: dom.className
        }
        
        return {children, dom, key, tag: dom.tag || 'div', attributes, events: dom.$eventHandlers, ...changes}
    
    
    
        //     const tag = dom.tag
    //     const props: any = {
    //         ...vnodeProps,
    //         key, 
    //         className: dom.className, 
    //         style: dom.styles,
    // //        ref: dom.$ref
    //     }
        // if (dom.html) {
        //     props.dangerouslySetInnerHTML = {__html: dom.html}
        // }
    
        // if (dom.$isSubscribed) {
        //     let f = domMap.get(dom)
        //     if (f == null) {
        //         f = (el: HTMLElement) => dom.$publish(el)
        //         domMap.set(dom, f)
        //     }
        //     props.ref = f//(el: HTMLElement) => dom.$publish(el)
        // }
    
        // const events = dom.$eventHandlers
        // for (let n in events) {
        //     if (EVENT_MAP[n]) {
        //         props[EVENT_MAP[n]] = events[n]
        //     }
        // }
    
        // return tag === false ? children : React.createElement((!tag || tag === true ) ? 'div' : tag, props, children)
    }

}

//const domMap = new WeakMap<any, Function>()



export const createBasicRenderer = () => {
    return new BasicRenderer()
}



const renderTree = (vdom: any, output: {created: any[], deleted: any[]}, ready: (root: Node) => void) => {
    if (vdom == null || vdom.rendered) {
        return
    }
    //console.log('render', vdom)
    render(vdom, vdom, output, ready)

    if (vdom.children) {
        flatten(vdom.children).forEach(child => renderTree(child, output, ready))

        delete vdom.children
        delete vdom.attributes
        delete vdom.events
        delete vdom.styles
        delete vdom.html
    
        vdom.rendered = true
    }

}



export type BasicDomEvents = {
    $dom: {
        click: () => MouseEvent
        change: () => InputEvent
        input: () => InputEvent
        focus: () => FocusEvent
        blur: () => FocusEvent
        keyup: () => KeyboardEvent
        keydown: () => KeyboardEvent
        submit: () => SubmitEvent
        select: () => Event
    }
}
