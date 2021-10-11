import { Observable, PublishFunc, Subscriber, Subscription, SubscriptionProvider } from "./utils";
import { EventNode } from "./bus";
export declare const spySubscriptions: (fn: Function) => Subscription[];
export declare abstract class PubSub<T, E> extends EventNode<E> implements Observable<T>, SubscriptionProvider {
    _subscriptions: Subscription[];
    constructor(global?: {
        [key: string]: any;
    });
    $touch(subscriber: Subscriber<T>): void;
    $untouch(): void;
    $publish(next: any, prev?: any, keys?: {
        [key: string]: any;
    }): void;
    $subscribe(subscriber: Subscriber<T> | PublishFunc<T>): Subscription;
    $unsubscribe(subscription: Subscription | Subscriber<T> | PublishFunc<T>): void;
    get $subscriptions(): Subscription[];
}
