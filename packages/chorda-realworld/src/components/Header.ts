import { computable, InferBlueprint, mix } from "@chorda/core"
import { AuthScope } from "../auth"
import { Img, Nav, NavBar, NavLink } from "../elements"
import { RouterScope } from "../router"
import { Icons } from "../utils"


type HeaderScope = {
    menu: {
        home: boolean
        signIn: boolean
        signUp: boolean
        newPost: boolean
    }
    activeName: string
}


export const Header = () : InferBlueprint<HeaderScope&AuthScope&RouterScope> => {
    return NavBar({
        as: {
            injections: {
                menu: ($) => computable(() => {
                    const isAuth = $.isAuth
                    return {
                        home: true,
                        signIn: !isAuth,
                        signUp: !isAuth,
                        newPost: isAuth,
                        settings: isAuth,
                        profile: isAuth,
                        //: isAuth,
                    }
                }),
                activeName: ($) => $.route.route.name
            }
        },
        nav: Nav({
            componentAs: NavLink({
                active$: ($) => computable(() => {
                    if ($.name == 'profile') {
                        return $.route.route.params.username == ':'+$.user?.username
                    }
                    else {
                        return ($.name == 'editor' && $.activeName == 'newPost') || $.name == $.activeName
                    }
                })
            }),
            componentGroups: [{
                home: NavLink({
                    text: 'Home',
                    name: 'home'
                })
            }, {
                signIn: NavLink({
                    name: 'signIn',
                    text: 'Sign in', 
                    href: '#/login'
                })
            }, {
                signUp: NavLink({
                    name: 'signUp',
                    text: 'Sign up', 
                    href: '#/register'
                })
            }, {
                newPost: NavLink({
                    name: 'editor',
                    text: ' New Article', 
                    icon: Icons.Compose,
                    href: '#/editor'
                })
            }, {
                settings: NavLink({
                    name: 'settings',
                    text: ' Settings', 
                    icon: Icons.GearAlt,
                    href: '#/settings'
                })
            }, {
                profile: NavLink({
                    name: 'profile',
                    text$: $ => $.user.username,
                    href$: $ => computable(() => {
                        return '#/:'+$.user?.username
                    }),
                    image: Img({
                        css: 'user-pic',
                        src$: $ => $.user?.image
                    })
                })
            }],
            components$: ($) => $.menu
        })
    })
}