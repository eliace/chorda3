import { EventBus, Handler } from './utils';
export declare const spyHandlers: (fn: Function) => Handler<any>[];
export declare class EventNode<E> implements EventBus<E> {
    _global: {
        [key: string]: any;
    };
    _events: {
        [key: string]: any;
    };
    _handlers: Handler<any>[];
    constructor(global?: {
        [key: string]: any;
    });
    $on(name: string, callback: Function, target: any): Handler<E>;
    $off(ctl: any): void;
    $emit(name: string, ...args: any[]): void;
    $event(name: string): Function;
    $hasEvent(name: string): boolean;
}
