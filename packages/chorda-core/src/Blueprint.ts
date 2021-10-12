import { Html } from ".";
import { defaultHtmlFactory, defaultHtmlInitRules, defaultLayout, HtmlBlueprint, HtmlOptions, HtmlScope } from "./Html";
import { NoInfer } from "./Hub";
import { Mixed, mixin } from "./mix";
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

export const buildHtmlContext = (patcher: Scheduler, renderer: Scheduler&Renderer&VNodeFactory) : HtmlScope => {
    return {
        $defaultFactory: defaultHtmlFactory,
        $defaultLayout: defaultLayout,
        $engine: patcher,
        $renderer: renderer,
        $pipe: pipe(patcher, renderer)
    }
}

export const attach = (html: Html, el: () => Element) => {
    document.addEventListener('DOMContentLoaded', () => {
        html.attach(el())
    })    
}

export const detach = (html: Html) => {
    html.detach()
}