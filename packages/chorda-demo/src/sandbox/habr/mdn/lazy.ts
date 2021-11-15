import { Blueprint, callable, Infer, Injector, mix, observable, passthruLayout, watch } from "@chorda/core"



type LazyScope = {
    lazyComponent: Blueprint<unknown>
    isLazyLoad: boolean
    loadLazy: () => void
}

type LazyComponentProps<T> = {
    lazy: () => Promise<Blueprint<T>>
    initial: Blueprint<T>
    isLazyLoad$?: Injector<T>
}

export const Lazy = <T>(props: LazyComponentProps<T&LazyScope>) : Infer.Blueprint<T> => {
    return mix<LazyScope>({
        layout: passthruLayout,
        templates: {
            lazy: null,
            fallback: props.initial
        },
        reactions: {
            // lazyComponent: v => ({components: {
            //     lazy: v,
            //     fallback: !v
            // }}),
            lazyComponent: v => ({components: {
                lazy: v,
                fallback: !v
            }})
        },
        defaults: {
            lazyComponent: () => observable(null),
            isLazyLoad: () => observable(false),
        },
        injections: {
            isLazyLoad: props.isLazyLoad$,
            loadLazy: $ => () => {
                $.isLazyLoad.$value = true
            }
        },
        joints: {
            lazyLoad: ({isLazyLoad, lazyComponent}) => {

                watch(() => {
                    if (isLazyLoad.$value) {
                        setTimeout(() => {
                             props.lazy().then(c => lazyComponent.$value = c)
                        }, 2000)
                    }
                }, [isLazyLoad])

            }
        }
    })
}