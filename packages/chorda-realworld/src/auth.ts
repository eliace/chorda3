import { Blueprint, callable, computable, InferBlueprint, mix, observable } from "@chorda/core";
import { api, User } from "./api";
import { ActionEventsOf, isNull } from "./utils";


export type AuthScope = {
    user: User
    isAuth: boolean
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
        },
        injections: {
            user: () => observable({} as User),
            isAuth: $ => computable(() => $.user.username != null)
        },
        joints: {
            authOnLoad: async ({user}) => {

                try {
                    user.$value = await api.getUser()
                }
                catch (e) {
                    user.$value = {} as any
                }

            },
            init: ({login, register, logout, user}) => {

                login.$value = (email, password) => {
                    return api.login(email, password)
                }

                register.$value = (username, email, password) => {
                    return api.register(username, email, password)
                }

                logout.$value = () => {
                    api.logout()
                    user.$value = {} as User
                }

            }
        },
        events: {
            login: {
                done: (u, {user}) => {
                    user.$value = u
                },
            },
            register: {
                done: (u, {user}) => {
                    user.$value = u
                }
            }
        },
    }, props)
}