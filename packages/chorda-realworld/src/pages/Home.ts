import { computable, InferBlueprint, observable, passthruLayout, patch } from "@chorda/core"
import { api, Article } from "../api"
import { AppScope } from "../App"
import { AuthScope } from "../auth"
import { TagList, ArticlePreview } from "../components"
import { Block, Column, Columns, Container, Link, List, Nav, NavLink, Tag, Text } from "../elements"
import { componentList } from "../utils"


enum Feeds {
    Your = 'your',
    Global = 'global',
    Selected = 'selected',
}


type HomeScope = {
    tags: {
        list: string[]
        fetching: boolean
    }
    articles: {
        page: number
//        group: string //?
        list: Article[]
        total: number
        fetching: boolean
    }
    selectedTag: string
    selectedGroup: string
    hasTags: boolean
    //isFetchingArticles: boolean
}


export const Home = () : InferBlueprint<HomeScope&AppScope&AuthScope> => {
    return {
        css: 'home-page',
        templates: {
            banner: {
                css: 'banner',
                templates: {
                    content: Container({
                        content: {
                            templates: {
                                logo: {
                                    tag: 'h1',
                                    css: 'logo-font',
                                    text: 'conduit'
                                },
                                text: {
                                    tag: 'p',
                                    text: 'A place to share your knowledge.'
                                }
                            }    
                        }
                    })
                }
            },
            page: Container({
                css: 'page',
                content: Block({
                    content: Columns([
                        Column({
                            css: 'col-md-9',
                            as: {
                                templates: {
                                    tabs: Block({
                                        css: 'feed-toggle',
                                        content: Nav({
                                            css: 'outline-active',
                                            isPills: true,
                                            componentAs: NavLink({
                                                href: '',
                                                active$: $ => computable(() => {
                                                    return $.selectedGroup == $.name
                                                }),
                                            }),
                                            templates: componentList([{
                                                name: Feeds.Your,
                                                as: NavLink({
                                                    text: 'Your Feed',
                                                    name: Feeds.Your
                                                })
                                            }, {
                                                name: Feeds.Global,
                                                as: NavLink({
                                                    text: 'Global Feed',
                                                    name: Feeds.Global
                                                })        
                                            }, {
                                                name: Feeds.Selected,
                                                as: NavLink({
                                                    text: 'Global Feed',
                                                    name: Feeds.Selected,
                                                    as: {
                                                        weight: 10
                                                    },
                                                    text$: $ => computable(() => {
                                                        return '#' + $.selectedTag
                                                    })
                                                })        
                                            }]),
                                            components$: $ => computable(() => {
                                                return {
                                                    [Feeds.Global]: true,
                                                    [Feeds.Your]: $.isAuth,
                                                    [Feeds.Selected]: !!$.selectedTag,
                                                }
                                            })
                                        })
                                    }),
                                    list: List({
                                        project: true,
                                        as: {
                                            layout: passthruLayout
                                        },
                                        items$: $ => $.articles.list,
                                        itemAs: ArticlePreview,
                                    }),
                                    loading: ArticlePreview({
                                        meta: false,
                                        previewLink: false,
                                        text: ' Loading articles... '
                                    }),
                                    noArticles: ArticlePreview({
                                        meta: false,
                                        previewLink: false,
                                        text: ' No articles are here... yet. '    
                                    })
                                },
                                reactions: {
                                    articles: (v) => patch({
                                        components: {
                                            loading: v.fetching,
                                            noArticles: v.list.length == 0 && !v.fetching
                                        }
                                    })
                                }
                            }
                        }),
                        Column({
                            css: 'col-md-3',
                            content: {
                                css: 'sidebar',
                                templates: {
                                    title: {
                                        tag: 'p',
                                        text: 'Popular Tags'
                                    },
                                    tags: TagList({
                                        itemAs: Tag({
                                            as: Link,
                                            href: '',
                                            css: 'tag-default tag-pill',
                                            onClick: (e, {}) => {
                                                e.preventDefault()
                                            }
                                        }),
                                        items$: $ => $.tags.list
                                    }),
                                    preview: {
                                        css: 'post-preview',
                                        text: ' No tags are here... yet.',
                                        weight: 10
                                    }
                                },
                                components: {
                                    title: true,
                                    tags: true,
                                    preview: false,
                                },
                                reactions: {
                                    hasTags: (v) => patch({components: {
                                        preview: !v
                                    }})
                                }
                            }
                        })
                    ])
                })
            })
        },
        initials: {
            tags: () => observable({
                list: [],
                fetching: false
            }),
            articles: () => observable({
                page: 1,
                list: [],
                total: 0,
                fetching: false
            }),
            selectedGroup: () => observable(null),
        },
        injections: {
            hasTags: $ => computable(() => {
                return $.tags.list.length > 0
            })
        },
        joints: {
            autoLoad: ({tags, articles, isAuth: isAuthenticated, selectedGroup}) => {

                const pageSize = 10
                const pageNo = articles.page

                tags.fetching.$value = true
                api.getAllTags()
                    .then(data => {
                        tags.fetching.$value = false
                        tags.list.$value = data.tags
                    })



                articles.fetching.$value = true
                api.getAllArticles({offset: (pageNo-1)*pageSize, limit: pageSize})
                    .then(data => {
                        articles.fetching.$value = false
                        articles.list.$value = data.articles
                        articles.total.$value = data.articlesCount
                    })


                selectedGroup.$value = isAuthenticated.$value ? Feeds.Your : Feeds.Global
            }
        }
    }
}