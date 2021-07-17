import { HtmlScope, Joint } from "@chorda/core"


export type OuterClickEvent = {
    outerClick: void
}


export const onOuterClick: Joint<HtmlScope> = (v, {$dom}) => {

    $dom.$event('outerClick')

    const listener = () => {
        $dom.$emit('outerClick')
    }
    document.addEventListener('mousedown', listener)
    return () => {
        document.removeEventListener('mousedown', listener)
    }
}


export const stopMouseDown: Joint<HtmlScope> = (v, {$dom}) => {
    $dom.$subscribe((el) => {
        el?.addEventListener('mousedown', (e: MouseEvent) => {
            e.stopPropagation()
            //e.preventDefault()
            return false
        })
    })
}

export const autoFocus: Joint<HtmlScope&{autoFocus: boolean}> = (v, {$dom, $renderer}) => {
    $dom.$subscribe(el => {
        if (el) {
            $renderer.scheduleTask(() => {
                el.focus()
            })
        }
    })
}