import { Blueprint, callable, computable, InferBlueprint, mix, observable } from "@chorda/core";
import { api, User } from "./api";
import { ActionEventsOf, isNull } from "./utils";


export type AuthScope = {
    user: User
    isAuth: boolean
    isAuthChecking: boolean
}

export type AuthActions = {
    login: (login: string, password: string) => Promise<User>
    register: (username: string, login: string, password: string) => Promise<User>
    logout: () => void
}


export const withAuth = <T, E>(props: Blueprint<T&AuthScope&AuthActions, E>) : InferBlueprint<T, E> => {
    return mix<AuthScope&AuthActions, ActionEventsOf<AuthActions>>({
        initials: {
            login: () => callable(null),
            register: () => callable(null),
            logout: () => callable(null),
            user: () => observable({} as User),
            isAuthChecking: () => observable(false),
        },
        injections: {
            isAuth: $ => computable(() => $.user.username != null)
        },
        joints: {
            authOnLoad: async ({user, isAuthChecking: isAuthChecking}) => {

                console.log(user.$value)

                isAuthChecking.$value = true

                try {
                    user.$value = await api.getUser()
                }
                catch (e) {
                    user.$value = {} as any
                }

                isAuthChecking.$value = false

            },
            authInit: ({login, register, logout, user}) => {

                login.$value = (email, password) => {
                    return api.login(email, password).then(u => {
                        user.$value = u
                        return u
                    })
                }

                register.$value = (username, email, password) => {
                    return api.register(username, email, password).then(u => {
                        user.$value = u
                        return u
                    })
                }

                logout.$value = () => {
                    api.logout()
                    user.$value = {} as User
                }

            }
        },
    }, props)
}