import { Blueprint, InferBlueprint, isValueSet, mix, Observable, PublishFunc } from "@chorda/core"
import { DomEvents } from "@chorda/react"



export const isNull = (v: any) : boolean => {
    return (isValueSet(v) ? v.$value : v) == null
}


export const watch = <T>(objects: any[], f: PublishFunc<T>) => {
    for (let obj of objects) {
        if (obj == null) {
            throw Error('Watched object is null')
        }
        (obj as Observable<unknown>).$subscribe(() => f.apply(this, objects.map(o => o.$value)))
//        (obj as Observable<unknown>).$subscribe(() => autoTerminalAware(f))
    }
}



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