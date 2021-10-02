import { Observable, PublishFunc, Subscriber, Subscription, SubscriptionProvider } from "./utils";
import { EventNode } from "./bus";




// Spies

let _SpySubscriptions : Subscription[] = null

export const spySubscriptions = (fn: Function) : Subscription[] => {
    const prevSub = _SpySubscriptions
    _SpySubscriptions = []
    fn()
    const result = _SpySubscriptions
    _SpySubscriptions = prevSub
    return result
}


export abstract class PubSub<T, E> extends EventNode<E> implements Observable<T>, SubscriptionProvider {

    _subscriptions: Subscription[]


    constructor (global?: {[key: string]: any}) {
        super(global)

        this._subscriptions = []
    }

    $touch(subscriber: Subscriber<T>): void {
        throw new Error("Method not implemented.");
    }

    $untouch(): void {
        throw new Error("Method not implemented.");
    }

    $publish (next: any, prev?: any, keys?: {[key: string]: any}): void {
        throw new Error("Method not implemented.");
    }


    $subscribe(subscriber: Subscriber<T>|PublishFunc<T>): Subscription {

        // if (this._destroyed) {
        //     console.error('Cannot subscribe to deleted value')
        //     return null
        // }
        
        // проверяем, что такая подписка уже есть
        for (let sub of this._subscriptions) {
            if (sub.subscriber == subscriber || sub.subscriber.$publish == subscriber) {
                return sub
            }
        }    

        if (typeof subscriber === 'function') {
            subscriber = {
                $publish: subscriber
            }
        }

        const sub: Subscription = {
            subscriber,
            observable: this
        }

        this._subscriptions.push(sub)

        if (_SpySubscriptions) {
            _SpySubscriptions.push(sub)
        }

        return sub
    }

    $unsubscribe(subscription: Subscription|Subscriber<T>|PublishFunc<T>): void {
        // if (this._destroyed) {
        //     console.error('Cannot unsubscribe from deleted value')
        //     return 
        // }
        this._subscriptions = this._subscriptions.filter(sub => sub != subscription && sub.subscriber != subscription && sub.subscriber.$publish != subscription)
    }

    // $touch(subscriber: Subscriber<T>): void {
    //     //this._started = true
    //     subscriber.$publish(this.$value, undefined, EMPTY)
    // }

    // $untouch () {
    //     // TODO проверки при отсоединении
    // }

    get $subscriptions () {
        return this._subscriptions
    }


}