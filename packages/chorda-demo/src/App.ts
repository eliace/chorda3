import { computable, HtmlBlueprint, HtmlScope, mix, patch } from "@chorda/core";
import { Menu, MenuGroup, MenuItem, MenuItemScope, Navbar, NavbarBrand, NavbarItem } from 'chorda-bulma'
import * as vis from "vis-network";
import * as visds from 'vis-data';
import { Elements } from "./elements";
import { Extended } from "./extended";
import { Sandbox } from "./sandbox";
import { AppScope, buildHtmlTree, Coerced } from "./utils";

let _network: vis.Network = null
const _nodes = new visds.DataSet<vis.Node>([])
const _edges = new visds.DataSet<vis.Edge>([])


export const App = () : HtmlBlueprint<AppScope> => {
    return {
        css: 'app',
        templates: {
            navbar: Navbar({
                css: 'is-dark is-fixed-top',
                brand: NavbarBrand({
                    items: [
                        Coerced({
                            as: NavbarItem,
                            templates: {
                                content: {
                                    text: 'Chorda',
                                    css: 'chorda-logo has-text-weight-semibold is-uppercase'                        
                                }    
                            }
                        })
                    ]
                })
            }),
            main: Main({
                content: AppLayout({
                    menu: {
                        column: 'is-one-fifth',
                        as: Menu({
                            groups: [
                                MenuGroup({
                                    label: 'Learn',
                                    items: [
                                        MenuItem({text: 'Getting started'}),
                                        MenuItem({text: 'Options'}),
                                        MenuItem({text: 'Components and Items'})
                                    ]
                                }),
                                MenuGroup({
                                    label: 'Demo',
                                    items: [
                                        MenuItem({text: 'Elements', name: 'elements', link: '/#/elements/box'}),
                                        MenuItem({text: 'Form', name: 'form', link: '/#/form/field'}),
                                        MenuItem({text: 'Components', name: 'components', link: '/#/components/breadcrumb'}),
                                        MenuItem({text: 'Components+', name: 'extended', link: '/#/extended/carousel'}),
                                        MenuItem({text: 'Sandbox', name: 'sandbox', link: '/#/sandbox/countries'}),        
                                    ],
                                    defaultItem: MenuItem({
                                        active$: (scope) => computable(() => {
                                            return scope.name == scope.router.route.name
                                        }) 
                                    })
                                })
                            ]
                        })
                    },
                    content: {
                        column: 'is-four-fifth',
                        as: Selected({
                            injections: {
                                selected: (scope) => scope.router.route.name
                            },
                            reactions: {
                                selected: (v) => patch({
                                    components: {
                                        elements: v == 'elements',
                                        form: v == 'form',
                                        components: v == 'components',
                                        extended: v == 'extended',
                                        sandbox: v == 'sandbox',
                                    }
                                })
                            },
                            components: false,
                            templates: {
                                elements: Elements,
                                sandbox: Sandbox,
                                extended: Extended,
                            }
                        })
                    },
                    sidepan: {
                        column: 'is-one-fifth',
                        as: Coerced<HtmlScope>({
                            joints: {
                                autoLoad: ({$dom}) => {
                                    $dom.$subscribe(el => {
                                        if (el) {
                                            _network = new vis.Network(el, {}, {
                                                autoResize: true,
                                                layout: {
                                                    improvedLayout: false,
                                                    hierarchical: {
                                                        enabled: true,
                                                        //parentCentralization: false
                                                    }
                                                },
                                                physics: {
                                                    enabled: false
                                                },
                                                interaction: {
                                                    dragNodes: false
                                                }
                                            })
//                                                 _network.cluster({
//                                                     joinCondition: (nodeOptions) => {
// //                                                        console.log(nodeOptions.cid)
//                                                         return nodeOptions.cid != null
//                                                     },
//                                                     processProperties: (clusterOptions, childNodesOptions, childEdgesOptions) => {
//                                                         let level = Number.MAX_VALUE
//                                                         childNodesOptions.forEach(child => {
//                                                             level = Math.min(level, child.level)
//                                                         })
//                                                         clusterOptions.level = level
//                                                         clusterOptions.color = 'red'
//                                                         return clusterOptions
//                                                     }
//                                                 })
                                            _network.setData({nodes: _nodes, edges: _edges})
//                                               _network.clusterByHubsize(20)
                                        }
                                    })
                                },
                                updateNetwork: ({$engine, $renderer}) => {
                                    $engine.publish($renderer.task(() => {
                                        const data: vis.Data = buildHtmlTree()
                                        if (_network) {
                                            const nextPatch = () => {
                                                setTimeout(() => {
                                                    
                                                })
                                            }
                                            setTimeout(() => {
                                                // _nodes.clear()
                                                // _edges.clear()
                                                // _nodes.add(data.nodes as vis.Node[])
                                                // _edges.add(data.edges as vis.Edge[])
//                                                    const scale = _network.getScale()
                                                _network.setData(data)
//                                                    _network.clusterOutliers({
//                                                         joinCondition: (nodeOptions) => {
// //                                                            console.log(nodeOptions.cid)
//                                                             return nodeOptions.cid != null
//                                                         },
//                                                         processProperties: (clusterOptions, childNodesOptions, childEdgesOptions) => {
//                                                             let level = Number.MAX_VALUE
//                                                             childNodesOptions.forEach(child => {
//                                                                 level = Math.min(level, child.level)
//                                                             })
//                                                             clusterOptions.level = level
//                                                             return clusterOptions
//                                                         }
//                                                     })

                                                // _network.moveTo({
                                                //     scale
                                                // })
                                            })
//                                                _network.clusterByHubsize(20)
//                                                _network.stabilize()
                                        }
                                        else {
                                            _nodes.add(data.nodes as vis.Node[])
                                            _edges.add(data.edges as vis.Edge[])
                                        }
//                                             if (_network != null) {
//                                                 _network.setData({
//                                                     }]
//                                                 })
// //                                                _network.redraw()
//                                             }
                                    }))
                                }
                            }
                        })
                    }
                })
            })
        }
    }
}



type SelectedScope = {
    selected: string
}

export const Selected = <T>(props: HtmlBlueprint<T&SelectedScope>) : HtmlBlueprint<T> => {
    return mix(props)
}




type AppLayoutProps<T> = {
    menu?: AppLayoutItemProps<T>
    content?: AppLayoutItemProps<T>
    sidepan?: AppLayoutItemProps<T>
}

const AppLayout = <T>(props: AppLayoutProps<T>) : HtmlBlueprint<T> => {
    return mix({
        css: 'app-layout',
        templates: {
            menu: {
                css: 'app-menu'
            },
            content: {
                css: 'app-content'
            },
            sidepan: {
                css: 'app-sidepan'
            }
        }
    }, props && {
        templates: {
            menu: {
                css: props.menu.column,
                templates: {
                    content: AppLayoutItem(props.menu)
                }
            },
            content: {
                css: props.content.column,
                templates: {
                    content: AppLayoutItem(props.content)
                }
            },
            sidepan: {
                css: props.sidepan.column,
                templates: {
//                    content: AppLayoutItem(props.sidepan)
                }
            },
        }
    })
}


type AppLayoutItemProps<T> = {
    column?: string
    as?: HtmlBlueprint<T>
}

const AppLayoutItem = <T>(props: AppLayoutItemProps<T>) : HtmlBlueprint<T> => {
    return Coerced(props)
}


type MainProps<T> = {
    content: HtmlBlueprint<T>
}

const Main = <T>(props: MainProps<T>) : HtmlBlueprint<T> => {
    return {
        tag: 'main',
        templates: {
            content: props.content
        }
    }
}