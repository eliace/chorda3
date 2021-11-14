import { createAsyncPatcher } from "./patcher";
import { defaultHtmlFactory, defaultHtmlInitRules, defaultLayout, Html, HtmlBlueprint, HtmlOptions, HtmlScope } from "./Html";
import { NoInfer } from "./Hub";
import { mixin } from "./mix";
import { pipe, Scheduler } from "./pipe";
import { Renderer, VNodeFactory } from "./render";
import { callable, Observable, PublishFunc } from "./value";

export type InferBlueprint<T, E=unknown, H=any> = HtmlBlueprint<T, E, H>

export type Blueprint<T, E=unknown, H=any> = InferBlueprint<NoInfer<T>, NoInfer<E>, H>

export const mix = <T, E=unknown>(...args: InferBlueprint<T, E>[]) : InferBlueprint<unknown> => {
    return mixin.apply(this, args)
}


// export const mix2 = <T, X>(a: HtmlBlueprint<T>, b?: HtmlBlueprint<X>) : Mixed<HtmlBlueprint<T&X>> => {
//     return mixin(b as any, a as any) as Mixed<HtmlBlueprint<T&X>>
// }

export const buildHtmlOptions = <T>(blueprint: InferBlueprint<T>) : HtmlOptions<any, any, any> => {
    const b = mixin(blueprint as T).build(defaultHtmlInitRules)
    if (typeof b === 'boolean') {
        return null
    }
    return b
}

export const buildHtmlContext = (renderer: Scheduler&Renderer&VNodeFactory) : HtmlScope => {
    const patcher = createAsyncPatcher()
    return {
        $defaultFactory: defaultHtmlFactory,
        $defaultLayout: defaultLayout,
        $patcher: patcher,
        $renderer: renderer,
        $pipe: pipe(patcher, renderer)
    }
}

export const attach = (html: Html, el: () => Element) => {
    if (document.readyState == 'complete') {
        html.attach(el())
    }
    else {
        document.addEventListener('DOMContentLoaded', () => {
            html.attach(el())
        })    
    }
}

export const detach = (html: Html) => {
    html.detach()
}


export namespace Infer {
    export type Blueprint<T, E=unknown, H=any> = HtmlBlueprint<T, E, H>
}



type FlattenObservable<T> = T extends Observable<infer I> ? I : T

type WatchArrType1 = <T>(f: (next: [FlattenObservable<T>]) => void, objects: [T]) => void
type WatchArrType2 = <T, T2>(f: (next: [FlattenObservable<T>, FlattenObservable<T2>]) => void, objects: [T, T2]) => void
type WatchArrType3 = <T, T2, T3>(f: (next: [T, T2, T3]) => void, objects: [T, T2, T3]) => void
type WatchArrType4 = <T, T2, T3, T4>(f: (next: [T, T2, T3, T4]) => void, objects: [T, T2, T3, T4]) => void

type WatchArrType = WatchArrType1&WatchArrType2&WatchArrType3&WatchArrType4

export const watch : WatchArrType = <T>(f: PublishFunc<T>, objects: any[]) => {
    for (let obj of objects) {
        if (obj == null) {
            throw Error('Watched object is null')
        }
        (obj as Observable<unknown>).$subscribe(() => f.apply(this, [objects.map(o => o.$value)]))
//        (obj as Observable<unknown>).$subscribe(() => autoTerminalAware(f))
    }
}



export const dispatchable = callable