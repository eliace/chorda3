import { Blueprint, callable, computable, InferBlueprint, Listener, mix } from "@chorda/core";
import { TagList } from ".";
import { Article } from "../api";
import { Button, H1, Icon, Link, Paragraph, Span, Tag, Text, UL } from "../elements";
import { Icons } from "../utils";
import { ArticleMeta } from "./ArticleMeta";



type ArticleScope = Article

type ArticleActions = {
    onFavorite: () => void
}

type ArticleProps<T, E> = {
    meta?: Blueprint<T, E>
    previewLink?: Blueprint<T, E>
    text?: string
    onFavorite?: Listener<T, void>
}

export type ArticlePropsType<T, E> = ArticleProps<T&ArticleScope&ArticleActions, E>

export const ArticlePreview = <T, E>(props: ArticlePropsType<T, E>) : InferBlueprint<T, E> => {
    return mix<ArticleScope&ArticleActions, ArticleActions>({
        css: 'article-preview',
        templates: {
            meta: ArticleMeta({
                addons: {
                    button: Button({
                        css: 'btn-sm pull-xs-right',
                        icon: Icon({
                            icon: Icons.Heart
                        }),
                        text$: $ => computable(() => {
                            return ' ' + $.favoritesCount
                        }),
                        as: {
                            reactions: {
                                favorited: (v) => ({
                                    classes: {
                                        'btn-outline-primary': !v,
                                        'btn-primary': v,
                                    }
                                })
                            }
                        },
                        onClick: (e, {onFavorite}) => onFavorite(),
                    })
                },
                article$: $ => $ // FIXME scope is not reactive
            }),
            previewLink: Link({
                css: 'preview-link',
                href$: $ => computable(() => {
                    return '#/article/'+$.slug
                }),
                as: {
                    templates: {
                        title: Text({
                            as: H1,
                            text$: $ => $.title
                        }),
                        description: Text({
                            as: Paragraph,
                            text$: $ => $.description
                        }),
                        more: Text({
                            as: Span,
                            text: 'Read more...'
                        }),
                        tags: TagList({
                            as: UL,
                            itemAs: Tag({
                                css: 'tag-default tag-pill tag-outline'
                            }),
                            items$: $ => $.tagList
                        })
                    }
                }
            })
        }
    }, 
    props && {
        components: {
            meta: props.meta,
            previewLink: props.previewLink,
        },
        text: props.text,
        events: {
            onFavorite: props.onFavorite
        },
        defaults: {
            onFavorite: () => callable(null),
        }
    })
}