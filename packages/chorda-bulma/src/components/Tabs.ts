import { HtmlBlueprint, Injector, Listener, mix, patch } from "@chorda/core"
import { Link, List, ListScope } from "../simple"


//----------------------------------------------
// Tab
//----------------------------------------------


export type TabScope = {
    active: boolean
    text: string
    link: string
    name: string
}

type TabProps<T> = {
    as?: HtmlBlueprint<T>
    active?: boolean
    text?: string
    link?: string
    name?: string
    active$?: Injector<T>
    text$?: Injector<T>
    link$?: Injector<T>
//    name$?: Injector<T>
    onClick?: Listener<T, any>
}

export const Tab = <T>(props: TabProps<T&TabScope>) : HtmlBlueprint<T> => {
    return mix<TabScope&{click?: () => any}>({
        templates: {
            content: Link
        },
        reactors: {
            active: (v) => patch({classes: {'is-active': v}})
        },
    }, {
        injectors: {
            text: props.text$,
            link: props.link$,
            active: props.active$,
            name: () => props.name
        },
        classes: {
            'is-active': props.active
        },
        events: {
            click: props.onClick
        },
        templates: {
            content: Link({
                text: props.text,
                link: props.link
            })
        }
    })
}



//----------------------------------------------
// Tabs
//----------------------------------------------

export type TabsScope = {
    tabs: TabScope
}

type TabsProps<T> = {
    tabs?: HtmlBlueprint<T>[]
    defaultTab?: HtmlBlueprint<T>
    tabs$?: Injector<T>
    centered?: boolean
}

export const Tabs = <T>(props: TabsProps<T&TabsScope>) : HtmlBlueprint<T> => {
    return mix<TabsScope>({
        css: 'tabs',
        templates: {
            content: List
        }
    }, 
    props && {
        classes: {
            'is-centered': props.centered
        },
        injectors: {
            tabs: props.tabs$ || null
        },
        templates: {
            content: List<TabsScope>({
                items$: (scope) => scope.tabs,
                items: props.tabs,
                defaultItem: props.defaultTab
            })
        }
    })
}

