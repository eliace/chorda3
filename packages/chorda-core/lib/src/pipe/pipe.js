"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipe = void 0;
var SimplePipe = /** @class */ (function () {
    function SimplePipe(schedulers) {
        this.head = schedulers[0];
        this.subscriptions = [];
        for (var i = 1; i < schedulers.length; i++) {
            if (schedulers[i - 1].subscribe(schedulers[i])) {
                this.subscriptions.push([schedulers[i - 1], schedulers[i]]);
            }
        }
    }
    SimplePipe.prototype.push = function (task) {
        this.head.publish(task);
        return this;
    };
    SimplePipe.prototype.asap = function (task) {
        if (task.engine && task.engine.isProcessing) {
            task.engine.publish(task);
        }
        else {
            this.head.publish(task);
        }
        return this;
    };
    SimplePipe.prototype.destroy = function () {
        this.subscriptions.forEach(function (sub) {
            sub[0].unsubscribe(sub[1]);
        });
    };
    return SimplePipe;
}());
var pipe = function () {
    var schedulers = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        schedulers[_i] = arguments[_i];
    }
    return new SimplePipe(schedulers);
};
exports.pipe = pipe;
//# sourceMappingURL=pipe.js.map