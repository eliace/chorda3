import { InferBlueprint, observable } from "@chorda/core"
import { AppScope } from "../App"
import { AuthActions, AuthScope } from "../auth"
import { Block, Button, Column, Columns, Container, Fieldset, Form, FormGroup, H1, Input, Text, Textarea } from "../elements"
import { watch } from "../utils"




type SettingsScope = {
    settings: {
        imageUrl: string
        username: string
        bio: string
        email: string
        password?: string    
    }
}


export const SettingsPage = () : InferBlueprint<SettingsScope&AppScope&AuthScope&AuthActions> => {
    return {
        css: 'settings-page',
        templates: {
            content: Container({
                css: 'page',
                content: Columns([
                    Column({
                        css: 'col-md-6 offset-md-3 col-xs-12',
                        items: [
                            Text({
                                as: H1,
                                css: 'text-xs-center',
                                text: 'Your Settings'
                            }),
                            Form({
                                content: Block({
                                    as: Fieldset,
                                    items: [
                                        FormGroup({
                                            as: Fieldset,
                                            control: Input({
//                                                autoFocus: true,
                                                placeholder: 'URL of profile picture',
                                                value$: $ => $.settings.imageUrl
                                            })
                                        }),
                                        FormGroup({
                                            as: Fieldset,
                                            control: Input({
                                                css: 'form-control-lg',
                                                placeholder: 'Your Name',
                                                value$: $ => $.settings.username
                                            })
                                        }),
                                        FormGroup({
                                            as: Fieldset,
                                            control: Textarea({
                                                css: 'form-control-lg',
                                                placeholder: 'Short bio about you',
                                                rows: 8,
                                                value$: $ => $.settings.bio
                                            })
                                        }),
                                        FormGroup({
                                            as: Fieldset,
                                            control: Input({
                                                css: 'form-control-lg',
                                                placeholder: 'Email',
                                                type: 'email',
                                                value$: $ => $.settings.email
                                            })
                                        }),
                                        FormGroup({
                                            as: Fieldset,
                                            control: Input({
                                                css: 'form-control-lg',
                                                placeholder: 'Password',
                                                type: 'password',
                                                value$: $ => $.settings.password
                                            })
                                        }),
                                        Button({
                                            css: 'btn-lg btn-primary pull-xs-right',
                                            text: 'Update Settings'
                                        })
                                    ]
                                })
                            }),
                            { tag: 'hr' },
                            Button({
                                css: 'btn-outline-danger',
                                text: ' Or click here to logout. ',
                                onClick: (e, {logout}) => logout()
                            })

                        ]
                    })
                ])
            })
        },
        initials: {
            settings: () => observable({} as any)
        },
        joints: {
            init: ({settings, user}) => {
                
                watch(() => {
                    // ?
                    const u = user.$value
                    settings.$value = {
                        imageUrl: u.image,
                        username: u.username,
                        bio: u.bio,
                        email: u.email
                    }
                }, [user])

            }
        }
    }
}