import { Blueprint, computable, InferBlueprint, Injector, mix, observable, patch } from "@chorda/core";
import * as dayjs from "dayjs";
import { Article } from "../api";
import { Img, Link, Text } from "../elements";



type ArticleMetaScope = {
    article: Article
    addons: {[key: string]: Blueprint<unknown>}
}

type ArticleMetaProps<T, E> = {
    addons?: {[key: string]: Blueprint<T, E>}
    addons$?: Injector<T>
    article$?: Injector<T>
}

export type ArticleMetaPropsType<T, E> = ArticleMetaProps<T&ArticleMetaScope, E>

export const ArticleMeta = <T, E>(props: ArticleMetaPropsType<T, E>) : InferBlueprint<T, E> => {
    return mix<ArticleMetaScope>({
        css: 'article-meta',
        templates: {
            avatar: Link({
                content: Img({
                    src$: $ => $.article.author.image
                })
            }),
            info: {
                css: 'info',
                templates: {
                    author: Link({
                        css: 'author',
                        href$: $ => computable(() => '#/:'+$.article?.author.username),
                        text$: $ => $.article.author.username,
                    }),
                    date: Text({
                        as: { tag: 'span' },
                        css: 'date',
                        text$: $ => computable(() => {
                            return dayjs($.article?.createdAt).format('MMMM D, YYYY')
                        })
                    })
                }
            }
        },
        components: {
            avatar: true,
            info: true
        },
        reactions: {
            addons: (v) => patch({components: v})
        }
    },
    props && {
        templates: {
            ...props.addons
        },
        initials: {
            article: () => observable(null)
        },
        injections: {
            addons: props.addons$,
            article: props.article$,
        }
    })
}


