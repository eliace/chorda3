import { Blueprint, computable, InferBlueprint, mix, observable } from "@chorda/core";
import { api, User } from "./api";
import { isNull } from "./utils";


export type AuthScope = {
    user: User
    isAuth: boolean
}


export const withAuth = <T, E>(props: Blueprint<T&AuthScope, E>) : InferBlueprint<T, E> => {
    return mix<AuthScope>({
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

            }
        }
    }, props)
}