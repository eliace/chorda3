import { HtmlBlueprint, HtmlProps, HtmlScope, mix, Value } from "@chorda/core"

import * as Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-typescript'


const withHighlight = () : HtmlBlueprint<HtmlScope> => {
    return {
        joints: {
            highlight: ({$dom}) => {
                $dom.$subscribe((el) => {
                    el && Prism.highlightAllUnder(el)
                    // el && scope.$renderer.addTask(() => {
                    //     Prism.highlightAllUnder(el)
                    // })
                })
            }
        }
    }
}


type CodeBoxProps = {
    code: string
}

export const CodeBox = <T>(props: CodeBoxProps) : HtmlBlueprint<T> => {
    return mix({
        tag: 'pre',
        templates: {
            content: {
                tag: 'code',
                css: 'language-typescript',    
            }
        }
    }, {
        templates: {
            content: {
                text: String(props.code)
            }
        }
    }, withHighlight)
}
