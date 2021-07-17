import { computable, HtmlBlueprint, iterable, Keyed, mix, observable, patch } from "@chorda/core"
import { ContentLayout, LevelLayout, Tab, Tabs } from "chorda-bulma"
import { AppScope, Coerced, Custom } from "../utils"



type ExampleScope = {
    tabs: ExampleTab[]
    title: string
    selected: string
    components: Keyed<HtmlBlueprint>
}

type ExampleTab<T=unknown> = {
    title: string,
    name: string,
    link: string,
    example: HtmlBlueprint<T>
}


type ExamplePanelProps<T> = {
    title: string,
    tabs: ExampleTab<T>[]
}

export const ExamplePanel = <T>(props: ExamplePanelProps<T&ExampleScope>) : HtmlBlueprint<T> => {
    return mix<ExampleScope&AppScope>({
        injectors: {
            tabs: () => observable(props.tabs, (v: ExampleTab) => v.name),
            title: () => observable(props.title),
            selected: (scope) => scope.router.route.params.element,
            components: (scope) => computable(() => {
                const components = scope.tabs.reduce((acc: any, tab: ExampleTab) => {
                    acc[tab.name] = tab.name == scope.selected
                    return acc
                }, {})
                return components
            })
        },
        css: 'example-panel',
        templates: {
            header: Custom({
                css: 'example-header', 
                as: LevelLayout([{
                    title: ContentLayout({
                        css: 'example-title',
                        templates: {
                            content: {
                                tag: 'h4',
                                reactors: {
                                    title: (v) => patch({text: v})
                                }
                            }
                        }
                    })
                }, {
                    tabs: Tabs({
                        tabs$: (scope) => iterable(scope.tabs),
                        defaultTab: Coerced<{tab: ExampleTab, __it: ExampleTab}, ExampleScope>({
                            as: Tab({
                                text$: (scope) => scope.tab.title,
                                link$: (scope) => scope.tab.link,
                                active$: (scope) => computable(() => {
//                                    console.log('is tab active', scope.selected, scope.tab.name)
                                    return scope.selected == scope.tab.name
                                })
                            }),
                            injectors: {
                                tab: (scope) => scope.__it// _next(scope.tabs) //next(scope, 'tabs')
                            }
                        })
                    })
                }])
            }),
            content: {
                css: 'example-content',
                components: false,
                reactors: {
                    tabs: (v) => {
                        const templates = v.reduce((acc, tab) => {
                            acc[tab.name] = tab.example
                            return acc
                        }, {} as Keyed<HtmlBlueprint>)
                        patch({templates})
                    },
                    components: (v) => {
                        patch({components: v})
                    }
                }
            }
        }
    })
}
