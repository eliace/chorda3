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
Object.defineProperty(exports, "__esModule", { value: true });
var pipe_1 = require("../src/pipe");
// class TestPipe implements Pipe {
//     head: Scheduler
//     subscriptions: [Scheduler, Scheduler][]
//     constructor (engines: Scheduler[]) {
//         this.head = engines[0]
//         this.subscriptions = []
//         for (let i = 1; i < engines.length; i++) {
//             if (engines[i-1].subscribe(engines[i])) {
//                 this.subscriptions.push([engines[i-1], engines[i]])
//             }
//         }
//     }
//     push (task: Task): Pipe {
//         this.head.publish(task)
//         return this
//     }
//     asap (task: Task): Pipe {
//         this.head.publish(task)
//         return this        
//     }
// }
var AsyncPatchEngine = /** @class */ (function (_super) {
    __extends(AsyncPatchEngine, _super);
    function AsyncPatchEngine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AsyncPatchEngine;
}(pipe_1.AsyncEngine));
var AnimationRenderEngine = /** @class */ (function (_super) {
    __extends(AnimationRenderEngine, _super);
    function AnimationRenderEngine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnimationRenderEngine.prototype.publish = function (task) {
        throw new Error('Method not implemented.');
    };
    return AnimationRenderEngine;
}(AsyncPatchEngine));
var task = function (fn, arg, target) {
    return { fn: fn, arg: arg, target: target };
};
// const pipe = (...engines: Scheduler[]) => {
//     return new TestPipe(engines)
// }
describe('Pipe', function () {
    it('Should pipe engines', function (done) {
        var engine = new AsyncPatchEngine();
        var engine2 = new AsyncPatchEngine();
        engine.subscribe(engine2);
        engine.publish(engine2.task(function () {
            console.log('end');
            done();
        }));
        engine.publish(task(function () { return console.log('1'); }));
        engine.publish(task(function () { return console.log('2'); }));
        engine.publish(task(function () { return console.log('3'); }));
    });
    it('Should fork pipe', function () {
        var engine = new AsyncPatchEngine();
        var engine2 = new AsyncPatchEngine();
        var engine3 = new AsyncPatchEngine();
        pipe_1.pipe(engine, engine2);
        pipe_1.pipe(engine, engine3);
        pipe_1.pipe(engine)
            .push(engine2.task(function () { return console.log('2'); }))
            .push(engine3.task(function () { return console.log('3'); }))
            .push(task(function () { return console.log('1'); }));
    });
    it('Should transition task', function (done) {
        var engine = new AsyncPatchEngine();
        var engine2 = new AsyncPatchEngine();
        var engine3 = new AsyncPatchEngine();
        pipe_1.pipe(engine, engine2, engine3).push(engine3.task(function () {
            console.log('end');
            done();
        }));
        // engine.subscribe(engine2)
        // engine2.subscribe(engine3)
        // engine.publish(engine3.task(() => {
        //     console.log('end')
        //     done()
        // }))
    });
});
//# sourceMappingURL=Pipe.test.js.map