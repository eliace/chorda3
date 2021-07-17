import { observable } from "@chorda/core";
import createRouter, { Router, SubscribeState } from "router5";
import browserPlugin from 'router5-plugin-browser'




export type RouterScope = {
    router: SubscribeState
}

export const useRouter = (scope: RouterScope, setup?: (router: Router) => void) => {
    
    const state = observable({})

    const router = createRouter()
    router.usePlugin(browserPlugin({
        useHash: true
    }))
    router.subscribe((next: SubscribeState) => {
        state.$value = next
//        console.log(next)
    })
    setup?.(router)
            
    scope.router = state as any

    router.start()
}