import { computable, DomNode, HtmlBlueprint, HtmlScope, Injector, iterable, Joint, Listener, mix, observable, patch, Value } from "@chorda/core";
import { DomEvents } from "@chorda/react";
import { faAngleDown, faAngleUp, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { Button } from "chorda-bulma";
import { FaSvgIcon } from "./FaSvgIcon";
import { FaIcon } from "./FaIcon";
import { OuterClickEvent, stopMouseDown, watch, onOuterClick } from "../utils";


// type MenuItem = {
//     id: any
//     name: string
// }


export type DropdownOldScope<T, V=T> = {
    items: T[]
    active: boolean
    selected: T
    text: string
    value: V
    activeOffset: number
    current: T
    currentOffset: number
    currentHeight: number
    loading: boolean
    __it: T[]
    bounds: DOMRect
    menuBounds: DOMRect
    up: boolean
}

export type DropdownOldProps<T, I, V=I, E=unknown> = {
    items$?: Injector<T>
    active$?: Injector<T>
    active?: boolean
    defaultItem?: HtmlBlueprint<T, E>
    text$?: Injector<T>
    value$?: Injector<T>
    itemToValue?: (item: I&Value<I>) => V
    itemToKey?: (item: I&Value<I>) => string|symbol|number
    valueToKey?: (item: V&Value<V>) => string|symbol|number
    trigger?: HtmlBlueprint<T, E>
    autoFocus?: boolean
    as?: HtmlBlueprint<T, E>
    loading$?: Injector<T>
    maxHeight?: number
}

export type DropdownOldEvents<I> = {
    itemSelect?: () => I
    cancelSelect?: () => void
} & OuterClickEvent & DomEvents



export const DropdownOld = <I, V=I, T=unknown>(props: DropdownOldProps<T&DropdownOldScope<I, V>&HtmlScope, I, V, DropdownOldEvents<I>>) : HtmlBlueprint<T> => {
    
    const itemToValue = props.itemToValue || ((v: I&Value<I>): V => (v as any).id)
    const itemToKey = props.itemToKey || ((v: I&Value<I>): string|symbol|number => (v as any).id)
    const valueToKey = props.valueToKey || ((v: V&Value<V>): string|symbol|number => (v as any))
    
    return mix<DropdownOldScope<I, V>&HtmlScope, DropdownOldEvents<I>>({
        css: 'dropdown',
        templates: {
            trigger: DropdownOldTrigger({
                content: Button({
                    rightIcon: FaIcon({
                        icon$: ({loading, up}) => computable(() => {
//                            console.log('icon', loading.$value, faCircleNotch.iconName, faAngleDown.iconName)
                            return loading.$value ? [faCircleNotch, 'spin'] : (up.$value ? faAngleUp : faAngleDown)
                        })
                    }),
                    text$: (scope) => scope.text,
                    disabled$: ({loading}) => computable(() => loading == true),
                    onClick: (e, {active}) => {
                        active.$value = !active.$value
                    },
                    as: {
                       // events: {
                        //     blur: (e, {active}) => {
                        //         active.$value = false
                        //     }
                        // },
                        joints: {
                            autoFocus: ({$dom, active}) => {

                                watch(() => {
                                    if ($dom.$value && active.$value) {
                                        $dom.focus()
                                    }
                                }, [$dom, active])

                                // active.$subscribe(next => {
                                //     if (next && $dom.$value) {
                                //         $dom.$value.focus()
                                //     }
                                // })
                            },
                            initEl: ({$dom, active}) => {
                                $dom.$subscribe(el => {
                                    if (el && active.$value) {
                                        el.focus()
                                    }
                                })
                            }
                                // autoFocus: (dom, {$renderer}) => {
                                //     if (props.autoFocus) {
                                //         dom.$subscribe(el => {
                                //             if (el) {
                                //                 $renderer.scheduleTask(() => {
                                //                     el.focus({

                                //                     })
                                //                 })
                                //             }
                                //         })    
                                //     }
                                // }
                        }
                    }
                })
            }),
            menu: {
                css: 'dropdown-menu',
                templates: {
                    content: {
                        css: 'dropdown-content',
                        defaultItem: DropdownOldItem<I, V, DropdownOldScope<I, V>>({
                            onClick: (e, {selected, item, items, value}) => {
//                                console.log('set selected', item)
                                selected.$value = item
//                                value.$value = keyFunc(item) as any
                                selected.$emit('itemSelect', item)
                            },
                            active$: ({selected, item}) => computable(() => {
                                return itemToKey(selected) == itemToKey(item)
                            }),
                            current$: ({current, item}) => computable(() => {
                                return itemToKey(current) == itemToKey(item)
                            }),
                            offset$: (scope) => scope.activeOffset,
                            currentOffset$: (scope) => scope.$context.currentOffset,
                            currentHeight$: (scope) => scope.$context.currentHeight,
                        }),
                        injections: {
                            __it: (scope) => iterable(scope.items)
                        },
                        reactions: {
                            __it: (v) => patch({items: v}),
                            // activeOffset: (v) => {
                            //     patch({}) // FIXME еще один дурацкий хак
                            // }
                        },
                        joints: {
//                             activeOffset: {
//                                 scrollTo: (offset, {active, $renderer, $dom, $engine}) => {
//                                     offset.$subscribe(next => {
//                                         console.log('offset changed', next, active.$value)
//                                         if (active.$value && next) {
//                                             // $renderer.addTask(() => {
//                                             //     $dom.$value.scrollTo(0, next - 20)
//                                             // })
//                                             // requestAnimationFrame(() => {
//                                             //     $dom.$value.scrollTo(0, next - 20)
//                                             // })
//                                             // console.log('offset effect planned', next, active.$value);
// //                                             ($dom as any).$addEffect(() => {
// // //                                                requestAnimationFrame(() => {
// //                                                     $dom.$value.scrollTo(0, next - 20)
// // //                                                })
// //                                                 console.log('offset effect done', $dom.$value, next)
// //                                             })
//                                         }
//                                     })
//                                 }
                            // },
                            initEl: ({$dom, activeOffset}) => {
//                                    console.log('init el')
                                $dom.$subscribe(el => {
//                                        console.log('content el')
                                    if (el) {
                                        console.log('scroll to', activeOffset.$value)
                                        el.scrollTo(0, activeOffset.$value - 18)
                                    }
                                })
                            },
                            scrollTo: ({active, activeOffset, $dom}) => {
                                active.$subscribe(next => {
                                    if (next && $dom.$value /*activeOffset.$value*/) {
                                        console.log('opened')
//                                            $dom.$value.scrollTo(0, activeOffset.$value - 18)
                                    }
                                    else if (!next) {
                                        activeOffset.$value = null
                                    }
                                })
                            },
                            autoScroll: ({currentOffset, $dom, currentHeight}) => {
                                currentOffset.$subscribe(next => {
                                    const el = $dom.$value
//                                        console.log('current changed', next)
                                    if (el) {
                                        const bcr = el.getBoundingClientRect()
                                        const containerMaxOffset = el.scrollTop + bcr.height
                                        const itemMaxOffset = next + currentHeight
                                        const containerMinOffset = el.scrollTop
                                        const itemMinOffset = next
                                        if (itemMaxOffset > containerMaxOffset) {
                                            el.scrollTop = next - bcr.height + currentHeight
                                        }
                                        else if (itemMinOffset < containerMinOffset) {
                                            el.scrollTop = next
                                        }
//                                            if ()
//                                            console.log('check bounaries', containerMaxOffset, itemMaxOffset, containerMinOffset, itemMinOffset)
                                    }
                                })
                            }
                        }
                    }
                },
                joints: {
                    onOuterClick, 
                    stopMouseDown,
                    detectBounds: ({$dom, menuBounds}) => {
                        $dom.$subscribe(el => {
                            if (el) {
                                menuBounds.$value = el.getBoundingClientRect()
                            }
                        })
                    },
                },
                events: {                  
                    outerClick: (e, {active}) => {
                        active.$value = false
                    }
                },
            },
        },
        reactions: {
            active: (v) => {
                patch({classes: {'is-active': v}})
            },
            up: (v) => {
                patch({classes: {'is-up': v}})
            }
        },
    },
    props?.as, 
    props && {
        initials: {
            value: () => observable(null),
            selected: () => observable(null),
            items: () => observable([]),
            active: () => observable(props.active),
            activeOffset: () => observable(null),
            current: () => observable(null),
            currentOffset: () => observable(null),
            currentHeight: () => observable(null),
            loading: () => observable(false),
            bounds: () => observable(null),
            menuBounds: () => observable(null),
            up: () => observable(false),
//            icon: () => observable(faAngleDown.iconName),
//            text: () => observable(''),
        },
        injections: {
            items: props.items$,
            active: props.active$,
            text: props.text$,
            value: props.value$,
            loading: props.loading$,
//            selected: (scope) => scope.value,
        },
        joints: {
            stopMouseDown,
            updateBounds: ({$dom, bounds}) => {

//                let scrollListeners: {listener: (e: Event) => void, target: Element, scroll: number}[] = []

                $dom.$subscribe(el => {
                    if (el) {
                        bounds.$value = el.getBoundingClientRect()

//                         let parentEl = el.parentElement
//                         while (parentEl != null) {
//                             const listener = (e: Event) => {
//                                 let scroll = 0
//                                 scrollListeners.forEach(l => {
//                                     if (l.target == e.target) {
//                                         l.scroll = (e.target as Element).scrollTop
//                                     }
//                                     scroll += l.scroll
//                                 })
//                                 parentScrollTop.$value = scroll
// //                                    console.log('scroll', (e.target as Element).scrollTop)
//                             }
//                             parentEl.addEventListener('scroll', listener)
//                             scrollListeners.push({listener, target: parentEl, scroll: 0})
//                             parentEl = parentEl.parentElement
//                         }
//                            console.log('dropdown bounds', bounds.$value)
                    }
                    // else {
                    //     scrollListeners.forEach(l => {
                    //         l.target.removeEventListener('scroll', l.listener)
                    //     })
                    //     scrollListeners = []
                    // }
                })
            },
            init: ({selected, value, items}) => {
                selected.$event('itemSelect')
                selected.$event('cancelSelect')

                value.$subscribe((next) => {
                    console.log('dropdown value', next)
                    items.forEach(itm => {
                        if (itemToKey(itm as any) == valueToKey(next as any)) {
                             selected.$value = itm
                        }
                    })        
                })

            },
            initCurrent: ({active, current, selected}) => {
                active.$subscribe(next => {
                    if (next) {
                        current.$value = selected
                    }
                })
            }
        },
        events: {      
            itemSelect: (item, {active, value, current}) => {
                active.$value = false
                value.$value = itemToValue(item as any)
//                current.$value = item
            },
            cancelSelect: (e, {active}) => {
                active.$value = false
            },
            $dom: {
                keyDown: (e, {current, items, active, selected}) => {
    //                console.log(e.code)
                    if (active.$value) {
    //                    console.log(e.code)
                        if (e.code == 'ArrowDown') {
                            let i = items.indexOf(current.$value)
                            if (i == items.length - 1) {
                                i = -1
                            }
                            current.$value = items[i+1]
        //                    console.log('current', items.indexOf(current.$value))
                        }
                        else if (e.code == 'ArrowUp') {
                            let i = items.indexOf(current.$value)
                            if (i == 0) {
                                i = items.length
                            }
                            current.$value = items[i-1]                    
                        }
                        else if (e.code == 'Enter') {
                            selected.$value = current
                            selected.$emit('itemSelect', current)
                        }
                        else if (e.code == 'Escape') {
                            selected.$emit('cancelSelect')
                        }
                        else {
                            return
                        }
                        e.preventDefault()
                        return false    
                    }
                }
                    
            }
            
        },
        templates: {
            trigger: props.trigger,
            menu: {
                templates: {
                    content: {
                        styles: {
                            maxHeight: props.maxHeight
                        },
                        defaultItem: props.defaultItem
                    }
                }
            }
        }
    })
}




export type DropdownOldTriggerProps<T, E> = {
    content?: HtmlBlueprint<T, E>
}

export const DropdownOldTrigger = <T, E>(props: DropdownOldTriggerProps<T, E>) : HtmlBlueprint<T, E> => {
    return mix({
        css: 'dropdown-trigger',
    }, {
        templates: {
            content: props.content
        },
    })
}



type DropdownOldItemScope<I> = {
    item: I
    text: string
    active: boolean
    offset: number
    current: boolean
    currentOffset: number
    currentHeight: number
}

type DropdownOldItemProps<T> = {
    as?: HtmlBlueprint<T>
    item$?: Injector<T>
    text$?: Injector<T>
    onClick?: Listener<T, ReturnType<DomEvents['$dom']['click']>>
    active$?: Injector<T>
    offset$?: Injector<T>
    current$?: Injector<T>
    currentOffset$?: Injector<T>
    currentHeight$?: Injector<T>
}

export const DropdownOldItem = <I, V=I, T=DropdownOldScope<I, V>>(props: DropdownOldItemProps<T&DropdownOldItemScope<I>&{__it: I}&HtmlScope>) : HtmlBlueprint<T> => {
    return mix<DropdownOldItemScope<I>&{__it: I}&HtmlScope, DomEvents>(props?.as, {
        css: 'dropdown-item',
        tag: 'a',
        reactions: {
            text: (v) => {
//                console.log('patch text')
                patch({text: v})
            },
            active: (v) => {
//                console.log('patch active')
                patch({classes: {'is-active': v}})
            },
            current: (v) => {
                patch({classes: {'is-current': v}})
            }
        }
    }, {
        initials: {
            item: (scope) => scope.__it,
            offset: () => observable(null),
            text: () => observable(null),
            currentOffset: () => observable(null),
        },
        injections: {
            item: props.item$,
            text: props.text$,
            active: props.active$,
            offset: props.offset$,
            current: props.current$,
            currentOffset: props.currentOffset$,
            currentHeight: props.currentHeight$,            
        },
        events: {
            $dom: {
                click: props.onClick
            }
        },
        joints: {
//             itemPosition: ({$dom, offset, active}) => {
//                 $dom.$subscribe(el => {
//                     if (el && active.$value) {
//                         offset.$value = el.offsetTop
// //                            console.log('offset', el.offsetTop)
//                     }
//                 })
//             },
            currentItemPosition: ({current, $dom, currentOffset, currentHeight}) => {
                current.$subscribe(next => {
                    const el = $dom.$value
                    if (el && next) {
//                            console.log('---- current offset', $dom.$value.offsetTop, currentOffset.$value)
                        currentOffset.$value = el.offsetTop
                        currentHeight.$value = el.getBoundingClientRect().height
//                            console.log(currentOffset)
                    }
                })
            }
        }
    })
}