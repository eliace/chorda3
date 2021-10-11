import { Node, UidFunc, ValueSet, ValueKey, ObservableValueSet, HasCheck, IsCheck } from './node';
import { ValueIterator } from './utils';
export declare const autoTerminalAware: (fn: Function) => any;
export declare const noAutoTerminal: (fn: Function) => any;
export declare const isAutoTerminal: () => boolean;
export declare class ObservableNode<T, K extends keyof T = keyof T> extends Node<T> implements ValueSet<T> {
    $at<I = T[K]>(k: ValueKey, creator?: Function): ValueSet<I>;
    $has(key: ValueKey, check?: HasCheck): boolean;
    $is(check: IsCheck): boolean;
    $ownKeys(): (string | symbol)[];
    $getOwnPropertyDescriptor(name: ValueKey): object;
    _createEntry(value: T, key: ValueKey): Node<T>;
}
export declare const observable: <T>(initValue: T | ObservableValueSet<T>, uidFunc?: UidFunc) => ObservableValueSet<T> & T;
export declare const reactive: <T>(initValue?: T, uidFunc?: UidFunc) => T;
export declare const isObservable: (v: any) => v is ObservableValueSet<any>;
export declare const isValueSet: <T = any>(v: T | ObservableValueSet<T>) => v is ObservableValueSet<T>;
export declare const isValueIterator: (v: any) => v is ValueIterator<any, any>;
export declare const __isProxy: unique symbol;
export declare const __isValue: unique symbol;
export interface Proxied {
    [__isProxy]: boolean;
}
export declare const proxify: <T>(obj: T, node: ValueSet<T, keyof T>) => ValueSet<T, keyof T> & T;
