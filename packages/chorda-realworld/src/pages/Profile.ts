import { computable, InferBlueprint, observable } from "@chorda/core"
import { api, Article, Profile } from "../api"
import { AuthScope } from "../auth"
import { ArticlePreview } from "../components"
import { Block, Button, Column, Columns, Container, H4, Icon, Img, Link, Nav, NavLink, Paragraph, Text } from "../elements"
import { Icons, watch } from "../utils"



type ProfileScope = {
    profile: Profile
    isUser: boolean
    selectedGroup: string
    articles: Article[]
}



const SettingsButton = () : InferBlueprint<ProfileScope> => {
    return Button({
        as: Link({
            href: '#/settings'
        }),
        order: 10,
        css: 'btn-sm btn-outline-secondary action-btn',
        text: ' Edit Profile Settings',
        icon: Icon({
            icon: Icons.GearAlt
        })
    })
}

const FollowButton = () : InferBlueprint<ProfileScope> => {
    return Button({
        order: 10,
        css: 'btn-sm btn-outline-secondary action-btn',
        icon: Icon({
            icon: Icons.PlusRound
        }),
        text$: $ => computable(() => {
            return ` Follow ${$.profile.username}`
        })
    })
}



export const ProfilePage = () : InferBlueprint<ProfileScope&AuthScope> => {
    return {
        css: 'profile-page',
        templates: {
            userInfo: Block({
                css: 'user-info',
                content: Container({
                    content: Columns([
                        Block({
                            css: 'col-xs-12 col-md-10 offset-md-1',
                            items: [
                                Img({
                                    css: 'user-img',
                                    src$: $ => $.profile.image
                                }),
                                Text({
                                    as: H4,
                                    text$: $ => $.profile.username
                                }),
                                Text({
                                    as: Paragraph,
                                    text$: $ => $.profile.bio
                                }),
                            ],
                            addons: {
                                settingsBtn: SettingsButton,
                                followBtn: FollowButton,
                            },
                            addons$: $ => computable(() => {
                                return {
                                    settingsBtn: $.isUser,
                                    followBtn: !$.isUser,
                                }
                            })
                        })
                    ])                        
                }),
            }),
            content: Container({
                content: Columns([
                    Block({
                        css: 'col-xs-12 col-md-10 offset-md-1',
                        project: true,
                        itemAs: ArticlePreview,
                        items$: $ => $.articles,
                        addons: {
                            toggle: Block({
                                css: 'articles-toggle',
                                content: Nav({
                                    css: 'nav-pills outline-active',
                                    componentGroups: [{
                                        my: NavLink({
                                            text: 'My Articles',
                                            name: 'my'
                                        }),
                                        favorited: NavLink({
                                            text: 'Favorited Articles',
                                            name: 'favorited'
                                        })
                                    }],
                                    componentAs: NavLink({
                                        active$: $ => computable(() => {
                                            return $.name == $.selectedGroup
                                        }),
                                        onClick: (e, {selectedGroup, name}) => {
                                            e.preventDefault()
                                            selectedGroup.$value = name
                                        }
                                    })
                                })
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
                        addons$: $ => computable(() => {
                            return {
                                toggle: true,
                                loading: false,
                                noArticles: $.articles.length == 0,
                            }
                        })
                    })
                ])
            })
        },
        defaults: {
            profile: () => observable({} as Profile),
            articles: () => observable([]),
            selectedGroup: () => observable('my'),
        },
        injections: {
            isUser: $ => computable(() => {
                return ($.user.username && $.profile.username) ? $.profile.username == $.user.username : false
            })
        },
        joints: {
            autoLoad: ({user, profile, selectedGroup, articles}) => {

                profile.username = user.username

                api.getProfile(user.username)
                    .then(data => {
                        profile.$value = data
                    })

                const loadArticles = (group: string) : Promise<Article[]> => {
                    if (group) {
                        return Promise.resolve([])
                    }
                    return Promise.resolve([])
                }

                watch(() => {
                    if (profile.$value) {
                        loadArticles(selectedGroup)
                            .then(data => {
                                articles.$value = data
                            })
                    }
                }, [profile, selectedGroup])
            }
        }
    }
}