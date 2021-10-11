import { Mixed, MixRules } from './mix';
import { Hub, HubEvents, HubOptions, HubScope, Indexed, Keyed } from './Hub';
import { IterableValue } from './value';
export declare const defaultGearFactory: <D, E>(opts: GearOptions<D, E, GearBlueprint<D, E>>, context: HubScope & {
    $defaultFactory: Function;
} & D, scope?: any, rules?: MixRules) => Gear<D, unknown, GearScope, GearOptions<D, unknown, GearBlueprint<D, unknown>>, GearBlueprint<D, unknown>>;
export declare type GearBlueprint<D = unknown, E = unknown> = GearOptions<D, E> | string | boolean | Function | Mixed<any>;
export declare const defaultInitRules: {
    defaultItem: (x: any, y: any) => import("./mix").Mixin<unknown>;
    defaultComponent: (x: any, y: any) => import("./mix").Mixin<unknown>;
    components: (x: {
        [key: string]: any;
    }, y: boolean | {
        [key: string]: any;
    }) => boolean | {
        [key: string]: any;
    };
    templates: (x: {
        [key: string]: any;
    }, y: boolean | {
        [key: string]: any;
    }) => boolean | {
        [key: string]: any;
    };
};
export declare const defaultPatchRules: {
    defaultItem: (x: any, y: any) => any;
    defaultComponent: (x: any, y: any) => any;
    components: (x: any, y: any) => any;
    templates: (x: any, y: any) => any;
    items: (x: any, y: any) => any;
};
export declare function defaultGearSort(a: Gear, b: Gear): number;
declare type KeyedAndIndexed = {
    index: number;
    key: string;
};
export interface GearOptions<D, E, B extends GearBlueprint<D, E> = GearBlueprint<D, E>> extends HubOptions<D, E> {
    weight?: number;
    name?: string;
    items?: B[] | boolean;
    itemFactory?: Function;
    defaultItem?: B;
    components?: {
        [key: string]: B;
    } | boolean;
    componentFactory?: Function;
    defaultComponent?: B;
    templates?: {
        [key: string]: B;
    };
    childFilter?: (value?: KeyedAndIndexed, index?: number, array?: this[]) => boolean;
    childSorter?: (a: this, b: this) => number;
}
export declare type GearScope = HubScope & {
    $defaultFactory: Function;
};
export declare type GearEvents = HubEvents & {
    afterSyncIndexed?: () => Indexed<Gear>;
    afterSyncKeyed?: () => Keyed<Gear>;
    afterAddKeyed?: () => Gear;
    beforeRemoveKeyed?: () => string;
};
export declare const isGear: (obj: any) => obj is Gear<unknown, unknown, GearScope, GearOptions<unknown, unknown, GearBlueprint<unknown, unknown>>, GearBlueprint<unknown, unknown>>;
export declare class Gear<D = unknown, E = unknown, S extends GearScope = GearScope, O extends GearOptions<D, E> = GearOptions<D, E>, B extends GearBlueprint<D, E> = GearBlueprint<D, E>> extends Hub<D, E, S, O> {
    index?: number;
    key?: string;
    parent?: this;
    components: {
        [k: string]: Gear<D>;
    };
    items: Gear<D>[];
    uid?: string | number | symbol;
    constructor(options: O, context?: S, scope?: any);
    patch(optPatch: O): void;
    initRules(): MixRules;
    patchRules(): MixRules;
    addKeyed(key: string, blueprint: B | Mixed<B> | Gear<D>, scope?: D & GearScope): Gear<D>;
    removeKeyed(key: string): void;
    updateKeyed(key: string, blueprint: B): void;
    syncKeyed(next: {
        [k: string]: Mixed<B>;
    } | IterableValue<any>): void;
    addIndexed(blueprint: B | Mixed<B> | Gear<D>, idx?: number, scope?: unknown): Gear<D>;
    updateIndexed(idx: number, blueprint: B): void;
    removeIndexed(idx: number): void;
    syncIndexed(next: Mixed<B>[] | IterableValue<any>): void;
    destroy(deferred?: Function): void;
    get children(): this[];
    visit(visitor: (node: this) => boolean | void): void;
}
export {};
