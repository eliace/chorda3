import { Blueprint, HtmlEvents, HtmlScope, InferBlueprint, mix, observable, pipe, Renderable } from "@chorda/core"
import { createAsyncPatcher } from "@chorda/engine"
import { createInfernoRenderer } from "@chorda/inferno"
import { watch } from "../../utils"



const infernoRenderer = createInfernoRenderer()
const infernoPatcher = createAsyncPatcher('inferno')


export const withInferno = <T, E>(props: Blueprint<T, E>) : InferBlueprint<T, E> => {
    return mix<{_root: Renderable, _contextDom: any}&HtmlScope, HtmlEvents>({
        initials: {
            _root: () => observable(null),
            $engine: () => infernoPatcher,
            $renderer: () => infernoRenderer,
        },
        injections: {
            _contextDom: ($) => $.$context.$dom,
            $pipe: ($) => pipe($.$engine, $.$renderer),
        },
        events: {
            afterInit: (html, {_root}) => {
                _root.$value = html
            }
        },
        joints: {
            connectToContextDom: ({_contextDom, _root}) => {
                watch(() => {
                    if (_contextDom.$value) {
                        console.log('inferno attach', _root.$value)
                        infernoRenderer.attach(_contextDom.$value, _root.$value)
                    }
                    else {
                        console.log('inferno detach', _root.$value)
                        infernoRenderer.detach(_root.$value)
                    }
                }, [_contextDom, _root])
            }
        },
    }, props)
}
