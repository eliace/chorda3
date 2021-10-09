import { InferBlueprint, observable } from "@chorda/core";
import { Article } from "../api";
import { TagList } from "../components";
import { Block, Button, Column, Container, Fieldset, Form, FormGroup, Icon, Input, Row, Tag, Textarea } from "../elements";




type EditorScope = {
    article: Article
    isNew: boolean
    isPosting: boolean
    tags: string
    postArticle: (article: Article) => void
    updateArticle: (slug: string, article: Article) => void
    deleteTag: (article: Article, tag: string) => void
}



export const EditorPage = () : InferBlueprint<EditorScope> => {
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
                                onSubmit: (e, {isNew, postArticle, updateArticle, article}) => {
                                    e.preventDefault()
                                    if (isNew.$value) {
                                        postArticle(article)
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
        }
    }
}