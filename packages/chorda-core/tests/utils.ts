import { AsyncEngine, Engine, HtmlProps, Keyed, ownTaskFilter, Scheduler, Stateable, subscriptionTaskFilter, unknownTaskFilter, BufferedEngine } from "../src"
import { Dom, Renderable, Renderer, VNodeFactory } from "../src/render"



// class TestEngine implements Engine<Stateable> {
//     processing: boolean
//     pipeTask: (fn: Function, arg?: any, target?: Stateable) => void

//     tasks: any[] = []
//     scheduled: boolean
//     post: any[] = []

//     scheduleTask (fn: Function, arg: any, target: any) {
//         this.tasks.push({fn, arg, target})
//     }

//     addPostEffect (fn: Function) {
//         this.post.push(fn)
//     }

//     immediate () {
//         const tasks = this.tasks
//         this.tasks = []
//         tasks.forEach(task => {
//             task.fn.call(task.target, task.arg)
//         })
//         if (this.tasks.length > 0) {
//             this.immediate()
//         }
//     }

//     schedule () {
//         if (!this.scheduled) {
//             setTimeout(() => {
//                 const tasks = this.tasks
//                 this.tasks = []
//                 this.scheduled = false

//                 tasks.forEach(task => {
//                     task.fn.call(task.target, task.arg)
//                 })

//                 if (this.tasks.length > 0 && !this.scheduled) {
//                     this.schedule()
//                 }
//                 else if (this.tasks.length == 0) {
//                     this.post.forEach(fn => fn())
//                 }
//             })
//             this.scheduled = true
//         }

//     }
    
//     chain (link: Engine<any>) {
//         this.post.push(() => {
//             link.schedule()
//         })
//     }

// }



const _testEngine = new BufferedEngine()


export const createPatchScheduler = () : Scheduler => {
    return _testEngine
}

// export const nextTick = () => {
//     _testEngine.schedule()
// }

export const immediateTick = () => {
    _testEngine.flush()
}




type RenderRoot = {
    el: Element
    node: Renderable
}


class TestRenderer extends BufferedEngine implements Renderer, VNodeFactory {

    roots: RenderRoot[]

    constructor () {
        super()
        this.roots = []
    }
    isAttached(node: Renderable): boolean {
        throw new Error("Method not implemented.")
    }
    
    attach(el: Element, node: Renderable): void {
        const rootsToDetach = this.roots
        rootsToDetach.forEach(root => this.detach(root.node))
        this.roots.push({el, node})
    }
    detach(node: Renderable): void {
        this.roots = this.roots.filter(root => root.node != node)
    }

    events: Keyed<any>

    render () {

        for (let root of this.roots) {
            root.node.render()
        }

        this.flush()
    }

    createVNode <P, H extends HtmlProps>(key: string, vnodeProps: P, htmlProps: Dom&H, children?: any[]) : any {
        const props: any = {...vnodeProps}
        if (key != null) {
            props.key = key
        }
        Object.keys(htmlProps).filter(k => k[0] != '_').forEach(k => {
            props[k] = (htmlProps as any)[k]
        })
        // if (elRef != null) {
        //     props.elRef = elRef
        // }
        if (children != null) {
            props.children = children
        }
        return props
    }

}

/*
export class TestRenderer implements Renderer, Engine<any> {

    roots: RenderRoot[]
    scheduled: boolean
    tasks: Function[]

    constructor () {
        this.roots = []
        this.scheduled = false
        this.tasks = []
    }
    processing: boolean
    pipeTask: (fn: Function, arg?: any, target?: any) => void
    events: Keyed<any>

    immediate () {

    } 

    addPostEffect (fn: Function) {

    }

    chain (link: Engine<any>) {

    }

    scheduleTask (fn: Function) {
        this.tasks.push(fn)
    }

    attach (el: Element, node: Renderable) {
        const rootsToDetach = this.roots
        rootsToDetach.forEach(root => this.detach(root.node))
        this.roots.push({el, node})
    }

    detach (node: Renderable) {
        this.roots = this.roots.filter(root => root.node != node)
    }
    
    schedule(): void {
        if (!this.scheduled) {
            setTimeout(() => {
                const tasks = this.tasks
                this.tasks = []
                this.scheduled = false
                // TODO отрисовка

                for (let root of this.roots) {
//                    console.log('render', (root.node as any).dirty)
                    root.node.render()
                }

                tasks.forEach(fn => fn())

                if (this.tasks.length > 0 && !this.scheduled) {
                    this.schedule()
                }
            })
            this.scheduled = true
        }
    }
    
}
*/



const _testRenderer = new TestRenderer()

export const createRenderScheduler = () => {
    return _testRenderer
}

export const attachRoot = (r: Renderable) => {
    _testRenderer.attach(null, r)
}

export const immediateRender = () => {
    _testRenderer.render()
}

