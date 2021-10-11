import { Scheduler, State } from '.'
import { defaultInitRules, defaultPatchRules, Gear, GearEvents, GearOptions, GearScope } from './Gear'
import { Keyed, NoInfer, Stateable } from './Hub'
import { Mixed, mixin, MixRules } from './mix'
import { buildClassName, Dom, DomNode, Renderable, Renderer, VNodeFactory } from './render'
import { DefaultRules } from './rules'
import { Observable } from './value'

//------------------------------------
// HTML
//------------------------------------

export type HtmlScope = {
    $renderer: Renderer&Scheduler&VNodeFactory
    $defaultLayout: Function
    $dom?: HTMLElement
    //$vnodeFactory: VNodeFactory
//    afterRender?: any
} & GearScope

export type HtmlBlueprint<D=unknown, E=unknown, H=any> = HtmlOptions<D, E, H>|string|boolean|Function|Mixed<any>//<HtmlBlueprint>

export interface HtmlOptions<D, E, H, B=HtmlBlueprint<NoInfer<D>, NoInfer<E>, H>> extends GearOptions<D, E, B> {
    layout?: Function
    render?: boolean
    dom?: H
//    domEvents?: {[key: string]: (e: any, s: {[key: string]: Observable}) => void|boolean}
    tag?: string|boolean
    text?: string

    classes?: {[key: string]: boolean}
    css?: string|string[]
    styles?: {[key: string]: string|number}
    html?: string

}

//const o: HtmlOptions<any, any, any> = {}




export type HtmlEvents = GearEvents & {
    afterRender?: () => any
    afterInit?: () => Stateable&Renderable
}

export type HtmlProps = {
    className?: string
    styles?: {[k: string]: string|number}
    html?: string
    tag?: string|boolean
    key?: string|number|symbol
    elRef?: Function
}


export const defaultHtmlInitRules = {
    css: DefaultRules.StringArray,
    ...defaultInitRules
}
  
export const defaultHtmlPatchRules = {
    css: DefaultRules.StringArray,
    ...defaultPatchRules
}


export const defaultHtmlFactory = <D extends Keyed, E=unknown, H=unknown>(opts: HtmlOptions<D, E, H>, context: HtmlScope&D, scope: any, rules? : MixRules) : Html<D> => {
    return new Html(opts, context, scope)
}

export const defaultRender = (html: Renderable|any) => (html.render) ? html.render() : html


export const passthruLayout = (factory: VNodeFactory, key: string, props: any, dom: Dom, children?: Renderable[]) : any[] => {
    return children && children.map(defaultRender)
}

export const defaultLayout = (factory: VNodeFactory, key: string, props: any, dom: Dom, children?: Renderable[]) : any => {
    return factory.createVNode(key, props, dom, children && children.map(defaultRender))
}



export class Html<D=unknown, E=unknown, H=any, S extends HtmlScope=HtmlScope, O extends HtmlOptions<D, E, H>=HtmlOptions<D, E, H>, B extends HtmlBlueprint<D, E, H>=HtmlBlueprint<D, E, H>> extends Gear<D, E, S, O, B> implements Renderable {

    vnode: any
    attached: boolean
    dirty: boolean


//    ext: HtmlProps

    constructor (options: O, context?: S, scope?: any) {
        super(options, context, scope)

        this.scope.$dom = new DomNode(this.scope.$renderer) as any

    //        this.ext = {}

//        this.dirty = true
    }


    patch (optPatch: O) {
        super.patch(optPatch)

        const o = this.options

        // TODO

        const dom = this.scope.$dom as HtmlProps

        if (optPatch.classes) {
            dom.className = buildClassName(dom.className, o.classes)
        }
        if (optPatch.css) {
            dom.className = buildClassName(dom.className, o.css)
        }
        if (optPatch.styles) {
            dom.styles = {...dom.styles, ...o.styles}
        }
        if (optPatch.html) {
            dom.html = o.html
        }
        if (optPatch.tag != null) {
            dom.tag = o.tag
        }

        // помечаем путь до корня "грязным"
        let html = this
        while (html && !html.dirty) {
            html.dirty = true
//            if (!html.parent) {
            if (html.isRoot) {
//                debugger
                    // планируем перерисовку в свой такт (после всех патчей)
                html.scope.$pipe.push(html.scope.$renderer.task(null))
//                break
            }
            html = html.parent
        }
        // this.visit((h) => {
        //     if (h.dirty) return false
        //     h.dirty = true
        // })
    }

    initRules () : MixRules {
        return defaultHtmlInitRules
    }

    patchRules () : MixRules {
        return defaultHtmlPatchRules
    }

    attach (root: Element) {
        this.scope.$renderer.attach(root, this)
        this.attached = true
    }

    detach () {
        this.scope.$renderer.detach(this)
        this.attached = false
    }

    get isRoot () : boolean {
        return this.parent ? (this.parent.scope.$renderer != this.scope.$renderer) : true
    }



    render (asRoot?: boolean) : any {

        if (this.state == State.Destroyed) {
            return null
        }

        if (!asRoot && this.isRoot) {
            return null
        }

        if (this.options.render === false) {
            return null
        }

        if (!this.dirty) {
            return this.vnode
        }

        const o = this.options

        const layout = o.layout || this.scope.$defaultLayout
//        const renderer: Renderer = this.scope.$renderer
        const factory = this.scope.$renderer//.$vnodeFactory
        const dom = this.scope.$dom
        const text = o.text
        const children = this.children
        const key = this.uid || this.key || this.index

        // if (key != null) {
        //     ext.key = key
        // }

        if (text || children.length > 0) {
            let childrenAndText = children
            if (text) {
                childrenAndText = [...children]
                const i = children.findIndex(c => c.options.weight && c.options.weight > 0)
                if (i == -1) {
                    childrenAndText.push(text as any)
                }
                else {
                    childrenAndText.splice(i, 0, text as any)
                }
            }
            this.vnode = layout(factory, key, this.options.dom, dom, childrenAndText)
        }
        else {
            this.vnode = layout(factory, key, this.options.dom, dom)
        }

//        (dom as any).$applyEffects(this.scope.$renderer)

        this.dirty = false

        return this.vnode 
    }

    destroy (defer?: Function) {
        super.destroy(() => {

            if (this.attached) {
                this.detach()
            }
            else {

                // помечаем путь до корня "грязным"
                let html = this
                while (html && !html.dirty) {
                    html.dirty = true
        //            if (!html.parent) {
                    if (html.isRoot) {
                        if (this.state == State.Destroying) {
                            // отложенное удаление планируем в ближайший кадр, чтобы удаленный элемент как можно скорее пропал из VDOM
                            html.scope.$renderer.publish(html.scope.$renderer.task(null))
                        }
                        else {
                            // немедленное удаление синхронизируем с патчами, чтобы избежать "моргания"
                            html.scope.$engine.publish(html.scope.$renderer.task(null))
                        }
        //                debugger
        //                break
                    }
                    html = html.parent
                }
            }

            defer && defer()
        })
    }


}




