import { callable, computable, HtmlBlueprint, HtmlOptions, HtmlScope, mix, observable, watch } from "@chorda/core"
import { Custom } from "../../../utils"



type InfiniteScrollPage<I> = {
    id: number
    items: I[]
}

export type InfiniteScrollScope<I=any> = {
    infiniteScroll: {
        intersectionObserver: IntersectionObserver
        observableItems: Map<Element, any[]>
        pages: InfiniteScrollPage<I>[]
        lastPage: number
        totalPages: number
        loading: boolean
        resetAndGetFirst?: () => void
        update?: (id: number, items: I[], total: number) => void
    }
    onNextPage: (page: number) => number
    infiniteItems: I[]
}

export type InfiniteScrollEvents<I=any> = Pick<InfiniteScrollScope<I>, 'onNextPage'>

export type InfiniteScrollBlueprintType<I, T=unknown, E=unknown> = HtmlBlueprint<T&InfiniteScrollScope<I>&HtmlScope, E&InfiniteScrollEvents<I>>

export const withInfiniteScroll = <T, E>(props: HtmlBlueprint<T&InfiniteScrollScope&HtmlScope, E&InfiniteScrollEvents>) : HtmlBlueprint<T, E> => {

    const ioOptions: IntersectionObserverInit = {
        rootMargin: '600px',
        threshold: 0
    }

    return mix<InfiniteScrollScope&HtmlScope>({
        defaults: {
            infiniteScroll: () => observable({
                intersectionObserver: null,
                observableItems: new Map(),
                totalPages: 0,
                lastPage: 0,
                pages: [],
                loading: false
            }),
            onNextPage: () => callable(null),
        },
        injections: {
            infiniteItems: ({infiniteScroll}) => computable(() => {
                let out: any[] = []
                infiniteScroll.pages.forEach(page => {
                    page.items.forEach(itm => {
                        out.push(itm)
                    })
                })
                return out
            })
        },
        joints: {
            initInfiniteScroll: ({$dom, infiniteScroll, onNextPage}) => {

                const {lastPage, totalPages, loading, pages, resetAndGetFirst, update} = infiniteScroll

                const callback: IntersectionObserverCallback = (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            if (lastPage < totalPages && loading != true) {
                                loading.$value = true
                                onNextPage(lastPage+1)
                            }                    
                        }
                    })
                }

                $dom.$subscribe((next, prev) => {
                    if (next) {
                        infiniteScroll.intersectionObserver.$value = new IntersectionObserver(callback, {...ioOptions, root: next})
                    }
                    else if (prev) {
                        infiniteScroll.intersectionObserver.disconnect()
                        infiniteScroll.intersectionObserver.$value = null
                    }
                })

                resetAndGetFirst.$value = () => {
                    pages.$value = []
                    totalPages.$value = 0
                    lastPage.$value = 0
                    loading.$value = true
                    onNextPage(1)
                }

                update.$value = (id, items, total) => {
                    pages[id-1].$value = {id, items}
                    totalPages.$value = total
                    lastPage.$value = id
                    loading.$value = false
                }
            },

        },
        components: {
            infiniteTail: Custom<InfiniteScrollScope<any>&HtmlScope, unknown>({
                weight: 10,
                joints: {
                    subscribeObserver: ({$dom, infiniteScroll: {intersectionObserver}}) => {

                        watch(() => {

                            if ($dom.$value && intersectionObserver.$value) {
                                intersectionObserver.observe($dom.$value)
                            }

                        }, [$dom, intersectionObserver])

                    }

                }
            })
        }
    }, props)
}
