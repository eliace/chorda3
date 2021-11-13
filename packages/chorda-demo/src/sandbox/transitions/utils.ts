import { Blueprint, callable, HtmlScope, InferBlueprint, mix, observable } from "@chorda/core";
import { watch } from "../../utils";


const waitTransitionEnd = (el: Element, callback: Function) => {
    const f = (evt: TransitionEvent) => {
        el.removeEventListener('transitionend', f)
        callback()
    }
    el.addEventListener('transitionend', f)                            
}




export const withShowHide = <T, E>(props: Blueprint<T, E>, showName: string = 'fade', hideName: string = 'fade') : InferBlueprint<T, E> => {
    return mix<HtmlScope&{animation: string}>({
        injections: {
            animation: () => observable(null)
        },
        joints: {
            showHide: ({$dom, $pipe, $renderer, $patcher, animation}) => {

                console.log('join showHide')


                animation.$subscribe((next, prev) => {
                    if (next && prev) {
                        console.log(next, prev)
                        stop()
                    }
                })


                const stop = () => {
                    console.log('stop animation', animation.$value)
                    $dom.$value.classList.remove(showName+'-enter-active', showName+'-enter', hideName+'-leave-active', hideName+'-leave', hideName+'-leave-to')
                }


                const show = (done?: Function) => {

                    animation.$value = 'show'

                    const name = hideName
                    const el = $dom.$value

                    console.log('show prepare', el)

                    el.classList.add(name+'-enter-active', name+'-enter')
                    
                    $patcher.publish($renderer.task(() => {
                        if ($dom.$value == null) {
                            console.warn('dom detached')
                            return
                        }
                        console.log('show begin')
                        el.classList.remove(name+'-enter')    
                        // el.classList.add(name+'-leave-to')
                        $patcher.publish($renderer.task(() => {
                            if ($dom.$value == null) {
                                console.warn('dom detached')
                                return
                            }
                            waitTransitionEnd(el, () => {
                                console.log('show end')
                                $patcher.publish($renderer.task(() => {
                                    el.classList.remove(name+'-enter-active')

                                    if (animation.$value == 'show') {
                                        animation.$value = null
                                    }
                                    done?.()
                                }))
                            })
                        }))
                    }))

                }



                const hide = (done?: Function) => {

                    animation.$value = 'hide'

                    const name = hideName
                    const el = $dom.$value

                    // $pipe.asap($renderer.task(() => {
                    //     el.classList.remove(name+'-leave-active')
                    // }))

                    console.log('hide prepare')

                    el.classList.add(name+'-leave-active', name+'-leave')

//                    const cnt = performance.now()
                    
                    $patcher.publish($renderer.task(() => {
                        if ($dom.$value == null) {
                            console.warn('dom detached')
                            done()
                            return
                        }
                        console.log('hide begin')
                        el.classList.remove(name+'-leave')    
                        el.classList.add(name+'-leave-to')
                        $patcher.publish($renderer.task(() => {
                            if ($dom.$value == null) {
                                console.warn('dom detached')
                                done()
                                return
                            }
                            waitTransitionEnd(el, () => {
                                console.log('hide end')
//                                $engine.publish($renderer.task(() => {
                                    // if ($dom.$value != el) {
                                    //     console.warn(el, $dom.$value)
                                    // }
                                    el.classList.remove(name+'-leave-to', name+'-leave-active')

                                    if (animation.$value == 'hide') {
                                        animation.$value = null
                                    }
                                    done()
                                // }))
                            })
                        }))
                    }))
                }

                watch(() => {
                    if ($dom.$value) {
                        show()
                    }
                }, [$dom])

                return () => {
                    return new Promise((resolve) => {
                        hide(resolve)
                    })
                }
            }
        }
    }, props)
}




type FLIPScope = {
    flip: () => void
}


export const withFLIP = <T, E>(props: Blueprint<T&FLIPScope, E>) : InferBlueprint<T, E> => {
    return mix<HtmlScope&FLIPScope>({
        defaults: {
            flip: () => callable(null)
        },
        joints: {
            flip: ({$dom, flip, $patcher, $renderer}) => {

                const name = 'flip-list'

                flip.$value = () => {

                    const el = $dom.$value

                    const bcr = el.getBoundingClientRect()

                    const style = getComputedStyle(el)
                    const transform = style.getPropertyValue('transform')

//                    console.log('transform', transform)

                    el.style.transform = 'none'

                    $patcher.publish($renderer.task(() => {
                        const bcr2 = el.getBoundingClientRect()

                        const dx = bcr.left - bcr2.left
                        const dy = bcr.top - bcr2.top

                        if (dx == 0 && dy == 0) {
                            el.style.transform = null//transform
                            //task.cancel()
                            return
                        }

                        el.style.transform = 'translate('+dx+'px, '+dy+'px)'
                        el.style.transition = 'none'
                        console.log('[flip] last+invert', dx, dy)

                        $patcher.publish($renderer.task(() => {

                            el.getBoundingClientRect() // force reflow

                            el.classList.add(name+'-move')
                            el.style.transform = ''
                            el.style.transition = '' // включаем переходы обратно
                    
                            waitTransitionEnd(el, () => {

                                el.classList.remove(name+'-move')

                            })
                        }))

                    }))

                }

                watch(() => {

                }, [$dom])

            }
        }
    }, props)
}