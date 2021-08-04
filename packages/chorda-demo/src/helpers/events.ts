import { Blueprint, callable, HtmlScope, InferBlueprint, Joint, mix, observable } from "@chorda/core"
import { DomEvents } from "@chorda/react"
import { watch } from "../utils"


export type OuterClickScope = {
    onOuterClick: () => void
}

export type OuterClickEvents = Pick<OuterClickScope, 'onOuterClick'>

export type OuterClickEvent = {
    outerClick?: () => void
}


export const onOuterClick: Joint<HtmlScope> = ({$dom}) => {

    $dom.$event('outerClick')

    const listener = () => {
        $dom.$emit('outerClick')
    }
    document.addEventListener('mousedown', listener)
    return () => {
        document.removeEventListener('mousedown', listener)
    }
}




export const withOuterClick = <T, E>(props: Blueprint<T&OuterClickScope, E&OuterClickEvents>) : InferBlueprint<T, E> => {
    return mix<OuterClickScope>({
        initials: {
            onOuterClick: () => callable(null)
        },
        joints: {
            initOuterClick: ({onOuterClick}) => {
                // const listener = () => {
                //     onOuterClick()
                // }
                document.addEventListener('mousedown', onOuterClick)
                return () => {
                    document.removeEventListener('mousedown', onOuterClick)
                }            
            }
        }
    }, props)
}


export const withStopMouseDown = <T, E>(props: Blueprint<T, E>, preventDefault?: boolean) : InferBlueprint<T, E> => {
    return mix<HtmlScope>({
        joints: {
            initStopMouseDown: ({$dom}) => {
                $dom.$subscribe((el) => {
                    el?.addEventListener('mousedown', (e: MouseEvent) => {
                        e.stopPropagation()
                        preventDefault && e.preventDefault() // если поставить, то будет слетать фокус на input
                        return false
                    })
                })                            
            }
        }
    }, props)
}

export const withPreventDefaultMouseDown = <T, E>(props: Blueprint<T, E>) : InferBlueprint<T, E> => {
    return withStopMouseDown(props, true)
}


export const stopMouseDown: Joint<HtmlScope> = ({$dom}) => {
    $dom.$subscribe((el) => {
        el?.addEventListener('mousedown', (e: MouseEvent) => {
            e.stopPropagation()
            //e.preventDefault()
            return false
        })
    })
}

export const autoFocus: Joint<HtmlScope&{autoFocus: boolean}> = ({$dom, $renderer}) => {
    $dom.$subscribe(el => {
        if (el) {
            $renderer.scheduleTask(() => {
                el.focus()
            })
        }
    })
}


export type BoundsScope = {
    bounds: DOMRect
}

export const withBounds = <T, E>(props: Blueprint<T&BoundsScope, E>) : InferBlueprint<T, E> => {
    return mix<BoundsScope&HtmlScope>({
        initials: {
            bounds: () => observable(null),
        },
        joints: {
            updateBounds: ({$dom, bounds}) => {
                watch(() => {
                    if ($dom.$value) {
                        bounds.$value = $dom.$value.getBoundingClientRect()
                    }
                }, [$dom])
            }
        }
    }, props)
}




export const withMix = <T, E>(...args: Blueprint<T, E>[]) : InferBlueprint<T, E> => {
    return mix.apply(this, args)
}