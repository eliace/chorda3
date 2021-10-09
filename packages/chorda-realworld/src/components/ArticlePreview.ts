import { Blueprint, computable, InferBlueprint, mix, patch } from "@chorda/core";
import { TagList } from ".";
import { Article } from "../api";
import { Button, Icon, Link, Tag, Text, UL } from "../elements";
import { Icons } from "../utils";
import { ArticleMeta } from "./ArticleMeta";



type ArticleScope = Article

type ArticleProps<T, E> = {
    meta?: Blueprint<T, E>
    previewLink?: Blueprint<T, E>
    text?: string
}

export type ArticlePropsType<T, E> = ArticleProps<T&ArticleScope, E>

export const ArticlePreview = <T, E>(props: ArticlePropsType<T, E>) : InferBlueprint<T, E> => {
    return mix<ArticleScope>({
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
                                favorited: (v) => patch({
                                    classes: {
                                        'btn-outline-primary': !v,
                                        'btn-primary': v
                                    }
                                })
                            }
                        }
                    })
                },
                article$: $ => $
            }),
            previewLink: Link({
                css: 'preview-link',
                href$: $ => computable(() => {
                    return '#/article/'+$.slug
                }),
                as: {
                    templates: {
                        title: Text({
                            as: { tag: 'h1' },
                            text$: $ => $.title
                        }),
                        description: Text({
                            as: { tag: 'p' },
                            text$: $ => $.description
                        }),
                        more: Text({
                            as: { tag: 'span' },
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
            meta: !!props.meta,
            previewLink: !!props.previewLink,
        },
        text: props.text
    })
}