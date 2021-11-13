import { Html, Renderer, Scheduler, VNodeFactory } from "@chorda/core";
import { ReactRenderer } from "./renderer";




class EmbeddedReactRenderer extends ReactRenderer {

    _callback: Function

    constructor (callback: Function) {
        super()
        this._callback = callback
    }

    schedule () {
        this.scheduled = true
        setTimeout(() => {
//        requestAnimationFrame(() => {
//            console.log('[react] render start')
            this.scheduled = false

            this.processing = true

            let tasks = this.tasks
            this.tasks = []

            const markDirty = (html: Html) => {
                html.dirty = true
                html.children?.forEach(c => markDirty(c))
            }

            //this.roots.forEach(root => markDirty(root as any))

            const rendered = this.roots.map(root => root.node.render(true))

            this._callback(rendered)

//             this.roots.forEach((root, i) => {
//                 ReactDOM.render(rendered[i], root.el, () => {
// //                    console.log('[react] dom ready')

//                     tasks
//                         .filter(ownTaskFilter(this))
//                         .filter(subscriptionTaskFilter(this.subscriptions))
//                         .filter(unknownTaskFilter(this.subscriptions))

//                     console.log('[react] render end', tasks.length)                    
//                 })
//             })

            this.processing = false
        })
    }

}


export const createEmbedReactRenderer = (callback: Function) : Scheduler&Renderer&VNodeFactory => {
    return new EmbeddedReactRenderer(callback)
}
