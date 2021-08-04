import { Engine } from './engine'
import { defaultInitRules, defaultPatchRules, Gear, GearEvents, GearOptions, GearScope } from './Gear'
import { Keyed, NoInfer } from './Hub'
import { Mixed, mixin, MixRules } from './mix'
import { buildClassName, Dom, DomNode, Renderable, Renderer, VNodeFactory } from './render'
import { DefaultRules } from './rules'
import { Observable } from './value'

//------------------------------------
// HTML
//------------------------------------

export type HtmlScope = {
    $renderer: Renderer&Engine<any>
    $defaultLayout: Function
    $dom?: HTMLElement
    $vnodeFactory: VNodeFactory
//    afterRender?: any
} & GearScope

export type HtmlBlueprint<D=unknown, E=unknown, H=any> = HtmlOptions<D, E, H>|string|boolean|Function|Mixed<any>//<HtmlBlueprint>

export interface HtmlOptions<D, E, H, B=HtmlBlueprint<NoInfer<D>, NoInfer<E>, H>> extends GearOptions<D, E, B> {
    layout?: Function
    renderer?: Renderer
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
    return factory(key, props, dom, children && children.map(defaultRender))
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
        if (optPatch.tag) {
            dom.tag = o.tag
        }

        // помечаем путь до корня "грязным"
        let html = this
        while (html && !html.dirty) {
            html.dirty = true
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



    render () : any {

        if (!this.dirty) {
            return this.vnode
        }

        const o = this.options

        const layout = o.layout || this.scope.$defaultLayout
//        const renderer: Renderer = this.scope.$renderer
        const factory = this.scope.$vnodeFactory
        const dom = this.scope.$dom
        const text = o.text
        const children = this.children
        const key = this.uid || this.key || this.index

        // if (key != null) {
        //     ext.key = key
        // }

        if (text || children.length > 0) {
            this.vnode = layout(factory, key, this.options.dom, dom, text ? [text, ...children] : children)
        }
        else {
            this.vnode = layout(factory, key, this.options.dom, dom)
        }

        (dom as any).$applyEffects(this.scope.$renderer)

        this.dirty = false

        return this.vnode 
    }

    destroy (defer?: Function) {
        super.destroy(() => {

            if (this.attached) {
                this.detach()
            }

            defer && defer()
        })
    }


}




