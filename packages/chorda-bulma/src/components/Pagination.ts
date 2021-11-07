import { Blueprint, computable, InferBlueprint, Injector, iterable, mix, observable, patch } from "@chorda/core"


type PaginationScope = {
    pages: {[key: string]: number}
    maxPages: number
    __it: {[key: string]: number}
    __item: number
    current: number
    active: boolean
}

type PaginationProps<T, E> = {
    maxPages?: number
    maxPages$?: Injector<T>
    current$?: Injector<T>
    as?: Blueprint<T, E>
}


export const Pagination = <T, E>(props: PaginationProps<T, E>) : InferBlueprint<T, E> => {
    return mix<PaginationScope>({
        css: 'pagination',
        tag: 'nav',
        templates: {
            previous: {
                css: 'pagination-previous'
            },
            next: {
                css: 'pagination-next'
            },
            list: {
                tag: 'ul',
                css: 'pagination-list',
                defaultComponent: {
                    tag: 'li',
                    templates: {
                        content: {
                            tag: 'a',
                            css: 'pagination-link',
                            reactions: {
                                __item: v => ({text: String(v)}),
                                active: v => ({classes: {'is-current': v}})
                            },
                            events: {
                                $dom: {
                                    click: (e: any, {current, __item}: any) => {
                                        current.$value = __item
                                    }
                                }
                            }
                        }
                    },
                    injections: {
                        active: $ => computable(() => {
                            return $.current == $.__item
                        })
                    }
                },
                reactions: {
                    __it: v => patch({components: v})
                }
            }
        },
        components: {
            previous: false,
            next: false,
        }
    }, 
    props?.as,
    props && {
        initials: {
            maxPages: () => observable(props.maxPages),
            current: () => observable(1),
        },
        injections: {
            pages: $ => computable(() => {
                const pages = {} as {[key: string]: number}
                for (let i = 0; i < $.maxPages; i++) {
                    pages[i+1] = i+1
                }
                return pages
            }),
            maxPages: props.maxPages$,
            __it: $ => iterable($.pages, '__item'),
            current: props.current$,
        }
    })
}