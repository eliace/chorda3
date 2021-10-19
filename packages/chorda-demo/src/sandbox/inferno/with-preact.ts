import { Blueprint, HtmlEvents, HtmlScope, InferBlueprint, mix, observable, patch, pipe, Renderable } from "@chorda/core"
import { createPreactRenderer } from "@chorda/preact"
import { watch } from "../../utils"

type PreactScope = {
    infernoRoot: Renderable
    parentEl: HTMLElement
}

const renderer = createPreactRenderer()

export const withPreact = <T, E>(props: Blueprint<T, E>) : InferBlueprint<T, E> => {
    return mix<PreactScope&HtmlScope, HtmlEvents>({
        initials: {
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
                        console.log('preact attach')
                        $renderer.attach(parentEl.$value, infernoRoot.$value)
                    }
                    else {
                        console.log('preact detach')
                        $renderer.detach(infernoRoot.$value)
                    }
                }, [parentEl])
            }
        },
    }, props)
}
