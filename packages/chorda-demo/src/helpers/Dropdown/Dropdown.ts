import { callable, computable, HtmlScope, Injector, mix, reactive, patch, Scope, Blueprint, HtmlBlueprint, InferBlueprint, HtmlEvents, observable, BasicDomEvents } from "@chorda/core"
import { faAngleDown, faAngleUp, faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { Button, ButtonPropsType } from "chorda-bulma"
import { FaIcon } from "../FaIcon"
import { DropdownMenu } from "./DropdownMenu"
import { DropdownTrigger } from "./DropdownTrigger"
import { MenuItem } from "./utils"
import { watch, withBlueprint, withBounds, withIterableItems, withOuterClick, withOuterKeydown, withPreventDefaultMouseDown, withStopMouseDown } from '../../utils'
import { DropdownItem } from "./DropdownItem"



export type DropdownScope<I, V=I> = {
    items: I[]
    active: boolean
    selected: I
    triggerText: string
    value: V
    // selectedOffset: number
    current: I
    // currentOffset: number
    // currentHeight: number
    loading: boolean
    menuBounds: DOMRect
    dropdownBounds: DOMRect
    up: boolean
    // actions
    selectItem: (itm: I) => I
    cancelActive: () => void
    toggleActive: () => void
    nextCurrent: () => void
    prevCurrent: () => void
}

export type DropdownProps<T, I, V=any, E=unknown> = {
    items$?: Injector<T>
    active$?: Injector<T>
    active?: boolean
    itemAs?: Blueprint<T, E>
    text$?: Injector<T>
    value$?: Injector<T>
    trigger?: Blueprint<T, E>
    autoFocus?: boolean
    as?: Blueprint<T, E>
    loading$?: Injector<T>
    maxHeight?: number
    valueToKey?: (value: V) => any
    itemToValue?: (item: I) => V
    up?: boolean
}

export type DropdownPropsType<I, T=unknown, V=any> = DropdownProps<T&DropdownScope<I>, I, V>

//export type DropdownEvents<I extends MenuItem> = Pick<DropdownScope<I>, 'selectItem'|'cancelSelect'>


//export const Dropdown = <I=MenuItem, T extends Scope=unknown, E=unknown>(props: DropdownProps<T&DropdownScope<I>, I, I, E>) : InferBlueprint<T, E> => {
export const Dropdown = <T extends Scope, E, I=MenuItem>(props: DropdownProps<T&DropdownScope<I>, I, I, E>) : InferBlueprint<T, E> => {
    
    const value2key: ((v: any) => any) = props.valueToKey || ((v) => v)
    const item2value = props.itemToValue || ((itm) => (itm as any).id)
    
    return mix<DropdownScope<any>&HtmlScope, BasicDomEvents>({
        css: 'dropdown',
        templates: {
            trigger: DropdownTrigger({
                content: Button(<ButtonPropsType<DropdownScope<any>&HtmlScope&{isDropdownActive: boolean}>>{
                    rightIcon: FaIcon({
                        icon$: ({loading, up}) => computable(() => {
                            return loading.$value ? [faCircleNotch, 'spin'] : (up.$value ? faAngleUp : faAngleDown)
                        })
                    }),
                    text$: (scope) => scope.triggerText,
                    disabled$: (scope) => computable(() => scope.loading == true),
                    onClick: (e, {toggleActive}) => toggleActive(),
                    as: {
                        injections: {
                            isDropdownActive: $ => $.$context.active,
                        },
                        joints: {
                            autoFocus: ({$dom, isDropdownActive}) => {

                                watch(([el, isActive]) => {
                                    if (el && isActive) {
                                        el.focus()
                                    }
                                }, [$dom, isDropdownActive])

                            },
                        }
                    }
                })
            }),
            menu: withPreventDefaultMouseDown(withOuterClick(withBounds(DropdownMenu({
                content: withIterableItems<MenuItem[], DropdownScope<MenuItem>&HtmlScope>({
                    injections: {
                        items: (scope) => scope.$context.items,
                    },
                    defaultItem: DropdownItem({
                        isSelected$: ({selected, item}) => computable(() => selected.id == item.id),
                        isCurrent$: ({current, item}) => computable(() => current.id == item.id),
                        text$: ({item}) => item.name,
                        onClick: (e, {selectItem, item}) => selectItem(item),
                        as: {
                            joints: {
                                updateOffsets: ({$dom, $patcher, $renderer, active, isSelected, isCurrent}) => {
                                    // watch(() => {
                                    //     if ($dom.$value && isSelected.$value && active.$value) {
                                    //         $engine.pipeTask(() => {
                                    //             $dom.$value.scrollIntoView({block: 'center'})
                                    //         })
                                    //     }
                                    // }, [$dom, active])
                                    watch(() => {
                                        if ($dom.$value && isCurrent.$value) {
                                            //  FIXME костыль для обработки в ближайшем rAF
                                            if ($renderer.isProcessing) {
                                                $dom.$value.scrollIntoView({block: 'nearest'})
                                            }
                                            else {
                                                $patcher.publish($renderer.task(() => {
                                                    $dom.$value.scrollIntoView({block: 'nearest'})
                                                }))
                                            }
                                        }
                                    }, [$dom, isCurrent])

                                }
                            }
                        },
                        //offsetTop$: ({selectedOffset}) => selectedOffset,
                    }),
                }),
                as: {
                    injections: {
                        bounds: ({menuBounds}) => menuBounds,
                    },
                    events: {
                        onOuterClick: (e, {cancelActive}) => cancelActive()
                    }
                }
            }))))
        },
        reactions: {
            active: (v) => ({classes: {'is-active': v}}),
            up: (v) => ({classes: {'is-up': v}}),
        }
    },
    props?.as,
    props && withStopMouseDown(withBounds(withOuterKeydown({
        defaults: {
            value: () => observable(null),
            selected: () => observable(null),
            items: () => observable([]),
            active: () => reactive(props.active),
            current: () => reactive(null),
            loading: () => reactive(false),
            menuBounds: () => reactive(null),
            dropdownBounds: () => observable(null),
            up: () => reactive(props.up || false),
        },
        injections: {
            items: props.items$,
            active: props.active$,
            triggerText: props.text$ || (({selected}) => selected.name),
            value: props.value$,
            loading: props.loading$,
            bounds: ({dropdownBounds}) => dropdownBounds,
            toggleActive: ({active}) => callable(() => {
                active.$value = !active.$value
            }),
            cancelActive: ({active}) => callable(() => {
                active.$value = false
            }),
            selectItem: ({value, cancelActive}) => callable((itm) => {
                cancelActive()
                value.$value = item2value(itm)
                return itm
            }),
            nextCurrent: ({items, current}) => callable(() => {
                let i = items.indexOf(current.$value)
                if (i == items.length - 1) {
                    i = -1
                }
                current.$value = items[i+1]
            }),
            prevCurrent: ({items, current}) => callable(() => {
                let i = items.indexOf(current.$value)
                if (i == 0) {
                    i = items.length
                }
                current.$value = items[i-1]
            })
        },
        joints:{
            initDropdown: ({value, $dom, items, selected, active, current}) => {

                watch(() => {
//                    console.log('watch value and items', value.$value)
                    items.forEach(itm => {
                        if (itm.id == value2key(value.$value)) {
                            selected.$value = itm
                        }
                    })
                }, [value, items])

                watch(() => {
                    if (active.$value) {
                        current.$value = selected
                    }
                }, [active/*, selected*/])

            },
        },
        events: {
            onOuterKeyDown: (e, {active, nextCurrent, prevCurrent, selectItem, current, cancelActive}) => {
                if (active.$value) {
                    if (e.code == 'ArrowDown') {
                        nextCurrent()
                    }
                    else if (e.code == 'ArrowUp') {
                        prevCurrent()
                    }
                    else if (e.code == 'Enter' || e.code == 'Space') {
                        selectItem(current)
                    }
                    else if (e.code == 'Escape') {
                        cancelActive()
                    }
                    else {
                        return
                    }
                    e.preventDefault()
                    return false    
                }
            },
            // $dom: {
            //     keydown: (e, {active, nextCurrent, prevCurrent, selectItem, current, cancelActive}) => {
            //         if (active.$value) {
            //             if (e.code == 'ArrowDown') {
            //                 nextCurrent()
            //             }
            //             else if (e.code == 'ArrowUp') {
            //                 prevCurrent()
            //             }
            //             else if (e.code == 'Enter' || e.code == 'Space') {
            //                 selectItem(current)
            //             }
            //             else if (e.code == 'Escape') {
            //                 cancelActive()
            //             }
            //             else {
            //                 return
            //             }
            //             e.preventDefault()
            //             return false    
            //         }
                    
            //     }
            // }
        },
        templates: {
            trigger: props.trigger,
            menu: DropdownMenu({
                content: {
                    defaultItem: props.itemAs
                }
            })
        }
    }))))
}
