import { Keyed } from "../Hub"

type VNode = any

// export type VNodeOptions = {
//     tag?: string
// }


export interface Dom {
//    readonly $ref: Function
    readonly $eventHandlers: Keyed<Function>
    readonly $isSubscribed: boolean
    $nextFrame (el: HTMLElement) : void
}


export interface Renderer<P=any, H=any> {
    attach (root: Element, node: Renderable) : void
    detach (node: Renderable) : void
    readonly events: Keyed<any>
//    createVNode () : VNode//tuple: [string|number, {}, {}, VNode[]]) : VNode
}

export interface Renderable {
    render() : VNode
}

export type VNodeFactory = <P, O>(key: string, vnodeProps: P, htmlProps: O&Dom, children?: any[]) => VNode




export const buildClassName = (cn: string, co: {[key: string]: boolean} | string | string[]) => {
    const classes: {[key: string]: boolean} = {}
    if (cn) {
        cn.split(' ').forEach(n => {
            classes[n] = true
        })
    }
    if (!co) {

    }
    else if (Array.isArray(co)) {
        for (let cls of co) {
            classes[cls] = true
        }
    }
    else if (typeof co === 'string') {
        classes[co] = true
    }
    else {
        for (let i in co) {
            if (co[i] !== undefined) {
                classes[i] = co[i]
            }
        }
        //Object.assign(classes, co)
    }
    const cn_a: string[] = []
    for (let i in classes) {
        if (classes[i]) {
            cn_a.push(i)
        }
    }
    return cn_a.length ? cn_a.join(' ') : null
}
