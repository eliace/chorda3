import { EventNode } from "./bus"
import { ObservableValueSet, ValueSet, Node } from "./node"
import { isValueSet, proxify } from "./observable"
import { EventBus, Handler, Observable, PublishFunc, Subscriber, Subscription, Thenable, Value } from "./utils"


export interface Callable {
    $call (thisArg: any, args: any[]) : any
}

export type CallableEvents<R> = {
    done: () => R
    fail: () => any
    wait: () => void
}


class _Node<T, E> extends Node<T, E> {

}


class CallableNode<T extends Function, E=any> extends Function implements Value<T>, EventBus<E>, Observable<T>, Callable {
    
    _memoValue: T
//    _events: EventNode<E>
    _value: _Node<T, E>

    constructor (initValue: T) {
        super()
        this._memoValue = initValue
        this._value = new _Node()
        //this._events = new EventNode()
    }
    
    $subscribe(subscriber: Subscriber<T> | PublishFunc<T>): Subscription {
        return this._value.$subscribe(subscriber)
    }
    $unsubscribe(subscription: Subscriber<T> | PublishFunc<T> | Subscription): void {
        this._value.$unsubscribe(subscription)
    }
    $touch(subscriber: Subscriber<T>): void {
        //throw new Error("Method not implemented.")
    }
    $untouch(): void {
        //throw new Error("Method not implemented.")
    }
    $publish(next: any, prev?: any, keys?: {[key: string]: any}): void {
        this._value.$publish(next, prev, keys)
    }

    $call(thisArg: any, args: any[]) {
        if (this._memoValue == null) {
            // TODO
            //console.warn('Possible uninitialized callable', args)
        }
        let result = this._memoValue != null ? this._memoValue.apply(thisArg, args) : args[0]
        if (isValueSet(result)) {
            result = result.$value
        }
        if (result && (result as Thenable).then) {
            this.$emit('wait')
            result = result.then((response: any) => {
                this.$emit('done', response)
//                this._value.$value = response
//                this.$publish(response)
                return response
            }, (fail: any) => {
                this.$emit('fail', fail)
                return fail
            })
        }
        else {
            this.$emit('done', result)
//            this._value.$value = result
//            this.$publish(result)
        }
        return result
    }

    $emit(name: string, ...args: any[]): void {
        this._value.$emit.apply(this._value, [name, ...args])
    }
    $on(name: string, callback: Function, target?: unknown): Handler<E> {
        return this._value.$on(name, callback, target)
    }
    $off(callbackOrTargetOrListener: unknown): void {
        this._value.$off(callbackOrTargetOrListener)
    }

    $event(name: string): Function {
        return null
        //throw new Error("Method not implemented.")
    }
    $hasEvent(name: string): boolean {
        return false
        //throw new Error("Method not implemented.")
    }
    
    set $value (value: T) {
        this._memoValue = value
    }

    get $value (): T {
        return this._memoValue
    }

    get $uid () {
        return ''
    }

    get $isTerminal (): boolean {
        return true
    }

    // FIXME убрать после проверки наличия событий в Hub
    $has () {
        return false
    }

    $at (): any {
        return null
    }

}



export const callable = <T extends Function>(initValue: T) : /*Value<T>&*/T => {
    //const value = isValueSet(initValue) ? initValue.$value : initValue
    return proxify(initValue, new CallableNode(initValue) as any)
}


export const isCallable = (v: any) : v is Callable => {
    return v && typeof (v as Callable).$call === 'function'
}