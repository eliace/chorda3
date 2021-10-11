import { Scheduler } from '.';
import { Gear, GearEvents, GearOptions, GearScope } from './Gear';
import { Keyed, NoInfer, Stateable } from './Hub';
import { Mixed, MixRules } from './mix';
import { Dom, Renderable, Renderer, VNodeFactory } from './render';
export declare type HtmlScope = {
    $renderer: Renderer & Scheduler & VNodeFactory;
    $defaultLayout: Function;
    $dom?: HTMLElement;
} & GearScope;
export declare type HtmlBlueprint<D = unknown, E = unknown, H = any> = HtmlOptions<D, E, H> | string | boolean | Function | Mixed<any>;
export interface HtmlOptions<D, E, H, B = HtmlBlueprint<NoInfer<D>, NoInfer<E>, H>> extends GearOptions<D, E, B> {
    layout?: Function;
    render?: boolean;
    dom?: H;
    tag?: string | boolean;
    text?: string;
    classes?: {
        [key: string]: boolean;
    };
    css?: string | string[];
    styles?: {
        [key: string]: string | number;
    };
    html?: string;
}
export declare type HtmlEvents = GearEvents & {
    afterRender?: () => any;
    afterInit?: () => Stateable & Renderable;
};
export declare type HtmlProps = {
    className?: string;
    styles?: {
        [k: string]: string | number;
    };
    html?: string;
    tag?: string | boolean;
    key?: string | number | symbol;
    elRef?: Function;
};
export declare const defaultHtmlInitRules: {
    defaultItem: (x: any, y: any) => import(".").Mixin<unknown>;
    defaultComponent: (x: any, y: any) => import(".").Mixin<unknown>;
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
    css: (x: string[], y: string[]) => any[];
};
export declare const defaultHtmlPatchRules: {
    defaultItem: (x: any, y: any) => any;
    defaultComponent: (x: any, y: any) => any;
    components: (x: any, y: any) => any;
    templates: (x: any, y: any) => any;
    items: (x: any, y: any) => any;
    css: (x: string[], y: string[]) => any[];
};
export declare const defaultHtmlFactory: <D extends Keyed<unknown>, E = unknown, H = unknown>(opts: HtmlOptions<D, E, H, HtmlBlueprint<NoInfer<D>, NoInfer<E>, H>>, context: {
    $renderer: Renderer & Scheduler & VNodeFactory;
    $defaultLayout: Function;
    $dom?: HTMLElement;
} & import("./Hub").HubScope & {
    $defaultFactory: Function;
} & D, scope: any, rules?: MixRules) => Html<D, unknown, any, HtmlScope, HtmlOptions<D, unknown, any, HtmlBlueprint<NoInfer<D>, unknown, any>>, HtmlBlueprint<D, unknown, any>>;
export declare const defaultRender: (html: Renderable | any) => any;
export declare const passthruLayout: (factory: VNodeFactory, key: string, props: any, dom: Dom, children?: Renderable[]) => any[];
export declare const defaultLayout: (factory: VNodeFactory, key: string, props: any, dom: Dom, children?: Renderable[]) => any;
export declare class Html<D = unknown, E = unknown, H = any, S extends HtmlScope = HtmlScope, O extends HtmlOptions<D, E, H> = HtmlOptions<D, E, H>, B extends HtmlBlueprint<D, E, H> = HtmlBlueprint<D, E, H>> extends Gear<D, E, S, O, B> implements Renderable {
    vnode: any;
    attached: boolean;
    dirty: boolean;
    constructor(options: O, context?: S, scope?: any);
    patch(optPatch: O): void;
    initRules(): MixRules;
    patchRules(): MixRules;
    attach(root: Element): void;
    detach(): void;
    get isRoot(): boolean;
    render(asRoot?: boolean): any;
    destroy(defer?: Function): void;
}
