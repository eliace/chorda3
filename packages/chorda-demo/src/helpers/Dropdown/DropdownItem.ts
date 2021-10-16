import { HtmlBlueprint, HtmlScope, Injector, Listener, observable, patch, mix } from "@chorda/core"
import { ReactDomEvents } from "@chorda/react"
import { watch } from "../../utils"
import { MenuItem } from "./utils"



type DropdownItemScope<I> = {
    item: I
    text: string
    isSelected: boolean
//    offsetTop: number
    isCurrent: boolean
    // currentOffsetTop: number
    // currentHeight: number
}

type DropdownItemProps<T> = {
    as?: HtmlBlueprint<T>
    item$?: Injector<T>
    text$?: Injector<T>
    onClick?: Listener<T, ReturnType<ReactDomEvents['$dom']['click']>>
    isSelected$?: Injector<T>
    offsetTop$?: Injector<T>
    isCurrent$?: Injector<T>
    currentOffset$?: Injector<T>
    currentHeight$?: Injector<T>
}

export const DropdownItem = <I extends MenuItem, T=unknown>(props: DropdownItemProps<T&DropdownItemScope<I>&HtmlScope>) : HtmlBlueprint<T> => {
    return mix<DropdownItemScope<I>&HtmlScope, ReactDomEvents>(props?.as, {
        css: 'dropdown-item',
        tag: 'a',
        reactions: {
            text: (v) => patch({text: v}),
            isSelected: (v) => patch({classes: {'is-active': v}}),
            isCurrent: (v) => patch({classes: {'is-current': v}}),
        }
    }, {
        initials: {
//            offsetTop: () => observable(null),
            text: () => observable(null),
//            currentOffsetTop: () => observable(null),
        },
        injections: {
            item: props.item$,
            text: props.text$,
            isSelected: props.isSelected$,
//            offsetTop: props.offsetTop$,
            isCurrent: props.isCurrent$,
            // currentOffsetTop: props.currentOffset$,
            // currentHeight: props.currentHeight$,            
        },
        events: {
            $dom: {
                click: props.onClick
            }
        },
        joints: {
            init: ({$dom}) => {

                // watch(() => {
                //     const el = $dom.$value
                //     const active = isActive.$value
                //     if (el && active) {
                //         console.log('offset', el.offsetTop)
                //         offsetTop.$value = el.offsetTop
                //     }
                // }, [$dom, isActive])

                // watch(() => {
                //     const el = $dom.$value
                //     const current = isCurrent.$value
                //     if (el && current) {
                //         currentOffsetTop.$value = el.offsetTop
                //         currentHeight.$value = el.getBoundingClientRect().height
                //     }
                // }, [$dom, isCurrent])


            },
//             itemPosition: ({$dom, offset, active}) => {
//                 $dom.$subscribe(el => {
//                     if (el && active.$value) {
//                         offset.$value = el.offsetTop
// //                            console.log('offset', el.offsetTop)
//                     }
//                 })
//             },
//             currentItemPosition: ({current, $dom, currentOffset, currentHeight}) => {
//                 current.$subscribe(next => {
//                     const el = $dom.$value
//                     if (el && next) {
// //                            console.log('---- current offset', $dom.$value.offsetTop, currentOffset.$value)
//                         currentOffset.$value = el.offsetTop
//                         currentHeight.$value = el.getBoundingClientRect().height
// //                            console.log(currentOffset)
//                     }
//                 })
//             }
        }
    })
}