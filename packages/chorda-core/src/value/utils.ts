

export const EMPTY = Object.seal({})


export interface Value<T> {
    $value: T
    readonly $uid: string
    readonly $isTerminal: boolean
}

//export type MutableValue<T> = Observable<T>&Value<T>

// Pub/Sub

export type PublishFunc<T> = (next: T, prev?: T, keys?: {[key: string]: any}) => void

export interface Subscriber<T> {
    $publish: PublishFunc<T>
}

export type Subscription = {
    subscriber: Subscriber<any>
    observable: Observable<any>
}

export interface Observable<T> extends Subscriber<T> {
    $subscribe (subscriber: Subscriber<T>|PublishFunc<T>) : Subscription
    $unsubscribe (subscription: Subscription|Subscriber<T>|PublishFunc<T>) : void
    $touch (subscriber: Subscriber<T>) : void
    $untouch () : void
}

export interface SubscriptionProvider {
    readonly $subscriptions: Subscription[]
}

export interface LifecycleProvider {
    $destroy () : void
}


// EventBus

interface EventRegistry<E> {
    $event (name: string) : Function
    $hasEvent (name: string) : boolean
} 

export interface EventBus<E> extends EventRegistry<E> {
    $emit(name: string, ...args: any[]) : void
    $on (name: string, callback: Function, target?: unknown) : Handler<E>
    $off (callbackOrTargetOrListener: Function|unknown) : void
}

export type Handler<E> = {
    name: string
    callback: Function
    bus: EventBus<E>
    target?: unknown
}




export interface Thenable<T=unknown> {
    then: <R>(resolve: (v?: T) => R, reject?: Function) => Thenable<R>
}




// Stream

// type KeyValuePair<T> = {
//     key: ValueKey
//     value: Value<T>
// }

export type NextValue<T> = {
    done: boolean
    value?: Value<T>
}

export interface ValueIterator<T, K = T extends any[] ? T[number] : T[keyof T]> {
    next() : NextValue<K>
    readonly $name: string
}





// let _SubscriptionSpy = []

// export const spySubscriptions = (fn: Function) : Subscription[] => {
//     // TODO
//     return []
// }


// let _AutoSubscriber : Subscriber<any> = null

// export const checkAutoSubscriber = () : Subscriber<any> => {
//     return _AutoSubscriber
// }



export const defaultUidFunc = (v: any) : string => {
    if (v == null) {
        return undefined
    }
    let uid = undefined
    if (typeof v == 'string' || typeof v == 'number' || typeof v == 'boolean' || typeof v == 'symbol') {
        uid = String(v)
    }
    else if (v.id != null) {
        uid = String(v.id)
    }
    else {
//        console.warn('Uid function should be defined', v)
    }
    if (uid == '[object Object]') {
        console.warn('Uid should be a primitive value', uid, v)
    }
    return uid
}



export const isEventBus = (v: any) : v is EventBus<any> => {
    return v != null && (v as EventBus<any>).$hasEvent != undefined
}
