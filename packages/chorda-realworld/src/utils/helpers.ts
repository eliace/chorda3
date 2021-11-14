import { Blueprint, CallableEvents, computable, EventBus, InferBlueprint, isValueSet, mix, Observable, PublishFunc, spySetters } from "@chorda/core"
import { ReactDomEvents } from "@chorda/react"


export type ActionEventsOf<E> = {
    [P in keyof E]?: (E[P] extends (...args: any) => Promise<infer R> ? CallableEvents<R> : never)
}



export const isNull = (v: any) : boolean => {
    return (isValueSet(v) ? v.$value : v) == null
}


// export const watch = <T>(f: PublishFunc<T>, objects: any[]) => {


//     const all = computable(() => objects.map(o => o.$value))
// //    all.$touch({$publish: () => {}})
//     all.$subscribe(f as any)
    
//     // const sub = {
//     //     subscribers: new Set<Observable<any>>(),
//     //     $publish: () => {
//     //         const setters = spySetters(() => {
//     //             f.apply(this, objects.map(o => o.$value))
//     //         })
//     //         setters.forEach(s => sub.subscribers.add(s))
//     //     },
//     //     get $subscriptions (): any[] {
//     //         const subscriptions = [] as any[]
//     //         sub.subscribers.forEach(subscriber => {
//     //             subscriptions.push({subscriber})
//     //         })
//     //         console.log('watch subscriptions', subscriptions)
//     //         return subscriptions
//     //     }
//     // }
    
// //     for (let obj of objects) {
// //         if (obj == null) {
// //             throw Error('Watched object is null')
// //         }
// //         (obj as Observable<unknown>).$subscribe(sub)
// // //        (obj as Observable<unknown>).$subscribe(() => autoTerminalAware(f))
// //     }
// }



export type BlueprintGroup<T, E> = Record<string, Blueprint<T, E>>// {[key:string]: Blueprint<T, E>}

export const componentGroups = <T, E>(groups: BlueprintGroup<T, E>[]) : Record<string, Blueprint<T, E>> => {
    const c: Record<string, Blueprint<T, E>> = {}
    groups.forEach((group, i) => {
        for (let k in group) {
            c[k] = mix({weight: i+1}, group[k])
        }
    })
    return c
}

export const flags = (obj: any) : any => {
    const flags: any = {}
    for (let i in obj) {
        flags[i] = !!obj[i]
    }
    return flags
}



type KeyedComponent<T, E> = {
    name: string
    as?: Blueprint<T, E>
}

export const componentList = <T, E>(components: KeyedComponent<T, E>[]) : Record<string, Blueprint<T, E>> => {
    const record: Record<string, Blueprint<T, E>> = {}
    components.forEach((c, i) => {
        record[c.name] = mix({weight: i}, c.as)
    })
    return record
}


// export const withReact = <T, E>(props: Blueprint<T, E&DomEvents>) : InferBlueprint<T, E> => {
//     return props
// }


export type IteratorScope = {
    __it?: unknown[]
}


export const whenWait = <F extends (...args: any) => Promise<any>>(f: Function, src: EventBus<F>[]) => {
    src.forEach(bus => {
        bus.$on('wait', f)
    })
}

export const whenDone = <F extends (...args: any) => Promise<R>, R>(f: (e: R) => void, src: EventBus<F>[]) => {
    src.forEach(bus => {
        bus.$on('done', f)
    })
}

export const whenFail = <F extends (...args: any) => Promise<any>>(src: EventBus<F>, f: Function) => {
    src.$on('fail', f)
}

export const whenFinal = <F extends (...args: any) => Promise<any>>(src: EventBus<F>, f: Function) => {
    src.$on('final', f)
}
