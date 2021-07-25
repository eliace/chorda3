import { HtmlScope, Joint } from "@chorda/core"
import { DomEvents } from "@chorda/react"


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