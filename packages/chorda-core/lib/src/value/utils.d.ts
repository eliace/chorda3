export declare const EMPTY: {};
export interface Value<T> {
    $value: T;
    readonly $uid: string;
    readonly $isTerminal: boolean;
}
export declare type PublishFunc<T> = (next: T, prev?: T, keys?: {
    [key: string]: any;
}) => void;
export interface Subscriber<T> {
    $publish: PublishFunc<T>;
}
export declare type Subscription = {
    subscriber: Subscriber<any>;
    observable: Observable<any>;
};
export interface Observable<T> extends Subscriber<T> {
    $subscribe(subscriber: Subscriber<T> | PublishFunc<T>): Subscription;
    $unsubscribe(subscription: Subscription | Subscriber<T> | PublishFunc<T>): void;
    $touch(subscriber: Subscriber<T>): void;
    $untouch(): void;
}
export interface SubscriptionProvider {
    readonly $subscriptions: Subscription[];
}
export interface LifecycleProvider {
    $destroy(): void;
}
interface EventRegistry<E> {
    $event(name: string): Function;
    $hasEvent(name: string): boolean;
}
export interface EventBus<E> extends EventRegistry<E> {
    $emit(name: string, ...args: any[]): void;
    $on(name: string, callback: Function, target?: unknown): Handler<E>;
    $off(callbackOrTargetOrListener: Function | unknown): void;
}
export declare type Handler<E> = {
    name: string;
    callback: Function;
    bus: EventBus<E>;
    target?: unknown;
};
export interface Thenable {
    then: Function;
}
export declare type NextValue<T> = {
    done: boolean;
    value?: Value<T>;
};
export interface ValueIterator<T, K = T extends any[] ? T[number] : T[keyof T]> {
    next(): NextValue<K>;
    readonly $name: string;
}
export declare const defaultUidFunc: (v: any) => string;
export declare const isEventBus: (v: any) => v is EventBus<any>;
export {};
