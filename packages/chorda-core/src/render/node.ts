import { Engine } from "../engine";
import { Keyed } from "../Hub";
import { EMPTY, EventBus, Handler, Observable, ObservableValue, PublishFunc, Subscriber, Subscription } from "../value";
import { EventNode } from "../value/bus";
import { Dom, Renderer } from "./utils";




//export type DomEvents = GlobalEventHandlersEventMap


// const DOM_EVENTS: Keyed<boolean> = {
//     click: true,
//     change: true,
//     input: true,
//     focus: true,
//     blur: true
// }


export class DomNode<T=unknown, E=unknown> extends EventNode<E> implements Observable<T>, Dom {

    _ref: Function
    _el: T
    _subscriptions: Subscription[]
    _effects: Function[]

    constructor (renderer: Renderer) {
        super(renderer.events)

        this._subscriptions = []
        this._effects = []
    }


    // get $ref () {
    //     return this._ref
    // }

    get $eventHandlers () {
        const result: Keyed<Function> = {}
        this._handlers.forEach(h => {
            result[h.name] = (e: any) => {
                this.$emit(h.name, e)
            }
        })
        return result
    }

    get $isSubscribed () {
        return this._subscriptions.length > 0
    }
    
    get $value() : T {
        return this._el
    }

    // set $value
    
    // get $uid() : string {
    //     return null
    // }
    
    // get $isTerminal() : boolean {
    //     return true
    // }

    $subscribe(subscriber: Subscriber<T>|PublishFunc<T>): Subscription {
        
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


        return sub
    }

    $unsubscribe(subscription: Subscription|Subscriber<T>|PublishFunc<T>): void {
        this._subscriptions = this._subscriptions.filter(sub => sub != subscription && sub.subscriber != subscription && sub.subscriber.$publish != subscription)
    }

    $publish(next: any, prev?: any, keys?: {[key: string]: any}): void {
        this._el = next
        this._subscriptions.forEach(sub => sub.subscriber.$publish(next))
    }

    $touch(subscriber: Subscriber<T>): void {
//        throw new Error("Method not implemented.");
    }

    $untouch (): void {

    }

    $nextFrame (el: HTMLElement) {

    }

    get $effects () {
        return this._effects
    }

    $addEffect (fn: Function) {
        this._effects.push(fn)
    }

    $applyEffects (engine: Engine<unknown>) {
        this._effects.forEach(eff => engine.scheduleTask(eff))
        this._effects = []
    }

}