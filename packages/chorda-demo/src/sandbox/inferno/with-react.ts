import { Blueprint, HtmlEvents, HtmlScope, InferBlueprint, mix, observable, pipe, Renderable, watch } from "@chorda/core"
import { createReactRenderer } from "@chorda/react"

type ReactScope = {
    preactRoot: Renderable
    parentEl: HTMLElement
}

const renderer = createReactRenderer()

export const withReact = <T, E>(props: Blueprint<T, E>) : InferBlueprint<T, E> => {
    return mix<ReactScope&HtmlScope, HtmlEvents>({
        defaults: {
            preactRoot: () => observable(null),
            $renderer: () => renderer,
        },
        injections: {
            parentEl: $ => $.$context.$dom,
            $pipe: $ => pipe($.$patcher, $.$renderer),
        },
        events: {
            afterInit: (html, {preactRoot}) => {
                preactRoot.$value = html
            }
        },
        joints: {
            connectToContextDom: ({preactRoot, parentEl, $renderer}) => {
                
                watch(() => {
                    if (parentEl.$value) {
                        console.log('react attach')
                        $renderer.attach(parentEl.$value, preactRoot.$value)
                    }
                    else {
                        console.log('react detach')
                        $renderer.detach(preactRoot.$value)
                    }
                }, [parentEl])
            }
        },
    }, props)
}
