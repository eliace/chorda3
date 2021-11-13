import { computable, Infer, InferBlueprint, observable, passthruLayout } from "@chorda/core"
import { Errors, User } from "../api"
import { AppScope } from "../App"
import { AuthActions } from "../auth"
import { ErrorList } from "../components"
import { Button, Column, Columns, Container, Fieldset, Form, FormGroup, Input, Link, Text } from "../elements"
import { Pages, RouterScope } from "../router"
import { ActionEventsOf, componentList } from "../utils"


type AuthScope = {
    errors: Errors
    flattenErrors: string[]
    isFetching: boolean
    email: string
    password: string
    username: string
    isSignIn: boolean
}



export const AuthPage = () : Infer.Blueprint<AuthScope&AuthActions&AppScope&RouterScope, ActionEventsOf<AuthActions>> => {
    return {
        initials: {
            email: () => observable(''),
            password: () => observable(''),
            username: () => observable(''),
            errors: () => observable(null),
            isFetching: () => observable(false),
        },
        injections: {
            isSignIn: $ => $.pages.signIn,
            flattenErrors: $ => computable(() => {
                let errorList: string[] = []
                for (let k in $.errors) {
                    errorList = errorList.concat($.errors[k].map(s => {
                        return `[${k}] ${s}`
                    }))
                }
                return errorList
            }),
        },
        joints: {
            init: ({login, errors, isFetching, register, navigate}) => {

                // login.$on('wait', (fail: Errors) => {
                //     isFetching.$value = true
                // })

                // login.$on('fail', (fail: Errors) => {
                //     isFetching.$value = false
                //     errors.$value = fail
                // })

                // login.$on('done', () => {
                //     isFetching.$value = false
                //     navigate(Pages.Home)
                // })

                register.$on('done', (user: User) => {

                })
            }
        },
        events: {
            login: {
                wait: (e, {isFetching}) => {
                    isFetching.$value = true
                },
                fail: (fail, {isFetching, errors}) => {
                    isFetching.$value = false
                    errors.$value = fail
                },
                done: (u, {isFetching, navigate}) => {
                    isFetching.$value = false
                    navigate(Pages.Home)
                }
            }
        },
        css: 'auth-page',
        templates: {
            content: Container({
                css: 'page',
                content: Columns([
                    Column({
                        css: 'col-md-6 offset-md-3 col-xs-12',
                        content: {
                            layout: passthruLayout, // ?
                            templates: {
                                title: Text({
                                    as: {
                                        tag: 'h1',
                                    },
                                    css: 'text-xs-center',
                                    text$: $ => computable(() => {
                                        return $.isSignIn ? 'Sign in' : 'Sign up'
                                    })
                                }),
                                subtitle: {
                                    tag: 'p',
                                    css: 'text-xs-center',
                                    templates: {
                                        content: Link({
                                            text$: $ => computable(() => {
                                                return $.isSignIn ? 'Need an account?' : 'Have an account?'
                                            }),
                                            href$: $ => computable(() => {
                                                return $.isSignIn ? '#/register' : '#/login'
                                            })
                                        })
                                    }
                                },
                                errors: ErrorList({
                                    items$: ($) => $.flattenErrors,
                                    itemAs: Text({
                                        text$: $ => $.item
                                    })
                                }),
                                form: Form({
                                    items$: $ => computable(() => {
                                        return {
                                            username: !$.isSignIn,
                                            email: true,
                                            password: true,
                                            button: true,
                                        }
                                    }),
                                    itemAs: Fieldset({
                                        disabled$: $ => $.isFetching
                                    }),
                                    onSubmit: (e, {login, email, password, isSignIn, register, username}) => {
                                        e.preventDefault()
                                        isSignIn.$value ? login(email, password) : register(username, email, password)
                                    },
                                    items: componentList([{
                                        name: 'username',
                                        as: FormGroup({
                                            control: Input({
                                                css: 'form-control-lg',
                                                type: 'text',
                                                placeholder: 'Username',
                                                value$: $ => $.username
                                            })
                                        })
                                    }, {
                                        name: 'email',
                                        as: FormGroup({
                                            control: Input({
                                                css: 'form-control-lg',
                                                type: 'email',
                                                placeholder: 'Email',
                                                value$: $ => $.email
                                            })
                                        })
                                    }, {
                                        name: 'password',
                                        as: FormGroup({
                                            control: Input({
                                                css: 'form-control-lg',
                                                type: 'password',
                                                placeholder: 'Password',
                                                value$: $ => $.password
                                            })
                                        })
                                    }, {
                                        name: 'button',
                                        as: Button({
                                            css: 'btn-lg btn-primary pull-xs-right',
                                            text$: $ => computable(() => {
                                                return $.isSignIn ? 'Sign in' : 'Sign up'
                                            })
                                        })
                                    }])
                                })
                            }
                        }
                    })
                ])
            })
        }
    }
}