import { Blueprint, computable, HtmlBlueprint, Infer, Injector, mix, observable } from "@chorda/core"
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons"
import { Card, LevelLayout, Link, Tab, Tabs, Title } from "chorda-bulma"
import { Selected } from "../App"
import { Custom, withHtml } from "../utils"
import { Action } from "./Action"
import { CodeBox } from "./CodeBox"
import { FaIcon } from "./FaIcon"



const withSelectedComponents = <T>(props: Blueprint<T&{selected: {[key: string]: any}}>) : Infer.Blueprint<T> => {
    return props
}



type ExampleBoxScope = {
    title: string
    isShowCode: boolean
    activeFile: string
}

type ExampleBoxProps<T> = {
    title?: string
    title$?: Injector<T>
    content?: HtmlBlueprint<T>
    description?: string
    code?: string
    files?: ExampleFile[]
    link?: string
}

type ExampleFile = {
    name: string
    code: string
} 



export const Example = <T>(props: ExampleBoxProps<T&ExampleBoxScope>) : HtmlBlueprint<T> => {
    
    const files : ExampleFile[] = props.files || [{name: 'index.ts', code: props.code}]

    return mix<ExampleBoxScope>(Card, {
        css: 'example-box',
        components: {
            header: false,
            customHeader: true,
            content: true,
            code: false
        },
        templates: {
            customHeader: Custom({
                weight: -10,
                css: 'example-box-header card-header',
                as: LevelLayout([{
                    title: Title({
                        css: 'example-box-title',
                        size: 'is-6',
                        text$: (scope) => scope.title,
                        as: {
                            templates: {
                                externalLink: props.link && FaIcon({
                                    icon: faExternalLinkAlt,
                                    as: Link({
                                        link: props.link,
                                        text$: () => null,
                                        target: '_blank'
                                    })
                                })
                            }
                        }
                    })
                }, {
                    tools: {
                        css: 'example-box-tools',
                        templates: {
                            code: Action({
                                css: 'is-muted',
                                icon: 'fas fa-code',
                                onClick: (e, {isShowCode}) => {
                                    isShowCode.$value = !isShowCode.$value
                                }
                             })
                        }                       
                    }
                }])
            }),
            content: {
                css: 'example-box-content',
                templates: {
                    content: props.content
                }
            },
            description: {
                css: 'example-box-description',
                weight: -10,
                templates: {
                    content: props.description
                }
            },
            code: {
                weight: -5,
                css: 'code-panel example-box-code',
                templates: {
                    content: withSelectedComponents({
                        templates: files?.reduce((acc, file) => {
                            acc[file.name] = CodeBox({
                                code: file.code
                            })
                            return acc
                        }, {} as any),
                        reactions: {
                            selected: (v) => ({components: v})
                        },
                        injections: {
                            selected: (ctx) => computable(() => {
                                return files?.reduce((acc, file) => {
                                    acc[file.name] = file.name == ctx.activeFile
                                    return acc
                                }, {} as any)
                            }) 
                        },
                    }),
                    tabs: Custom({
                        css: 'code-tabs',
                        weight: -1,
                        as: Tabs({
                            tabs: files?.map(file => Tab({text: file.name, name: file.name})),
                            defaultTab: Tab({
                                active$: (scope) => computable(() => {
                                    return scope.activeFile == scope.name
                                }),
                                onClick: (e, scope) => {
                                    scope.activeFile = scope.name
                                }
                            })
                        }),
                    })
                }
            }        
        },
        reactions: {
            isShowCode: (v) => ({components: {code: v}})
        },
        injections: {
            title: props.title$ || (() => observable(props.title)),
            isShowCode: () => observable(false),
            activeFile: () => observable(files ? files[0].name : null)
//            content: () => observable(props.content)
        }
    })
}
