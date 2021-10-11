import { Value, EventBus, Subscription, ObservableValue, Handler, Thenable } from './value';
import { MixRules } from './mix';
import { Pipe, Scheduler } from './pipe';
export declare type Scope = {
    [k: string]: any;
};
export declare type NoInfer<T> = [T][T extends any ? 0 : never];
export declare type Scoped<D> = {
    [P in keyof D]?: D[P] & Value<D[P]>;
};
declare type EventScoped<D> = {
    [P in keyof D]?: D[P] & Value<D[P]> & EventBus<any>;
};
declare type ObservableScoped<D> = {
    [P in keyof D]?: D[P] & ObservableValue<D[P]> & EventBus<any> & ObservableScoped<D[P]>;
};
declare type Injectors<D> = {
    [P in keyof NoInfer<D>]?: Injector<D, D[P]>;
};
export declare type Injector<D, R = any> = (scope: Scoped<D> & {
    $context?: Scoped<D>;
}) => R;
declare type L<T, S> = T extends (...args: any[]) => infer R ? Listener<S, R> : Listeners<T, S>;
declare type Listeners<E, S> = {
    [P in keyof E]?: L<E[P], S>;
};
declare type MethodsAndObjectsOf<D> = {
    [P in keyof D as D[P] extends ((...args: any[]) => any) | {
        [k: string]: any;
    } ? P : never]?: D[P];
};
export declare type MethodsOf<D> = {
    [P in keyof D as D[P] extends ((...args: any) => any) ? P : never]?: D[P];
};
export declare type Listener<D, R> = (event: R, scope: EventScoped<D>) => boolean | unknown;
declare type Reactor<T> = (next: T, prev: T) => void;
declare type Reactors<T> = {
    [P in keyof T]?: Reactor<NoInfer<T[P]>>;
};
export declare type Joint<T> = (/*o: ObservableValue<T[P]>&EventBus<any>&T[P],*/ scope: ObservableScoped<T>) => Function | Promise<void> | void;
declare type Joints<T> = {
    [key: string]: Joint<NoInfer<T>>;
};
export interface HubOptions<D, E> {
    injections?: Injectors<D>;
    joints?: Joints<D>;
    initials?: Injectors<D>;
    reactions?: Reactors<D>;
    events?: Listeners<MethodsAndObjectsOf<E>, D>;
}
export declare type HubScope = {
    $engine: Scheduler;
    $pipe: Pipe;
};
export declare type HubEvents = {
    afterInit: () => Stateable;
    afterDestroy: () => void;
};
export declare enum State {
    Initializing = 0,
    Initialized = 1,
    Destroying = 2,
    Destroyed = 3
}
export interface Stateable {
    readonly state: State;
}
export declare type Indexed<T = unknown> = T[];
export declare type Keyed<T = unknown> = {
    [key: string]: T;
};
export declare const patch: (o: any) => void;
interface MonitoredThenable extends Thenable {
    isPending: boolean;
    isDone: boolean;
    isFailed: boolean;
}
export declare class Hub<D, E, S extends HubScope = HubScope, O extends HubOptions<D, E> = HubOptions<D, E>> implements Stateable {
    options: O;
    scope: ObservableScoped<S & D & Keyed>;
    subscriptions: Subscription[];
    handlers: Handler<any>[];
    joints: (MonitoredThenable | Function)[];
    bindings: {
        [key: string]: Function;
    };
    events: {
        [key: string]: Function;
    };
    state: State;
    _local: any;
    constructor(options: O, context?: S, initScope?: any);
    patch(optPatch: O): void;
    destroy(deferred?: Function): void;
    patchAware(callback: Function): (...args: any[]) => void;
    initRules(): MixRules;
    patchRules(): MixRules;
    reset(nextOpts?: O): void;
}
export {};
