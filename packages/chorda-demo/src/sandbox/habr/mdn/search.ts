import { BasicDomEvents, Blueprint, HtmlScope, Infer, mix } from "@chorda/core"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { watch } from "../../../utils"
import { DropdownInput, DropdownInputPropsType, DropdownItem, DropdownItemPropsType, FaIcon, TextInput } from "../../../helpers"
import { HighlightedItem } from "./highlighted"
import { withAutoFocus } from "./utils"


export type MdnSearchItem = {
    title: string
    url: string
}

export type MdnSearchScope = {
    query: string
    suggest: MdnSearchItem[]
    highlighted: Blueprint<unknown>[]
    textSelection: number[]
}



export const MdnSearch = () : Infer.Blueprint<MdnSearchScope> => {
    return DropdownInput(<DropdownInputPropsType<MdnSearchItem, MdnSearchScope&HtmlScope>>{
        icon: FaIcon({icon: faSearch}),
        value$: $ => $.query,
        items$: $ => $.suggest,
        itemAs: DropdownItem(<DropdownItemPropsType<MdnSearchItem, MdnSearchScope>>{
            text$: $ => $.item.url,
            as: HighlightedItem({
                text$: $ => $.item.title,
                query$: $ => $.query,
            })
        }),
        inputAs: withAutoFocus(TextInput({
            placeholder: 'Go ahead. Type your search...',
            as: {
                joints: {
                    updateTextSelection: ({$dom, textSelection}) => {
    
                        watch(([el]) => {
                            if (el) {
                                const inputEl = el as HTMLInputElement
                                inputEl.selectionStart = textSelection[0]
                                inputEl.selectionEnd = textSelection[1]
                            }
                        }, [$dom])
    
                    }
                }    
            }
        })),
        trigger: {
            styles: {
                width: 300
            }
        },
        as: {
            css: 'dropdown-menu-auto',
        }
    })
}