import { computable, InferBlueprint, Injector, mix, observable } from "@chorda/core"
import { api, Article, Comment, User } from "../api"
import { AppScope } from "../App"
import { AuthScope } from "../auth"
import { ArticleMeta, TagList } from "../components"
import { Blank, Block, Button, Column, Container, H1, H2, Icon, Link, Paragraph, Row, Text } from "../elements"
import { RouterScope } from "../router"
import { componentGroups, Icons } from "../utils"


type ArticleScope = {
    article: Article
    comments: Comment[]
    follow: (username: string) => void
    unfollow: (username: string) => void
    favorite: (slug: string) => void
    unfavorite: (slug: string) => void
    deleteArticle: (slug: string) => void
}



const FollowButton = () : InferBlueprint<ArticleScope> => {
    return Button({
        css: 'btn-sm btn-outline-secondary',
        icon: Icon({
            icon: Icons.PlusRound
        }),
        text$: $ => computable(() => {
            return ` Follow ${$.article.author.username}`
        }),
        onClick: (e, {follow, article}) => {
            follow(article.author.username)
        }
    })
}

const UnfollowButton = () : InferBlueprint<ArticleScope> => {
    return Button({
        css: 'btn-sm btn-secondary',
        icon: Icon({
            icon: Icons.MinusRound
        }),
        text$: $ => computable(() => {
            return ` Unfollow ${$.article.author.username}`
        }),
        onClick: (e, {unfollow, article}) => {
            unfollow(article.author.username)
        }
    })
}

const FavoriteButton = () : InferBlueprint<ArticleScope> => {
    return Button({
        order: 10,
        css: 'btn-sm btn-outline-primary',
        icon: Icon({
            icon: Icons.Heart
        }),
        addons: {
            counter: Text({
                as: { tag: 'span', weight: 10 },
                css: 'counter',
                text$: $ => computable(() => {
                    return `(${$.article.favoritesCount})`
                })
            })
        },
        text: ' Favorite Article ',
        onClick: (e, {article, favorite}) => {
            favorite(article.slug)
        }
    })
}

const UnfavoriteButton = () : InferBlueprint<ArticleScope> => {
    return Button({
        order: 10,
        css: 'btn-sm btn-primary',
        icon: Icon({
            icon: Icons.Heart
        }),
        addons: {
            counter: Text({
                as: { tag: 'span', weight: 10 },
                css: 'counter',
                text$: $ => computable(() => {
                    return `(${$.article.favoritesCount})`
                })
            })
        },
        text: ' Unfavorite Article ',
        onClick: (e, {article, unfavorite}) => {
            unfavorite(article.slug)
        }
    })
}


type ArticleActionsProps<T> = {
    article$: Injector<T>
}

const ArticleActions = <T>(props: ArticleActionsProps<T>) : InferBlueprint<T&AuthScope> => {
    return ArticleMeta({
        article$: props.article$,
        addons: componentGroups([
            {follow: FollowButton},
            {unfollow: UnfollowButton},
            {blank: Blank},
            {favorite: FavoriteButton},
            {unfavorite: UnfavoriteButton},
        ]),
        addons$: $ => computable(() => {
            const isFollowing = $.article.author.following
            const isFavorited = $.article.favorited
            const isOwn = $.article.author.username == $.user.username
            return {
                follow: !isFollowing && !isOwn,
                unfollow: !!isFollowing && !isOwn,
                favorite: !isFavorited && !isOwn,
                unfavorite: !!isFavorited && !isOwn,
                edit: isOwn,
                delete: isOwn,
                blank: true,
            }
        })
    })
}



export const ArticlePage = () : InferBlueprint<ArticleScope&AppScope&RouterScope&AuthScope> => {
    return {
        css: 'article-page',
        templates: {
            banner: Block({
                css: 'banner',
                content: Block({
                    css: 'container',
                    items: [
                        Text({
                            as: H1,
                            text$: $ => $.article.title
                        }),
                        ArticleActions({
                            article$: $ => $.$context.article,
                        })
                    ]
                })
            }),
            container: Block({
                css: 'page container',
                addons: {
                    message: Row({
                        css: 'article-content',
                        columns: [
                            Column({
                                css: 'col-md-12',
                                items: [
                                    Text({
                                        as: Paragraph,
                                        text$: $ => $.article.body
                                    }),
                                    Text({
                                        as: H2,
                                        id: 'introducing-ionic',
                                        text$: $ => $.article.description
                                    }),
                                    TagList({
                                        itemAs: {
                                            css: 'tag-default tag-pill tag-outline'
                                        },
                                        items$: $ => $.article.tagList
                                    })
                                ]
                            })
                        ]
                    }),
                    divider: {
                        tag: 'hr'
                    },
                    actions: Block({
                        css: 'article-actions',
                        content: ArticleActions({
                            article$: $ => $.$context.article,
                        })
                    }),
                    comments: Row({
                        columns: [
                            Block({
                                css: 'col-xs-12 col-md-8 offset-md-2',
                                addons: {
                                    comment: {/**/},
                                    noAuth: Block({
                                        items: [
                                            Link({text: 'Sign in', href: '#'}),
                                            Blank(' or '),
                                            Link({text: 'sign up', href: '#'}),
                                            Blank(' to add comments on this article. ')
                                        ]
                                    })
                
                                },
                                addons$: $ => computable(() => {
                                    return {
                                        comment: $.isAuth,
                                        noAuth: !$.isAuth,
                                    }
                                })
                            })
                        ]
                    }),
                },
            })
        },
        defaults: {
            article: () => observable({author: {}} as Article),
            comments: () => observable(null),
        },
        joints: {
            autoLoad: ({route, article, comments}) => {

                api.getArticle(route.route.params['slug'])
                    .then(data => {
                        article.$value = data
                    })
                api.getComments(route.route.params['slug'])
                    .then(data => {
                        comments.$value = data
                    })

            }
        }
    }
}