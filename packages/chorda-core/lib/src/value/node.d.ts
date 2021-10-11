import { Observable, Value, Subscriber, Subscription } from './utils';
import { LifecycleProvider } from './utils';
import { PubSub } from './pubsub';
export declare type UidFunc<I = any> = (value: I) => string;
export declare type ObservableValue<T> = Observable<T> & Value<T>;
export declare type ValueKey = string | number | symbol;
export declare enum UpdateDirection {
    ASC = 0,
    DESC = 1,
    BOTH = 2
}
export declare enum HasCheck {
    PROPERTY = 0,
    METHOD = 1
}
export declare enum IsCheck {
    ARRAY = 0
}
export interface ValueSet<T, K extends keyof T = keyof T> extends Value<T> {
    $at<K extends keyof T = keyof T>(key: K, factory?: Function): ValueSet<T[K]>;
    $has(key: ValueKey, check?: HasCheck): boolean;
    $ownKeys(): (string | symbol)[];
    $getOwnPropertyDescriptor(key: ValueKey): object;
    $is(check: IsCheck): boolean;
}
export interface ObservableValueSet<T> extends ObservableValue<T> {
    $at<K extends keyof T = keyof T>(key: K, factory?: Function): ObservableValueSet<T[K]>;
    $has(key: ValueKey, check?: HasCheck): boolean;
    $ownKeys(): (string | symbol)[];
    $getOwnPropertyDescriptor(key: ValueKey): object;
    $is(check: IsCheck): boolean;
}
interface ValueNode<T> extends Value<T> {
    readonly $key: ValueKey;
    readonly $source: ValueNode<any>;
    $update(direction: UpdateDirection, nextValue: any, key?: ValueKey, keyInfo?: {
        [key: string]: any;
    }): void;
    $hasFunction(key: ValueKey): boolean;
    $destroy(): void;
    $get(): T;
}
export declare const spyGetters: (fn: Function) => Observable<any>[];
export declare abstract class Node<T, E = any> extends PubSub<T, E> implements ValueNode<T>, LifecycleProvider {
    _memoValue: any;
    _source: Node<unknown>;
    _key: ValueKey;
    _subscriptions: Subscription[];
    _entries: {
        [key: string]: Node<unknown>;
    };
    _uidFunc: UidFunc;
    _uid: string;
    _initialized: boolean;
    _destroyed: boolean;
    constructor(initValue?: T, source?: Node<unknown>, key?: ValueKey, entryUidFunc?: UidFunc);
    get $key(): ValueKey;
    get $source(): Node<unknown, any>;
    toString(): string;
    toJSON(): any;
    valueOf(): any;
    get [Symbol.toStringTag](): any;
    [Symbol.toPrimitive](): any;
    get [Symbol.isConcatSpreadable](): boolean;
    get $uid(): string;
    get $isTerminal(): boolean;
    get $isPrimitive(): boolean;
    get $value(): any;
    set $value(newValue: any);
    $hasFunction(key: ValueKey): boolean;
    $publish(next: any, prev?: any, keys?: {
        [key: string]: any;
    }): void;
    $touch(subscriber: Subscriber<T>): void;
    $untouch(): void;
    $update(direction: UpdateDirection, value: any, key?: ValueKey, keyInfo?: {
        [key: string]: any;
    }): void;
    _updateEntries(newValue: any): void;
    $get(): any;
    $destroy(): void;
}
export {};
