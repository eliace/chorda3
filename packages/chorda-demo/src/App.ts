import { computable, HtmlBlueprint, HtmlScope, mix, patch } from "@chorda/core";
import { Menu, MenuGroup, MenuItem, MenuItemScope, Navbar, NavbarBrand, NavbarItem } from 'chorda-bulma'
import * as vis from "vis-network";
import * as visds from 'vis-data';
import { Elements } from "./elements";
import { Extended } from "./extended";
import { Sandbox } from "./sandbox";
import { AppScope, buildHtmlTree, Coerced } from "./utils";
import { Components } from "./components";
import { Form } from "./form";
import { CarouselExample } from "./extended/carousel";
import { ListBoxExample } from "./extended/listbox";
import { Route } from "router5";
import countries from "./sandbox/countries";
import { CatApi } from "./sandbox/catapi";
import { SelectExample } from "./sandbox/select";
import { DropdownExample } from "./sandbox/dropdown";
import { ListExample } from "./sandbox/list";
import { InfernoExample } from "./sandbox/inferno";
import { TransitionsExample } from "./sandbox/transitions";
import { NasaExample } from "./sandbox/nasa";

let _network: vis.Network = null
const _nodes = new visds.DataSet<vis.Node>([])
const _edges = new visds.DataSet<vis.Edge>([])


export const routes: Route[] = [
    {name: 'home', path: '/'},
    {name: 'elements', path: '/elements/:element'},
    {name: 'form', path: '/form/:element'},
    {name: 'components', path: '/components/:element'},
//    {name: 'extended', path: '/extended/:element'},
//    {name: 'sandbox', path: '/sandbox/:element'},
    {name: 'carousel', path: '/extended/carousel'},
    {name: 'listbox', path: '/extended/listbox'},
    {name: 'countries', path: '/sandbox/countries'},
    {name: 'catapi', path: '/sandbox/catapi'},
    {name: 'select', path: '/sandbox/select'},
    {name: 'dropdown', path: '/sandbox/dropdown'},
    {name: 'list', path: '/sandbox/list'},
    {name: 'inferno', path: '/sandbox/inferno'},
    {name: 'transitions', path: '/sandbox/transitions'},
    {name: 'nasa', path: '/sandbox/nasa'},
]


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
                                    label: 'Bulma',
                                    items: [
                                        MenuItem({text: 'Elements', name: 'elements', link: '/#/elements/box'}),
                                        MenuItem({text: 'Form', name: 'form', link: '/#/form/field'}),
                                        MenuItem({text: 'Components', name: 'components', link: '/#/components/breadcrumb'}),
                                    ],
                                    defaultItem: MenuItem({
                                        active$: (scope) => computable(() => {
                                            return scope.name == scope.router.route.name
                                        }) 
                                    })
                                }),
                                MenuGroup({
                                    label: 'Components+',
                                    items: [
//                                        MenuItem({text: 'Components+', name: 'extended', link: '/#/extended/carousel'}),
                                        MenuItem({text: 'Carousel', name: 'carousel', link: '/#/extended/carousel'}),
                                        MenuItem({text: 'ListBox', name: 'listbox', link: '/#/extended/listbox'}),
                                    ],
                                    defaultItem: MenuItem({
                                        active$: (scope) => computable(() => {
                                            return scope.name == scope.router.route.name
                                        }) 
                                    })
                                }),
                                MenuGroup({
                                    label: 'Sandbox',
                                    items: [
//                                        MenuItem({text: 'Sandbox', name: 'sandbox', link: '/#/sandbox/countries'}),        
                                        MenuItem({text: 'Countries', name: 'countries', link: '/#/sandbox/countries'}),        
                                        MenuItem({text: 'Cats', name: 'catapi', link: '/#/sandbox/catapi'}),        
                                        MenuItem({text: 'Select', name: 'select', link: '/#/sandbox/select'}),        
                                        MenuItem({text: 'Dropdown', name: 'dropdown', link: '/#/sandbox/dropdown'}),        
//                                        MenuItem({text: 'List', name: 'list', link: '/#/sandbox/list'}),        
                                        MenuItem({text: 'Renderer', name: 'inferno', link: '/#/sandbox/inferno'}),        
                                        MenuItem({text: 'Transitions', name: 'transitions', link: '/#/sandbox/transitions'}),        
                                        MenuItem({text: 'Nasa', name: 'nasa', link: '/#/sandbox/nasa'}),        
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
                                        carousel: v == 'carousel',
                                        listbox: v == 'listbox',                                        
                                        countries: v == 'countries',           
                                        catapi: v == 'catapi',
                                        select: v == 'select',
                                        dropdown: v == 'dropdown',
                                        list: v == 'list',
                                        inferno: v == 'inferno',
                                        transitions: v == 'transitions',
                                        nasa: v == 'nasa',
                                    }
                                })
                            },
                            components: false,
                            templates: {
                                elements: Elements,
                                sandbox: Sandbox,
                                extended: Extended,
                                components: Components,
                                form: Form,
                                carousel: CarouselExample,
                                listbox: ListBoxExample,
                                countries: countries,
                                catapi: CatApi,
                                select: SelectExample,
                                dropdown: DropdownExample,
                                list: ListExample,
                                inferno: InfernoExample,
                                transitions: TransitionsExample,
                                nasa: NasaExample,
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
                                updateNetwork: ({$patcher, $renderer}) => {
                                    $patcher.publish($renderer.task(() => {
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