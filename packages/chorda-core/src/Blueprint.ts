import { HtmlBlueprint } from "./Html";
import { NoInfer } from "./Hub";
import { Mixed, mixin } from "./mix";

export type InferBlueprint<T, E=unknown, H=any> = HtmlBlueprint<T, E, H>

export type Blueprint<T, E=unknown, H=any> = InferBlueprint<NoInfer<T>, NoInfer<E>, H>

export const mix = <T, E=unknown>(...args: Blueprint<T, E>[]) : InferBlueprint<unknown> => {
    return mixin.apply(this, args)
}

export const mix2 = <T, X>(a: HtmlBlueprint<T>, b?: HtmlBlueprint<X>) : Mixed<HtmlBlueprint<T&X>> => {
    return mixin(b as any, a as any) as Mixed<HtmlBlueprint<T&X>>
}
