import { callable, computable, InferBlueprint, observable, passthruLayout, Value, ValueSet } from "@chorda/core"
import { api, Article, Articles } from "../api"
import { ApiResponse } from "../api/rest"
import { AppScope } from "../App"
import { AuthScope } from "../auth"
import { TagList, ArticlePreview } from "../components"
import { Block, Column, Columns, Container, Link, List, Nav, NavLink, Tag, Text } from "../elements"
import { componentList, watch, whenDone, whenWait } from "../utils"


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

type HomeActions = {
    loadFeed: () => void
    loadGlobal: () => void
    loadSelected: () => void
    favorite: (slug: string&Value<string>) => void
}


export const Home = () : InferBlueprint<HomeScope&AppScope&AuthScope&HomeActions> => {
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
                                                onClick: (e, {name, selectedGroup}) => {
                                                    selectedGroup.$value = name
                                                }
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
                                        itemAs: ArticlePreview({
                                            onFavorite: (e, {favorite, slug}) => {
                                                favorite(slug)
                                            }
                                        }),
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
                                    articles: (v) => ({
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
                                            onClick: (e, {item, selectedTag}) => {
                                                e.preventDefault()
                                                selectedTag.$value = item
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
                                    hasTags: (v) => ({components: {
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
            loadFeed: () => callable(null),
            loadGlobal: () => callable(null),
            loadSelected: () => callable(null),
            selectedTag: () => observable(null),
            favorite: () => callable(null),
        },
        injections: {
            hasTags: $ => computable(() => {
                return $.tags.list.length > 0
            })
        },
        joints: {
            autoLoad: ({tags, articles, isAuth, selectedGroup, selectedTag, loadFeed, loadGlobal, loadSelected, favorite}) => {

                const pageSize = 10
                const pageNo = articles.page

                tags.fetching.$value = true
                api.getAllTags()
                    .then(data => {
                        tags.fetching.$value = false
                        tags.list.$value = data.tags
                    })

                loadFeed.$value = () => {
                    articles.list.$value = []
                    return api.getFeed({offset: (pageNo-1)*pageSize, limit: pageSize}).then(data => {
                        articles.list.$value = data.articles
                        articles.total.$value = data.articlesCount
                    })
                }

                loadSelected.$value = () => {
                    articles.list.$value = []
                    return api.getArticlesByTag(selectedTag, {offset: (pageNo-1)*pageSize, limit: pageSize}).then(data => {
                        articles.list.$value = data.articles
                        articles.total.$value = data.articlesCount
                    })
                }

                loadGlobal.$value = () => {
                    articles.list.$value = []
                    return api.getAllArticles({offset: (pageNo-1)*pageSize, limit: pageSize}).then(data => {
                        articles.list.$value = data.articles
                        articles.total.$value = data.articlesCount
                    })
                }

                favorite.$value = (slug) => {
                    const article = articles.list.find(a => a.slug === slug.$value)
                    return article.favorited ? api.unfavorite(slug) : api.favorite(slug)
                }


                const loadArticles = callable(() => {

                    if (selectedGroup.$value == Feeds.Your) {
                        loadFeed()
                    }
                    else if (selectedGroup.$value == Feeds.Global) {
                        loadGlobal()
                    }
                    else if (selectedGroup.$value == Feeds.Selected) {
                        loadSelected()
                    }
                })

                watch(() => {
                    loadArticles()
                }, [selectedGroup, selectedTag])

                watch(() => {
                    if (selectedTag.$value) {
                        selectedGroup.$value = Feeds.Selected
                    }
                }, [selectedTag])

                selectedGroup.$value = isAuth.$value ? Feeds.Your : Feeds.Global
            },
            fetchingArticles: ({loadFeed, loadGlobal, loadSelected, articles}) => {

                whenWait(() => {
                    articles.fetching.$value = true
                }, [loadFeed, loadGlobal, loadSelected])

                whenDone(() => {
                    articles.fetching.$value = false
                }, [loadFeed, loadGlobal, loadSelected])

            }
        }
    }
}