import { AsyncEngine, Keyed, ownTaskFilter, Renderable, Renderer, Scheduler, subscriptionTaskFilter, unknownTaskFilter } from "@chorda/core";
import * as ReactDOM from "react-dom";
import { EVENT_MAP } from "./renderer";



type RenderRoot = {
    el: Element
    node: Renderable
}


class ReactRenderer2 extends AsyncEngine implements Renderer {

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
            console.log('render start')
            this.scheduled = false

            this.processing = true

            let tasks = this.tasks
            this.tasks = []

            const rendered = this.roots.map(root => root.node.render())

            this.roots.forEach((root, i) => {
                ReactDOM.render(rendered[i], root.el, () => {
                    console.log('react render end')

                    tasks
                        .filter(ownTaskFilter(this))
                        .filter(subscriptionTaskFilter(this.subscriptions))
                        .filter(unknownTaskFilter(this.subscriptions))

                    console.log('rendered and effected')                    
                })
            })

            this.processing = false
        })
    }

    get events() : Keyed<any> {
        return EVENT_MAP
    }
    
}


export const createRenderScheduler = () : Scheduler&Renderer => {
    return new ReactRenderer2()
}
