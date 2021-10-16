import { callable, computable, HtmlScope, Injector, mix, reactive, patch, Scope, Blueprint, HtmlBlueprint, InferBlueprint, HtmlEvents, observable } from "@chorda/core"
import { faAngleDown, faAngleUp, faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { Button } from "chorda-bulma"
import { FaIcon } from "../FaIcon"
import { DropdownMenu } from "./DropdownMenu"
import { DropdownTrigger } from "./DropdownTrigger"
import { MenuItem } from "./utils"
import { watch, withBlueprint, withBounds, withIterableItems, withOuterClick, withPreventDefaultMouseDown, withStopMouseDown } from '../../utils'
import { DropdownItem } from "./DropdownItem"
import { ReactDomEvents } from "@chorda/react"



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
    defaultItem?: Blueprint<T, E>
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

export type DropdownPropsType<I, T=unknown> = DropdownProps<T&DropdownScope<I>, I>

//export type DropdownEvents<I extends MenuItem> = Pick<DropdownScope<I>, 'selectItem'|'cancelSelect'>


//export const Dropdown = <I=MenuItem, T extends Scope=unknown, E=unknown>(props: DropdownProps<T&DropdownScope<I>, I, I, E>) : InferBlueprint<T, E> => {
export const Dropdown = <T extends Scope, E, I=MenuItem>(props: DropdownProps<T&DropdownScope<I>, I, I, E>) : InferBlueprint<T, E> => {
    
    const value2key: ((v: any) => any) = props.valueToKey || ((v) => v)
    const item2value = props.itemToValue || ((itm) => (itm as any).id)
    
    return mix<DropdownScope<any>&HtmlScope, ReactDomEvents>({
        css: 'dropdown',
        templates: {
            trigger: DropdownTrigger({
                content: Button({
                    rightIcon: FaIcon({
                        icon$: ({loading, up}) => computable(() => {
                            return loading.$value ? [faCircleNotch, 'spin'] : (up.$value ? faAngleUp : faAngleDown)
                        })
                    }),
                    text$: (scope) => scope.triggerText,
                    disabled$: (scope) => computable(() => scope.loading == true),
                    onClick: (e, {toggleActive}) => toggleActive(),
                    as: {
                        joints: {
                            autoFocus: ({$dom, active}) => {

                                watch(() => {
                                    if ($dom.$value && active.$value) {
                                        $dom.$value.focus()
                                    }
                                }, [$dom, active])

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
                                updateOffsets: ({$dom, $engine, $renderer, active, isSelected, isCurrent}) => {
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
                                                $engine.publish($renderer.task(() => {
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
            active: (v) => patch({classes: {'is-active': v}}),
            up: (v) => patch({classes: {'is-up': v}}),
        }
    },
    props?.as,
    props && withStopMouseDown(withBounds({
        initials: {
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
            $dom: {
                keyDown: (e, {active, nextCurrent, prevCurrent, selectItem, current, cancelActive}) => {
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
                    
                }
            }
        },
        templates: {
            trigger: props.trigger,
            menu: DropdownMenu({
                content: {
                    defaultItem: props.defaultItem
                }
            })
        }
    })))
}
