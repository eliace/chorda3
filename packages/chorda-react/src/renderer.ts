import { Dom, Engine, Html, HtmlBlueprint, HtmlOptions, HtmlProps, Keyed, Observable, Renderable, Renderer, Stateable } from '@chorda/core'
import * as React from 'react'
import * as ReactDOM from 'react-dom'


type RenderRoot = {
    el: Element
    node: Renderable
}

type RenderTask = {
    fn: Function
    arg: any
    target: Stateable
}


export class ReactRenderer implements Renderer, Engine<any> {

    isScheduled: boolean
    roots: RenderRoot[]
    tasks: RenderTask[]

    constructor () {
        this.roots = []
        this.isScheduled = false
        this.tasks = []
    }

    addPostEffect: (fn: Function) => void;
    chain: (link: Engine<any>) => void;
    
    attach(el: Element, node: Renderable): void {
        this.roots.push({el, node})
    }
    detach(node: Renderable): void {
        this.roots = this.roots.filter(root => root.node != node)
    }
    // createVNode(tuple: [string | number, any, any, any[]]) {
    //     const [key, props, options, children] = tuple
    //     return React.createElement(options.tag || 'div', {...props, key}, children)
    // }
    scheduleTask (fn: Function, arg: any, target: any) {
        this.tasks.push({fn, arg, target})
        if (!this.isScheduled) {
            this.schedule()
        }
    }

    immediate: () => void;

    schedule(): void {
        if (!this.isScheduled) {
            requestAnimationFrame(() => {
                const tasks = this.tasks
                this.tasks = []
                this.isScheduled = false

                const rendered = this.roots.map(root => root.node.render())

                // requestAnimationFrame(() => {
                this.roots.forEach((root, i) => {
                    ReactDOM.render(rendered[i], root.el, () => {
//                            console.log('react render end')
                        tasks.forEach(task => {
                            task.fn.call(task.target, task.arg)
                        })
                        console.log('rendered and effected')
                    })
                })
                    // this.roots.forEach(root => {
                    //     ReactDOM.render(root.node.render(), root.el)
                    // })

            
//                    console.log('rAF render end')
                // })

                console.log('rendered')
            })
            this.isScheduled = true
        }
    }

    get events () {
        return EVENT_MAP
    }

}

const EVENT_MAP : Keyed<string> = {
    click: 'onClick',
    change: 'onChange',
    input: 'onInput',
    focus: 'onFocus',
    blur: 'onBlur',
    keyUp: 'onKeyUp',
    keyDown: 'onKeyDown'
}

export type DomEvents = {
    click: React.MouseEvent
    change: React.ChangeEvent
    input: React.FormEvent
    focus: React.FocusEvent
    blur: React.FocusEvent
    keyUp: React.KeyboardEvent
    keyDown: React.KeyboardEvent
}


const domMap = new WeakMap<any, Function>()

export const defaultVNodeFactory = <P, O extends HtmlProps>(key: string, vnodeProps: P, dom: O&Dom&Observable<HTMLElement>, children: any[]) => {
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

export const createRenderEngine = () => {
    return new ReactRenderer()
}


type ReactEvents = {
    click: React.MouseEvent
}

type ReactAttributes = Partial<{
    id: string
}>

export type ReactBlueprint<D, E={}> = HtmlBlueprint<D, E&ReactEvents, ReactAttributes>

//export type ReactHtml<D, E> = Html<D, E&ReactEvents>