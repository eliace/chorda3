"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.immediateRender = exports.attachRoot = exports.createRenderScheduler = exports.immediateTick = exports.createPatchScheduler = void 0;
var src_1 = require("../src");
// class TestEngine implements Engine<Stateable> {
//     processing: boolean
//     pipeTask: (fn: Function, arg?: any, target?: Stateable) => void
//     tasks: any[] = []
//     scheduled: boolean
//     post: any[] = []
//     scheduleTask (fn: Function, arg: any, target: any) {
//         this.tasks.push({fn, arg, target})
//     }
//     addPostEffect (fn: Function) {
//         this.post.push(fn)
//     }
//     immediate () {
//         const tasks = this.tasks
//         this.tasks = []
//         tasks.forEach(task => {
//             task.fn.call(task.target, task.arg)
//         })
//         if (this.tasks.length > 0) {
//             this.immediate()
//         }
//     }
//     schedule () {
//         if (!this.scheduled) {
//             setTimeout(() => {
//                 const tasks = this.tasks
//                 this.tasks = []
//                 this.scheduled = false
//                 tasks.forEach(task => {
//                     task.fn.call(task.target, task.arg)
//                 })
//                 if (this.tasks.length > 0 && !this.scheduled) {
//                     this.schedule()
//                 }
//                 else if (this.tasks.length == 0) {
//                     this.post.forEach(fn => fn())
//                 }
//             })
//             this.scheduled = true
//         }
//     }
//     chain (link: Engine<any>) {
//         this.post.push(() => {
//             link.schedule()
//         })
//     }
// }
var _testEngine = new src_1.BufferedEngine();
var createPatchScheduler = function () {
    return _testEngine;
};
exports.createPatchScheduler = createPatchScheduler;
// export const nextTick = () => {
//     _testEngine.schedule()
// }
var immediateTick = function () {
    _testEngine.flush();
};
exports.immediateTick = immediateTick;
var TestRenderer = /** @class */ (function (_super) {
    __extends(TestRenderer, _super);
    function TestRenderer() {
        var _this = _super.call(this) || this;
        _this.roots = [];
        return _this;
    }
    TestRenderer.prototype.isAttached = function (node) {
        throw new Error("Method not implemented.");
    };
    TestRenderer.prototype.attach = function (el, node) {
        var _this = this;
        var rootsToDetach = this.roots;
        rootsToDetach.forEach(function (root) { return _this.detach(root.node); });
        this.roots.push({ el: el, node: node });
    };
    TestRenderer.prototype.detach = function (node) {
        this.roots = this.roots.filter(function (root) { return root.node != node; });
    };
    TestRenderer.prototype.render = function () {
        for (var _i = 0, _a = this.roots; _i < _a.length; _i++) {
            var root = _a[_i];
            root.node.render();
        }
        this.flush();
    };
    TestRenderer.prototype.createVNode = function (key, vnodeProps, htmlProps, children) {
        var props = __assign({}, vnodeProps);
        if (key != null) {
            props.key = key;
        }
        Object.keys(htmlProps).filter(function (k) { return k[0] != '_'; }).forEach(function (k) {
            props[k] = htmlProps[k];
        });
        // if (elRef != null) {
        //     props.elRef = elRef
        // }
        if (children != null) {
            props.children = children;
        }
        return props;
    };
    return TestRenderer;
}(src_1.BufferedEngine));
/*
export class TestRenderer implements Renderer, Engine<any> {

    roots: RenderRoot[]
    scheduled: boolean
    tasks: Function[]

    constructor () {
        this.roots = []
        this.scheduled = false
        this.tasks = []
    }
    processing: boolean
    pipeTask: (fn: Function, arg?: any, target?: any) => void
    events: Keyed<any>

    immediate () {

    }

    addPostEffect (fn: Function) {

    }

    chain (link: Engine<any>) {

    }

    scheduleTask (fn: Function) {
        this.tasks.push(fn)
    }

    attach (el: Element, node: Renderable) {
        const rootsToDetach = this.roots
        rootsToDetach.forEach(root => this.detach(root.node))
        this.roots.push({el, node})
    }

    detach (node: Renderable) {
        this.roots = this.roots.filter(root => root.node != node)
    }
    
    schedule(): void {
        if (!this.scheduled) {
            setTimeout(() => {
                const tasks = this.tasks
                this.tasks = []
                this.scheduled = false
                // TODO отрисовка

                for (let root of this.roots) {
//                    console.log('render', (root.node as any).dirty)
                    root.node.render()
                }

                tasks.forEach(fn => fn())

                if (this.tasks.length > 0 && !this.scheduled) {
                    this.schedule()
                }
            })
            this.scheduled = true
        }
    }
    
}
*/
var _testRenderer = new TestRenderer();
var createRenderScheduler = function () {
    return _testRenderer;
};
exports.createRenderScheduler = createRenderScheduler;
var attachRoot = function (r) {
    _testRenderer.attach(null, r);
};
exports.attachRoot = attachRoot;
var immediateRender = function () {
    _testRenderer.render();
};
exports.immediateRender = immediateRender;
//# sourceMappingURL=utils.js.map