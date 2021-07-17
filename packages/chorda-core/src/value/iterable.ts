import { ObservableValueSet, UidFunc, Node, EMPTY, ValueSet, ObservableValue } from "./node";
import { isObservable, observable, ObservableNode } from "./observable";
import { Observable, PublishFunc, Subscriber, Subscription } from "./utils";




export interface IterableValue<T, K extends keyof T=keyof T> {
    readonly $name: string
    $each (f: (itm: ValueSet<T[K]>) => void) : void
}




export class IterableNode<T, K extends keyof T=keyof T> extends Node<T> implements IterableValue<T> {

    _origin: ObservableValueSet<T>
    _name: string

    constructor (initValue: T, origin?: ObservableValueSet<T>, key?: string) {
        super()

        this._origin = origin
        this._name = key
        this._memoValue = {} // FIXME обманываем isTerminal

        if (!origin) {
            this._origin = observable(initValue)
        }

        // FIXME это не должно быть в конструкторе
        this._origin.$subscribe(this)
    }

    get $name () {
        return this._name
    }

    // $publish(next: any, prev?: any, keys?: {[key: string]: any}): void {


    // }

    $each (f: (itm: ValueSet<T[K]>) => void) {
        const origin = (this._origin as ValueSet<T>) //|| this//(this as ValueSet<T>)
        const v = origin.$value
//        console.log('each', v)
        for (let i in v) {
            f(origin.$at(i) as any) // FIXME
        }
        // if (Array.isArray(v)) {
        //     for (let i = 0; i < v.length; i++) {
        //         f(origin.$at(i))
        //     }
        // }
        // else {
        //     for (let i in v) {
        //         f(origin.$at(i as K))
        //     }    
        // }
        // origin.$ownKeys().forEach(i => {
        //     f(origin.$at(i as K))
        // })
    }

    $unsubscribe(subscription: Subscription|Subscriber<T>|PublishFunc<T>): void {
        super.$unsubscribe(subscription)

        if (this._subscriptions.length == 0) {
            this._origin.$unsubscribe(this)
            this._origin = null
            this._initialized = false

            console.log('unsubscribed iterable detected [unsubscribe]')
        }
    }



}



export const iterable = <T>(source: ObservableValueSet<T>|T, key: string = '__it') : IterableValue<T> => {
    return (isObservable(source) ? new IterableNode(null, source, key) : new IterableNode(source, null, key))
}


export const isIterable = (v: any) : v is IterableValue<any> => {
    return v != null && typeof (v as IterableValue<any>).$each === 'function'
}
