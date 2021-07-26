import { HtmlBlueprint, HtmlScope, Injector, iterable, Joint, mix, mix2, Mixed, observable, patch } from "@chorda/core"
import { Coerced, ItemScope, IteratorScope } from "../../../utils"


type ItemOf<T> = T extends Array<infer Item> ? Item : never;

export type DynamicItemScope<I> = {
    item: I
}

export type DynamicListScope<I> = {
    items: I
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





// const extend = <T, X>(blueprint: HtmlBlueprint<T>, prev?: HtmlBlueprint<X>) : Mixed<T&X> => {
//     return mix(prev as any, blueprint as any) as Mixed<T&X>
// }







export type BoundsScope = {
    bounds: DOMRect
}


export const withDetectListBounds = <T>(props?: HtmlBlueprint<T&BoundsScope>) : HtmlBlueprint<T> => {
    return mix<BoundsScope&HtmlScope&IteratorScope<any>>({
        initials: {
            bounds: () => observable(null),
        },
        joints: {
            detectBounds: ({$dom, bounds, __it, $engine}) => {

                const detect = () => {
                    if ($dom.$value /*&& __it.$value.length > 0*/) {
                        $engine.pipeTask(() => {
                            bounds.$value = $dom.$value.getBoundingClientRect()
                        })
                    }
                }
            
                $dom.$subscribe(detect)
                __it.$subscribe(detect)
            },            
        }
    }, props)
} 



export type WatchScrollScope = {
    scrollTop: number
}


export const withWatchScroll = <T>(props?: HtmlBlueprint<T&WatchScrollScope>) : HtmlBlueprint<T> => {
    return mix<WatchScrollScope&HtmlScope>({
        initials: {
            scrollTop: () => observable(0),
        },
        joints: {
            watchScroll: ({$dom, scrollTop}) => {

                const listener = (e: Event) => {
//                        console.log('watch scroll')
                    scrollTop.$value = (e.target as Element).scrollTop
                }
                $dom.$subscribe((next, prev) => {
                    if (next) {
                        next.addEventListener('scroll', listener)
                    }
                    else {
                        debugger
                    }
                })

                // let t = performance.now()

                // scrollTop.$subscribe((next, prev) => {
                //     let t2 = performance.now()
                //     console.log('distance', next - prev, (next - prev)/(t2 - t))
                //     t = t2
                // })
            },
        }
    }, props)
}


//const e = mix2(withWatchScroll).mix(withDetectListBounds)
