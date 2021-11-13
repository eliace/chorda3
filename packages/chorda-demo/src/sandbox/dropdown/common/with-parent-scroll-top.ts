import { Blueprint, HtmlScope, InferBlueprint, mix, observable } from "@chorda/core"
import { watch } from "../../../utils"



type ParentScrollScope = {
    parentScrollTop: number
}

export const withParentScrollTop = <T>(props: Blueprint<T&ParentScrollScope>) : InferBlueprint<T> => {
    return mix<ParentScrollScope&HtmlScope>({
        defaults: {
            parentScrollTop: () => observable(null)
        },
        joints: {
            initParentScrollTop: ({$dom, parentScrollTop}) => {

                let scrollListeners: {target: Element, scroll: number}[] = []

                const listener = (e?: Event) => {
                    if (e) {
                        scrollListeners.forEach(l => {
                            if (l.target == e.target) {
                                l.scroll = (e.target as Element).scrollTop
                            }
                        })    
                    }
                    parentScrollTop.$value = scrollListeners.reduce((scroll, l) => scroll + l.scroll, 0)
                }


                watch(() => {
                    if ($dom.$value) {
                        parents($dom.$value).forEach(el => {
                            el.addEventListener('scroll', listener)
                            scrollListeners.push({target: el, scroll: el.scrollTop})
                        })
                        listener()
                    }
                    else {
                        scrollListeners.forEach(l => {
                            l.target.removeEventListener('scroll', listener)
                        })
                    }
                }, [$dom])
            }
        }
    }, props)
}

const parents = (el: Element) : Element[] => {
    const out: Element[] = []
    let parent = el.parentElement
    while (parent != null) {
        out.push(parent)
        parent = parent.parentElement
    }
    return out
}
