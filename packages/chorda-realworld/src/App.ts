import { callable, CallableEvents, computable, InferBlueprint, MethodsOf, patch } from "@chorda/core";
import { Route } from "router5";
import { api, User } from "./api";
import { withAuth } from "./auth";
import { Footer, Header } from "./components";
import { ArticlePage, AuthPage, EditorPage, Home, ProfilePage, SettingsPage } from "./pages";
import { Pages, withRouter } from "./router";
import { isNull, watch } from "./utils";


export type AppScope = {
    pages: {
        home: boolean
        signIn: boolean
        signUp: boolean
        article: boolean
        editor: boolean
        settings: boolean
        profile: boolean
    }
    login: (login: string, password: string) => Promise<User>
    register: (username: string, login: string, password: string) => Promise<User>
    logout: () => void
}


type ActionEventsOf<E> = {
    [P in keyof E]?: (E[P] extends (...args: any) => Promise<infer R> ? CallableEvents<R> : never)
}

// type Action<E extends (...args: any) => any> = CallableEvents<ReturnType<E>>


// type AppEvents = {
//     login: Action<AppScope['login']>
// }

type AppEvents = ActionEventsOf<AppScope>


const routes: Route<Record<string, any>>[] = [
    {path: '/login', name: Pages.SignIn},
    {path: '/register', name: Pages.SignUp},
    {path: '/settings', name: Pages.Settings},
    {path: '/editor', name: Pages.NewPost},
    {path: '/editor/:slug', name: Pages.Editor},
    {path: '/article/:slug', name: Pages.Article},
    {path: '/:username<[:]+\\w+>', name: Pages.Profile},
]


export default () : InferBlueprint<AppScope, AppEvents> => {
    return withAuth(withRouter({
        joints: {
            init: ({isAuth: isAuthenticated, navigate, login, register, pages, user, logout}) => {

                watch([isAuthenticated], () => {
                    // при потере аутентификации переходим на страницу логина
                    if (!isAuthenticated.$value) {
                        const p = pages.$value
                        if (!(p.home || p.signIn || p.signUp || p.article)) {
                            navigate(Pages.SignIn)
                        }
                    }
                })

                login.$value = (email, password) => {
                    return api.login(email, password)
                }

                register.$value = (username, email, password) => {
                    return api.register(username, email, password)
                }

                logout.$value = () => {
                    user.$value = {} as User
                }

            }
        },
        events: {
            login: {
                done: (u, {user}) => {
                    user.$value = u
                },
                fail: (e) => {
//                    debugger
                }
            },
            register: {
                done: (u, {user}) => {
                    user.$value = u
                }
            }
        },
        initials: {
            login: () => callable(null),
            register: () => callable(null),
            logout: () => callable(null),
        },
        injections: {
            pages: ($) => computable(() => {
                const route = $.route.route.name
                return {
                    home: route == Pages.Home,
                    signIn: route == Pages.SignIn,
                    signUp: route == Pages.SignUp,
                    article: route == Pages.Article,
                    settings: route == Pages.Settings,
                    profile: route == Pages.Profile,
                    editor: route == Pages.Editor || route == Pages.NewPost,
                }
            })
        },
        reactions: {
            pages: (v) => patch({components: v})
        },
        templates: {
            header: Header,
            footer: Footer,
            signIn: AuthPage,
            signUp: AuthPage,
            home: Home,
            article: ArticlePage,
            editor: EditorPage,
            settings: SettingsPage,
            profile: ProfilePage,
        },
        components: {
            header: true,
            footer: true,
            signIn: false,
            signUp: false,
            home: false,
            article: false,
            editor: false,
            settings: false,
            profile: false,
        },
    }, routes))
}