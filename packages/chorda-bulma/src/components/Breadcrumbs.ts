import { Blueprint, computable, InferBlueprint, Injector, iterable, mix, observable } from "@chorda/core"



type BreadcrumbScope = {
    link: string,
    text: string,
    active: boolean

}

type BreadcrumbProps = {
    link?: string,
    text?: string,
    active?: boolean
}


export const Breadcrumb = <T, E>(props: BreadcrumbProps) : InferBlueprint<T, E> => {
    return mix<BreadcrumbScope>({
        classes: {
            'is-active': props.active
        },
        templates: {
            content: {
                text: props.text,
                dom: {
                    href: props.link
                },
                reactions: {
                    text: v => ({text: v}),
                }
            }
        },
        reactions: {
            active: v => ({classes: {'is-active': v}}),
        }
    })
}



type BreadcrumbsScope = {
    items: Blueprint<unknown>[]
    __it: any[]
    item: Blueprint<unknown>
    isLast: boolean
    items2: BreadcrumbScope[]
    items3: BreadcrumbScope[]
}

type BreadcrumbsProps<T, E> = {
    items?: Blueprint<T, E>[]
    items$?: Injector<T>
    itemAs?: Blueprint<T, E>
//    data?: BreadcrumbItemProp[]
}

export const Breadcrumbs = <T, E>(props: BreadcrumbsProps<T&BreadcrumbsScope, E>) : InferBlueprint<T, E> => {
    return mix<BreadcrumbsScope>({
        tag: 'nav',
        css: 'breadcrumb',
        templates: {
            content: {
                tag: 'ul',
                defaultItem: {
                    tag: 'li',
                    templates: {
                        content: {
                            tag: 'a',
                            reactions: {
                                // data: (v: any) => ({
                                //     text: v && v.text,
                                //     dom: {
                                //         href: v && v.link
                                //     }
                                // })
                            }
                        }
                    },
//                     reactions: {
//                         item: (v, next, {isLast}) => {
// //                            if (v) {
//                                 ({
//                                     classes: {'is-active': isLast}
//                                 })
// //                            }
//                         }
//                     },

                },
                reactions: {
                    items: v => ({items: v}),
                    __it: v => ({items: v}),
                },
                injections: {
                    __it: $ => $.items2 && iterable($.items3, null)
                }
            }
        }
    }, {
        initials: {
            items: () => props.items && observable(props.items),
            items2: () => null,
        },
        injections: {
            items2: props.items$,
            items3: $ => computable(() => {
                return $.items2.map((b, i) => {
                    return {...b, active: $.items2.length-1 == i}
                }) as any[]
            })
        },
        templates: {
            content: {
                defaultItem: props.itemAs
            }
        }
    })
}
