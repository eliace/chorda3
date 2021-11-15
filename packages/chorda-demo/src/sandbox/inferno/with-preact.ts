import { Blueprint, HtmlEvents, HtmlScope, InferBlueprint, mix, observable, pipe, Renderable, watch } from "@chorda/core"
import { createPreactRenderer } from "@chorda/preact"

type PreactScope = {
    preactRoot: Renderable
    parentEl: HTMLElement
}

const renderer = createPreactRenderer()

export const withPreact = <T, E>(props: Blueprint<T, E>) : InferBlueprint<T, E> => {
    return mix<PreactScope&HtmlScope, HtmlEvents>({
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
                        console.log('preact attach')
                        $renderer.attach(parentEl.$value, preactRoot.$value)
                    }
                    else {
                        console.log('preact detach')
                        $renderer.detach(preactRoot.$value)
                    }
                }, [parentEl])
            }
        },
    }, props)
}
