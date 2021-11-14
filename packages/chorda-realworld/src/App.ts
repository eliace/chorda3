import { callable, CallableEvents, computable, InferBlueprint, observable, watch } from "@chorda/core";
import { Route } from "router5";
import { api, User } from "./api";
import { withAuth } from "./auth";
import { Footer, Header } from "./components";
import { ArticlePage, AuthPage, EditorPage, Home, ProfilePage, SettingsPage } from "./pages";
import { Pages, withRouter } from "./router";
import { isNull } from "./utils";


export type AppScope = {
    pages: Partial<{
        home: boolean
        signIn: boolean
        signUp: boolean
        article: boolean
        editor: boolean
        settings: boolean
        profile: boolean
    }>
}


// type Action<E extends (...args: any) => any> = CallableEvents<ReturnType<E>>


// type AppEvents = {
//     login: Action<AppScope['login']>
// }

//type AppEvents = ActionEventsOf<AppActions>


const routes: Route<Record<string, any>>[] = [
    {path: '/login', name: Pages.SignIn},
    {path: '/register', name: Pages.SignUp},
    {path: '/settings', name: Pages.Settings},
    {path: '/editor', name: Pages.NewPost},
    {path: '/editor/:slug', name: Pages.Editor},
    {path: '/article/:slug', name: Pages.Article},
    {path: '/:username<[:]+\\w+>', name: Pages.Profile},
]


export default () : InferBlueprint<AppScope> => {
    return withAuth(withRouter({
        joints: {
            init: ({isAuth, navigate, pages, isAuthChecking}) => {

                watch(() => {
                    // при потере аутентификации переходим на страницу логина
                    if (!isAuth.$value && !isAuthChecking.$value) {
                        const p = pages.$value
                        if (!(p.home || p.signIn || p.signUp || p.article)) {
                            navigate(Pages.SignIn)
                        }
                    }
                }, [isAuth, isAuthChecking])

            }
        },
        injections: {
            pages: ($) => computable(() => {
                if ($.isAuthChecking) {
                    return {
                        header: false
                    }
                }
                const route = $.route.route.name
                return {
                    header: true,
                    footer: true,
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
            pages: (v) => ({components: v})
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
        components: false // FIXME
        // components: {
        //     header: false,
        //     footer: false,
        //     signIn: false,
        //     signUp: false,
        //     home: false,
        //     article: false,
        //     editor: false,
        //     settings: false,
        //     profile: false,
        // },
    }, routes))
}