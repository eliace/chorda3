"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncEngine = void 0;
var utils_1 = require("./utils");
var avgTimeInterval = function (t0, t1, total) {
    return Number((Math.round(t1 - t0) / total).toFixed(5));
};
var AsyncEngine = /** @class */ (function () {
    function AsyncEngine(name) {
        this.tasks = [];
        this.subscriptions = [];
        this.deferred = [];
        this.scheduled = false;
        this.name = name || 'default';
    }
    AsyncEngine.prototype.publish = function (task) {
        if (task.done) {
            return;
        }
        this.tasks.push(task);
        !this.scheduled && this.schedule();
    };
    AsyncEngine.prototype.subscribe = function (engine) {
        if (this.subscriptions.indexOf(engine) == -1) {
            this.subscriptions.push(engine);
            return true;
        }
        return false;
    };
    AsyncEngine.prototype.unsubscribe = function (engine) {
        this.subscriptions = this.subscriptions.filter(function (sub) { return sub != engine; });
    };
    AsyncEngine.prototype.task = function (fn, arg, target) {
        return { fn: fn, arg: arg, target: target, engine: this };
    };
    AsyncEngine.prototype.schedule = function () {
        var _this = this;
        if (this.scheduled) {
            return;
        }
        this.scheduled = true;
        setTimeout(function () {
            //            console.log(`[${this.name}] tick start`, this.tasks.length)
            var t0 = performance.now();
            _this.scheduled = false;
            _this.processing = true;
            //            console.log('tick')
            var tasks = _this.tasks;
            _this.tasks = [];
            _this.deferred = _this.deferred.concat(_this.process(tasks));
            // отправляем чужие задачи дальше по конвейеру
            if (_this.tasks.length == 0) {
                _this.deferred
                    .filter(utils_1.subscriptionTaskFilter(_this.subscriptions))
                    .filter(utils_1.unknownTaskFilter(_this.subscriptions));
            }
            else if (!_this.scheduled) {
                console.error('Non scheduled tasks detected', _this.tasks);
            }
            _this.processing = false;
            var t1 = performance.now();
            console.log("[" + _this.name + "] patch end", tasks.length, Math.round(t1 - t0), avgTimeInterval(t0, t1, tasks.length) /*, deleted ? '-'+deleted : ''*/);
        });
    };
    AsyncEngine.prototype.process = function (tasks) {
        return tasks.filter(utils_1.ownTaskFilter(this));
    };
    Object.defineProperty(AsyncEngine.prototype, "isProcessing", {
        get: function () {
            return this.processing;
        },
        enumerable: false,
        configurable: true
    });
    return AsyncEngine;
}());
exports.AsyncEngine = AsyncEngine;
//# sourceMappingURL=async.js.map