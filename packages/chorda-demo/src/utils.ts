import { autoTerminalAware, Blueprint, callable, Callable, buildHtmlContext, buildHtmlOptions, defaultHtmlFactory, defaultLayout, EventBus, Html, HtmlBlueprint, HtmlEvents, HtmlOptions, HtmlScope, InferBlueprint, Injector, iterable, Joint, Keyed, Listener, mix, Observable, observable, ownTask, patch, pipe, PublishFunc, Scope, spyGetters, Value } from "@chorda/core"
import { createReactRenderer, ReactDomEvents } from "@chorda/react"
import * as vis from "vis-network"
import { App, routes } from "./App"
import { RouterScope, useRouter } from "./router"



export type AppScope = {
} & RouterScope


export const createAppScope = () : HtmlScope => {

//     const engine = createAsyncPatcher()
//     const renderer = createReactRenderer()

//     engine.subscribe(renderer)
//     //engine.chain(renderer)

//     const scope : HtmlScope&AppScope = {
//         $renderer: renderer,
//         $engine: engine,
//         $pipe: pipe(engine, renderer),
//         $defaultFactory: defaultHtmlFactory,
//         $defaultLayout: defaultLayout,
// //        $vnodeFactory: defaultVNodeFactory,
//         router: null
//     }

    const context: HtmlScope&RouterScope = {router: null, ...buildHtmlContext(createReactRenderer())}

    useRouter(context, (router) => {
        router.setOption('defaultRoute', 'home')
        router.add(routes)
    })

    return context
}

export const createAppOptions = () : HtmlOptions<unknown, unknown, any> => {
    return buildHtmlOptions(App())
}


let _HTML: Html = null

export const render = (html: Html, el: () => Element) => {
    _HTML = html // FIXME
    document.addEventListener('DOMContentLoaded', () => {
        html.attach(el())
    })    
}



type CustomProps<T, E> = {
    as?: Blueprint<T, E>
    content?: Blueprint<T, E>
} & Blueprint<T, E>

export const Coerced = <S, T=unknown, E=unknown>(props: CustomProps<Omit<T, keyof S>&S, E&ReactDomEvents&HtmlEvents>) : InferBlueprint<T> => {
    return mix(props.as, props, {
        templates: {
            content: props.content
        }
    })
}

export const Custom = <T, E>(props: CustomProps<T, E>) : InferBlueprint<T, E> => {
    return mix(props.as, props, {
        templates: {
            content: props.content
        }
    })
}

export const Content = Custom


export const withHtml = <T, E>(props: Blueprint<T&HtmlScope, E&HtmlEvents&ReactDomEvents>) : InferBlueprint<T, E> => {
    return props as any
}

// export const withScope = <S, E=unknown, T=unknown>(props: CustomProps<Omit<T, keyof S>&S, E&DomEvents&HtmlEvents>) : InferBlueprint<T, E> => {
//     return mix(props.as, props)
// }

export const withBlueprint = <T, E=unknown>(props: CustomProps<T, E>) : InferBlueprint<T, E> => {
    return mix(props.as, props)
}

export const withHtmlBlueprint = <T, E=unknown>(props: CustomProps<T&HtmlScope, E&HtmlEvents&ReactDomEvents>) : InferBlueprint<T, E> => {
    return mix(props.as, props)
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
        if (obj == null) {
            throw Error('Watched object is null')
        }
        (obj as Observable<unknown>).$subscribe(() => f.apply(this, objects.map(o => o.$value)))
//        (obj as Observable<unknown>).$subscribe(() => autoTerminalAware(f))
    }
}

// export const compute = <T>(f: PublishFunc<T>, objects?: any[]) => {
//     const sub: PublishFunc<T> = () => autoTerminalAware(f)
    
//     spyGetters(sub).forEach(o => o.$subscribe(sub))
// }

// export const done = <T, R>(c: any, f: Listener<T, R>) => {
//     (c as EventBus<T>).$on('done', f)
// }






type ItemOf<T> = T extends Array<infer Item> ? Item : never;

export type DynamicItemScope<I> = {
    item: I
}

export type DynamicListScope<I> = {
    items: I
    list: I
}

type DynamicListProps<I, T, E> = {
    items$?: Injector<T>
    defaultItem?: HtmlBlueprint<T&DynamicItemScope<I>, E>
    as?: HtmlBlueprint<T, E>
//    with?: HtmlBlueprint<T, E>[]
}

export const DynamicList = <A extends any[], S=unknown, T=unknown, E=unknown, I=ItemOf<A>>(props: DynamicListProps<I, T&S&DynamicListScope<A>, E>) : HtmlBlueprint<T, E> => {
    return mix<DynamicListScope<A>&IteratorScope<A>>({
        reactions: {
            __it: (v) => patch({items: v}),
        },
        injections: {
            __it: (scope) => {
//                console.log('__it', scope.items)
                return iterable(scope.items, '__item')
            }
        },
        defaultItem: Coerced<DynamicItemScope<I>&ItemScope<I>>({
            injections: {
                item: (scope) => {
//                    console.log('item', scope.$context.__it)
                    return scope.__item
                }
            }
        })
    }, 
    props?.as,
//    ...props?.with,
    props && {
        injections: {
            items: props.items$
        },
        defaultItem: props.defaultItem
    })
}


type diProps<T, I> = Omit<HtmlOptions<T, unknown, any>, 'defaultItem'> & {
    defaultItem?: HtmlBlueprint<T&I>,
    as?: HtmlBlueprint<T>
}

export const withIterableItems = <A extends any[], T=unknown, I=ItemOf<A>>(props: diProps<T&DynamicListScope<A>, DynamicItemScope<I>>) : HtmlBlueprint<T> => {
    return mix<DynamicListScope<any[]>&IteratorScope<any[]>>({
        reactions: {
            __it: (v) => patch({items: v}),
        },
        injections: {
            __it: (scope) => {
                return iterable(scope.items, '__item')
            }
        },
        defaultItem: mix<DynamicItemScope<any>&ItemScope<any>>({
            injections: {
                item: (scope) => scope.__item
            }
        })
    }, props?.as, props)
}


export const withItem = <I, T=unknown>(props: HtmlBlueprint<T&DynamicListScope<I[]>&DynamicItemScope<I>>) : HtmlBlueprint<T> => {
    return mix(props)
}




export type ListBlueprint<I, T=unknown, E=unknown, H=any> = Omit<HtmlOptions<T&{items: I[]}, E, H>, 'defaultItem'|'items'> & {
    defaultItem?: Blueprint<T&{item: I}>
    items?: Blueprint<T&{item: I}>[]
}


export const withList = <T extends Scope, E> (props: ListBlueprint<unknown, T&{items: unknown[]}, E>) : InferBlueprint<T, E> => {
    return mix<{$items: unknown[], items: unknown[], $item: unknown, item: unknown}>(props, {
        injections: {
            $items: ($) => iterable($.items, '$item')
        },
        reactions: {
            $items: (v) => patch({items: v})
        },
        defaultItem: {
            injections: {
                item: ($) => $.$item
            }
        }
    })
}


// const TestItem = <T, E>(props: {text$: Injector<T, E>}) : InferBlueprint<T, E> => {
//     return {

//     }
// }


// const b : InferBlueprint<{text: string}, any> = withList(<ListBlueprint<string>>{
//     injections: {
//         items: () => observable([{}])
//     },
//     defaultItem: TestItem({
//         text$: ($) => $.item
//     })
// })







export type OuterClickScope = {
    onOuterClick: () => void
}

export type OuterClickEvents = Pick<OuterClickScope, 'onOuterClick'>

export type OuterClickEvent = {
    outerClick?: () => void
}


export const onOuterClick: Joint<HtmlScope> = ({$dom}) => {

    $dom.$event('outerClick')

    const listener = () => {
        $dom.$emit('outerClick')
    }
    document.addEventListener('mousedown', listener)
    return () => {
        document.removeEventListener('mousedown', listener)
    }
}




export const withOuterClick = <T, E>(props: Blueprint<T&OuterClickScope, E&OuterClickEvents>) : InferBlueprint<T, E> => {
    return mix<OuterClickScope>({
        initials: {
            onOuterClick: () => callable(null)
        },
        joints: {
            initOuterClick: ({onOuterClick}) => {
                // const listener = () => {
                //     onOuterClick()
                // }
                document.addEventListener('mousedown', onOuterClick)
                return () => {
                    document.removeEventListener('mousedown', onOuterClick)
                }            
            }
        }
    }, props)
}


export const withStopMouseDown = <T, E>(props: Blueprint<T, E>, preventDefault?: boolean) : InferBlueprint<T, E> => {
    return mix<HtmlScope>({
        joints: {
            initStopMouseDown: ({$dom}) => {
                $dom.$subscribe((el) => {
                    el?.addEventListener('mousedown', (e: MouseEvent) => {
                        e.stopPropagation()
                        preventDefault && e.preventDefault() // если поставить, то будет слетать фокус на input
                        return false
                    })
                })                            
            }
        }
    }, props)
}

export const withPreventDefaultMouseDown = <T, E>(props: Blueprint<T, E>) : InferBlueprint<T, E> => {
    return withStopMouseDown(props, true)
}


export const stopMouseDown: Joint<HtmlScope> = ({$dom}) => {
    $dom.$subscribe((el) => {
        el?.addEventListener('mousedown', (e: MouseEvent) => {
            e.stopPropagation()
            //e.preventDefault()
            return false
        })
    })
}

export const autoFocus: Joint<HtmlScope&{autoFocus: boolean}> = ({$dom, $renderer}) => {
    $dom.$subscribe(el => {
        if (el) {
            $renderer.publish(ownTask(() => {
                el.focus()
            }))
        }
    })
}


export type BoundsScope = {
    bounds: DOMRect
}

export const withBounds = <T, E>(props: Blueprint<T&BoundsScope, E>) : InferBlueprint<T, E> => {
    return mix<BoundsScope&HtmlScope>({
        initials: {
            bounds: () => observable(null),
        },
        joints: {
            updateBounds: ({$dom, bounds}) => {
                watch(() => {
                    if ($dom.$value) {
                        bounds.$value = $dom.$value.getBoundingClientRect()
                    }
                }, [$dom])
            }
        }
    }, props)
}




export const withMix = <T, E>(...args: Blueprint<T, E>[]) : InferBlueprint<T, E> => {
    return mix.apply(this, args)
}