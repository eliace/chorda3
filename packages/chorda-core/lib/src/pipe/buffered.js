"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferedEngine = void 0;
var utils_1 = require("./utils");
var BufferedEngine = /** @class */ (function () {
    function BufferedEngine() {
        this.tasks = [];
        this.subscriptions = [];
        this.processing = false;
    }
    BufferedEngine.prototype.publish = function (task) {
        if (task.done) {
            return;
        }
        this.tasks.push(task);
    };
    BufferedEngine.prototype.subscribe = function (engine) {
        if (this.subscriptions.indexOf(engine) == -1) {
            this.subscriptions.push(engine);
            return true;
        }
        return false;
    };
    BufferedEngine.prototype.unsubscribe = function (engine) {
        this.subscriptions = this.subscriptions.filter(function (sub) { return sub != engine; });
    };
    BufferedEngine.prototype.task = function (fn, arg, target) {
        return { fn: fn, arg: arg, target: target, engine: this };
    };
    BufferedEngine.prototype.flush = function () {
        this.processing = true;
        var tasks = this.tasks;
        this.tasks = [];
        tasks
            .filter(utils_1.ownTaskFilter(this))
            .filter(utils_1.subscriptionTaskFilter(this.subscriptions))
            .filter(utils_1.unknownTaskFilter(this.subscriptions));
        if (this.tasks.length > 0) {
            this.flush();
        }
        this.processing = false;
    };
    Object.defineProperty(BufferedEngine.prototype, "isProcessing", {
        get: function () {
            return this.processing;
        },
        enumerable: false,
        configurable: true
    });
    return BufferedEngine;
}());
exports.BufferedEngine = BufferedEngine;
//# sourceMappingURL=buffered.js.map