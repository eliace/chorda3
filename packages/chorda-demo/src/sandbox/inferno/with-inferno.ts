import { Blueprint, HtmlEvents, HtmlScope, InferBlueprint, mix, observable, pipe, Renderable, watch } from "@chorda/core"
import { createInfernoRenderer } from "@chorda/inferno"

type InfernoScope = {
    infernoRoot: Renderable
    parentEl: HTMLElement
}

const renderer = createInfernoRenderer()

export const withInferno = <T, E>(props: Blueprint<T, E>) : InferBlueprint<T, E> => {
    return mix<InfernoScope&HtmlScope, HtmlEvents>({
        defaults: {
            infernoRoot: () => observable(null),
//            parentEl: () => observable(null),
//            $engine: () => patcher,
            $renderer: () => renderer,
        },
        injections: {
            parentEl: $ => $.$context.$dom,
            $pipe: $ => pipe($.$patcher, $.$renderer),
        },
        events: {
            afterInit: (html, {infernoRoot}) => {
                infernoRoot.$value = html
            }
        },
        joints: {
            connectToContextDom: ({infernoRoot, parentEl, $renderer}) => {
                
                watch(() => {
                    if (parentEl.$value) {
                        console.log('inferno attach')
                        $renderer.attach(parentEl.$value, infernoRoot.$value)
                    }
                    else {
                        console.log('inferno detach')
                        $renderer.detach(infernoRoot.$value)
                    }
                }, [parentEl])
            }
        },
    }, props)
}
