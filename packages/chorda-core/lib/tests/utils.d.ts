import { HtmlProps, Keyed, Scheduler, BufferedEngine } from "../src";
import { Dom, Renderable, Renderer, VNodeFactory } from "../src/render";
export declare const createPatchScheduler: () => Scheduler;
export declare const immediateTick: () => void;
declare type RenderRoot = {
    el: Element;
    node: Renderable;
};
declare class TestRenderer extends BufferedEngine implements Renderer, VNodeFactory {
    roots: RenderRoot[];
    constructor();
    isAttached(node: Renderable): boolean;
    attach(el: Element, node: Renderable): void;
    detach(node: Renderable): void;
    events: Keyed<any>;
    render(): void;
    createVNode<P, H extends HtmlProps>(key: string, vnodeProps: P, htmlProps: Dom & H, children?: any[]): any;
}
export declare const createRenderScheduler: () => TestRenderer;
export declare const attachRoot: (r: Renderable) => void;
export declare const immediateRender: () => void;
export {};
