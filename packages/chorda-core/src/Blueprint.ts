import { createAsyncPatcher } from "./patcher";
import { defaultHtmlFactory, defaultHtmlInitRules, defaultLayout, Html, HtmlBlueprint, HtmlOptions, HtmlScope } from "./Html";
import { NoInfer } from "./Hub";
import { mixin } from "./mix";
import { pipe, Scheduler } from "./pipe";
import { Renderer, VNodeFactory } from "./render";

export type InferBlueprint<T, E=unknown, H=any> = HtmlBlueprint<T, E, H>

export type Blueprint<T, E=unknown, H=any> = InferBlueprint<NoInfer<T>, NoInfer<E>, H>

export const mix = <T, E=unknown>(...args: Blueprint<T, E>[]) : InferBlueprint<unknown> => {
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