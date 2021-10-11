import { Keyed } from "../Hub";
import { Subscriber } from "../value";
import { PubSub } from "../value/pubsub";
import { Dom, Renderer } from "./utils";
export declare class DomNode<T = unknown, E = unknown> extends PubSub<T, E> implements Dom {
    _ref: Function;
    _el: T;
    _effects: Function[];
    constructor(renderer: Renderer);
    get $eventHandlers(): Keyed<Function>;
    get $isSubscribed(): boolean;
    get $value(): T;
    $publish(next: any, prev?: any, keys?: {
        [key: string]: any;
    }): void;
    $touch(subscriber: Subscriber<T>): void;
    $untouch(): void;
}
