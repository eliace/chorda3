import { Blueprint, callable, InferBlueprint, mix, observable } from "@chorda/core"
import createRouter, { Route, SubscribeState } from "router5"
import browserPlugin from "router5-plugin-browser"

export enum Pages {
    Home = 'home',
    SignIn = 'signIn',
    SignUp = 'signUp',
    Article = 'article',
    Editor = 'editor',
    NewPost = 'newPost',
    Settings = 'settings',
    Profile = 'profile',
}



export type RouterScope = {
    route: SubscribeState
    navigate: (path: string, params?: Record<string, any>) => void
}


export const withRouter = <T, E>(props: Blueprint<T&RouterScope, E>, routes: Route<Record<string, any>>[]) : InferBlueprint<T, E> => {
    return mix<RouterScope>({
        initials: {
            route: () => observable(null),
            navigate: () => callable(null),
        },
        joints: {
            initRouter: ({route, navigate}) => {

                const router = createRouter([
                    {path: '/', name: 'home'}
                ].concat(routes), {
                    defaultRoute: 'home'
                })

                router.usePlugin(browserPlugin({
                    useHash: true
                }))
                router.subscribe((state: SubscribeState) => {
                    route.$value = state
                })

                router.start()

                navigate.$value = (path, params = {}) => {
                    router.navigate(path, params)
                }

            }
        }
    }, props)
}