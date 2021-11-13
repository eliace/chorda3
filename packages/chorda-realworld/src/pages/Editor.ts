import { callable, computable, InferBlueprint, observable } from "@chorda/core";
import { api, Article } from "../api";
import { TagList } from "../components";
import { Block, Button, Column, Container, Fieldset, Form, FormGroup, Icon, Input, Row, Tag, Textarea } from "../elements";
import { RouterScope } from "../router";
import { ActionEventsOf } from "../utils";




type EditorScope = {
    article: Article
    isNew: boolean
    isPosting: boolean
    tags: string
}

type EditorActions = {
    postArticle: (article: Article, tags: string) => Promise<Article>
    updateArticle: (slug: string, article: Article) => void
    deleteTag: (article: Article, tag: string) => void
}



export const EditorPage = () : InferBlueprint<EditorScope&RouterScope&EditorActions> => {
    return {
        css: 'editor-page',
        templates: {
            content: Container({
                css: 'page',
                content: Row({
                    columns: [
                        Column({
                            css: 'col-md-10 offset-md-1 col-xs-12',
                            content: Form({
                                content: Block({
                                    as: Fieldset({
                                        disabled$: $ => $.isPosting
                                    }),
                                    items: [
                                        FormGroup({
                                            control: Input({
                                                css: 'form-control-lg',
                                                placeholder: 'Article Title',
                                                autoFocus: true,
                                                value$: $ => $.article.title
                                            })
                                        }),
                                        FormGroup({
                                            control: Input({
                                                placeholder: 'What\'s this article about?',
                                                value$: $ => $.article.description
                                            })
                                        }),
                                        FormGroup({
                                            control: Textarea({
                                                rows: 8,
                                                placeholder: 'Write your article (in markdown)',
                                                value$: $ => $.article.body
                                            })
                                        }),
                                        FormGroup({
                                            control: Input({
                                                placeholder: 'Enter tags',
                                                value$: $ => $.tags
                                            }),
                                            addons: {
                                                tags: TagList({
                                                    itemAs: Tag({
                                                        css: 'tag-default tag-pill',
                                                        icon: Icon({
                                                            icon: 'ion-close-round',
                                                            onClick: (e, {article, item, deleteTag}) => {
                                                                deleteTag(article, item)
                                                            }
                                                        })
                                                    }),
                                                    items$: $ => $.article.tagList
                                                })
                                            }
                                        }),
                                        Button({
                                            css: 'btn-lg pull-xs-right btn-primary',
                                            text: 'Publish Article'
                                        }),
                                    ]
                                }),
                                onSubmit: (e, {isNew, postArticle, updateArticle, article, tags}) => {
                                    e.preventDefault()
                                    if (isNew.$value) {
                                        postArticle(article, tags)
                                    }
                                    else {
                                        updateArticle(article.slug, article)
                                    }
                                },
                            })
                        })
                    ]
                })
            })
        },
        initials: {
            article: () => observable({} as Article),
            tags: () => observable(''),
            isPosting: () => observable(false),
            postArticle: () => callable((article, tags) => {
                const articleToSave = {
                    title: article.title,
                    description: article.description,
                    body: article.body,
                    tagList: tags.split(',').map(s => s.trim()).filter(s => s.length > 0)//.concat(article.tagList)
                }
                return api.postArticle(articleToSave)
            }),
            updateArticle: () => callable(api.updateArticle),
        },
        injections: {
            isNew: $ => computable(() => {
                return $.route.route.params.slug == null
            }),
        },
        joints: {
            postingArticle: ({postArticle, isPosting}) => {

                postArticle.$on('wait', () => {
                    isPosting.$value = true
                })

                postArticle.$on('done', () => {
                    isPosting.$value = false
                })

            }
        },
    }
}