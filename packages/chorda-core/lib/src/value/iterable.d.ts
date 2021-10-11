import { ObservableValueSet, Node, ValueSet } from "./node";
import { PublishFunc, Subscriber, Subscription } from "./utils";
export interface IterableValue<T, K extends keyof T = keyof T> {
    readonly $name: string;
    $each(f: (itm: ValueSet<T[K]>, i?: string) => void): void;
}
export declare class IterableNode<T, K extends keyof T = keyof T> extends Node<T> implements IterableValue<T> {
    _origin: ObservableValueSet<T>;
    _name: string;
    constructor(initValue: T, origin?: ObservableValueSet<T>, key?: string);
    get $name(): string;
    $each(f: (itm: ValueSet<T[K]>, i?: string) => void): void;
    $unsubscribe(subscription: Subscription | Subscriber<T> | PublishFunc<T>): void;
}
export declare const iterable: <T>(source: T | ObservableValueSet<T>, key?: string) => IterableValue<T, keyof T> & T;
export declare const isIterable: (v: any) => v is IterableValue<any, string | number | symbol>;
