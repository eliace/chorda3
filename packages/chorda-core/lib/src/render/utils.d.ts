import { Keyed } from "../Hub";
declare type VNode = any;
export interface Dom {
    readonly $eventHandlers: Keyed<Function>;
    readonly $isSubscribed: boolean;
}
export interface Renderer<P = any, H = any> {
    attach(root: Element, node: Renderable): void;
    detach(node: Renderable): void;
    readonly events: Keyed<any>;
    isAttached(node: Renderable): boolean;
}
export interface Renderable {
    render(asRoot?: boolean): VNode;
    readonly isRoot: boolean;
}
export interface VNodeFactory {
    createVNode<P, O>(key: string, vnodeProps: P, htmlProps: O & Dom, children?: any[]): VNode;
}
export declare const buildClassName: (cn: string, co: string | string[] | {
    [key: string]: boolean;
}) => string;
export {};
