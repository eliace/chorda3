import { defaultHtmlFactory, defaultLayout, EventBus, Html, HtmlBlueprint, HtmlEvents, HtmlOptions, HtmlScope, Keyed, mix, Observable, observable, PublishFunc, Scope, Value } from "@chorda/core"
import { createPatchEngine } from "@chorda/engine"
import { createRenderEngine, defaultVNodeFactory, DomEvents } from "@chorda/react"
import { Route } from "router5"
import * as vis from "vis-network"
import { App } from "./App"
import { RouterScope, useRouter } from "./router"



export type AppScope = {
} & RouterScope

const routes: Route[] = [
    {name: 'home', path: '/'},
    {name: 'elements', path: '/elements/:element'},
    {name: 'form', path: '/form/:element'},
    {name: 'components', path: '/components/:element'},
    {name: 'extended', path: '/extended/:element'},
    {name: 'sandbox', path: '/sandbox/:element'},
]

export const createAppScope = () : HtmlScope => {

    const engine = createPatchEngine()
    const renderer = createRenderEngine()

    engine.chain(renderer)

    const scope : HtmlScope&AppScope = {
        $renderer: renderer,
        $engine: engine,
        $defaultFactory: defaultHtmlFactory,
        $defaultLayout: defaultLayout,
        $vnodeFactory: defaultVNodeFactory,
        router: null
    }

    useRouter(scope, (router) => {
        router.setOption('defaultRoute', 'home')
        router.add(routes)
    })

    return scope
}

export const createAppOptions = () : HtmlOptions<unknown, unknown, any> => {
    return App() as HtmlOptions<unknown, unknown, any>
}


let _HTML: Html = null

export const render = (html: Html, el: () => Element) => {
    _HTML = html // FIXME
    document.addEventListener('DOMContentLoaded', () => {
        html.attach(el())
    })    
}



type CustomProps<T, E=unknown> = {
    as?: HtmlBlueprint<T, E>
    content?: HtmlBlueprint<T, E>
} & HtmlBlueprint<T, E>

export const Coerced = <S, T=unknown, E=unknown>(props: CustomProps<Omit<T, keyof S>&S, E&DomEvents&HtmlEvents>) : HtmlBlueprint<T> => {
    return mix(props.as, props, {
        templates: {
            content: props.content
        }
    })
}

export const Custom = <T, E=unknown>(props: CustomProps<T, E>) : HtmlBlueprint<T, E> => {
    return mix(props.as, props, {
        templates: {
            content: props.content
        }
    })
}

export type DataScope<T> = {
    data: T
}

export type IteratorScope<D> = {
    __it: D
}

export type ItemScope<D> = {
    __item: D
}


//export const withScope = <T>


export const buildHtmlTree = () : vis.Data => {
    const nodes: vis.Node[] = []
    const edges: vis.Edge[] = []

    let c = 1
    let cid = 1
    const ids = new Map<Html, number>()

    visitHtml((node, parent, level, cluster) => {
        const id = c++
        ids.set(node, id)
        if (node.items.length > 20 && cluster == null) {
            cluster = cid++
        }
        const n = {id, level, cid: cluster, color: cluster ? 'red' : null, label: (node.key || node.index)}
        nodes.push(n as vis.Node)
        if (parent) {
            edges.push({
                id: c++,
                from: ids.get(parent),
                to: id
            })    
        }
        return cluster
    })

    return {
        nodes, 
        edges
    }
}

const visitHtml = (f: (node: Html, parent: Html, level: number, cluster: any) => any, node: Html = _HTML, level: number = 1, cluster?: any) => {
    if (node == _HTML) {
        cluster = f(node, null, level, cluster)
    }
    node.children.forEach(child => {
        const c = f(child, node, level+1, cluster)
        !c && visitHtml(f, child, level+1, c)
    })
}


export const createValueEffect = <T, F extends Function>(bus: EventBus<any>&Value<T>, name: string, effect: F) : F => {
    const start = bus.$event(name+'Start')
    const done = bus.$event(name+'Done')
    const f: any = (...args: any[]) => {
        start()
        return effect
            .apply(this, args)
            .then((value: any) => {
                bus.$value = value
                done(value)
                return value
            })
    }
    return f
}




export const watch = <T>(f: PublishFunc<T>, objects: any[]) => {
    for (let obj of objects) {
        (obj as Observable<unknown>).$subscribe(() => f.apply(this, objects.map(o => o.$value)))
    }
}