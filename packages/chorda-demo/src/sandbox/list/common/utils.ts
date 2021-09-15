import { HtmlBlueprint, HtmlOptions, HtmlScope, Injector, iterable, Joint, mix, mix2, Mixed, NoInfer, observable, patch, Scope } from "@chorda/core"
import { Coerced, ItemScope, IteratorScope } from "../../../utils"







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
