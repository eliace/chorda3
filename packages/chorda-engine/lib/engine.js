"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSimpleEngine = exports.SimpleEngine = void 0;
var core_1 = require("@chorda/core");
var SimpleEngine = /** @class */ (function () {
    function SimpleEngine() {
        this.links = [];
        this.tasks = [];
        this.isScheduled = false;
        this.subscriptions = [];
        this.pipeTasks = [];
    }
    SimpleEngine.prototype.pipeTask = function (fn, arg, target) {
        this.pipeTasks.push({ fn: fn, arg: arg, target: target });
        !this.isScheduled && this.schedule();
    };
    SimpleEngine.prototype.chain = function (link) {
        this.links.push(link);
    };
    SimpleEngine.prototype.scheduleTask = function (fn, arg, target) {
        this.tasks.push({ fn: fn, arg: arg, target: target });
        !this.isScheduled && this.schedule();
    };
    SimpleEngine.prototype.immediate = function () {
    };
    SimpleEngine.prototype.schedule = function () {
        var _this = this;
        if (!this.isScheduled) {
            setTimeout(function () {
                var t0 = performance.now();
                var tasks = _this.tasks;
                _this.tasks = [];
                _this.isScheduled = false;
                // TODO на этом этапе можно проводить анализ и перестроение порядка патчей
                var deleted = 0;
                tasks
                    .forEach(function (task) {
                    // фильтруем патчи удаленных компонентов
                    if (task.target.state == core_1.State.Destroying || task.target.state == core_1.State.Destroyed) {
                        deleted++;
                        //                            console.warn('Ignoring target in destroying or destroyed state', task.target)
                        return;
                    }
                    task.fn.call(task.target, task.arg);
                });
                // по мере исполнения пакета задач, могут накопиться другие задачи
                // если новых задач нет, переходим к следующему движку по цепочке
                if (_this.tasks.length == 0) {
                    _this.subscriptions.forEach(function (f) { return f(); });
                    _this.links.forEach(function (link) {
                        var pipeTasks = _this.pipeTasks;
                        _this.pipeTasks = [];
                        pipeTasks.forEach(function (task) { return link.scheduleTask(task.fn, task.arg, task.target); });
                        link.schedule();
                    });
                }
                else if (!_this.isScheduled) {
                    console.error('Not scheduled tasks found');
                }
                var t1 = performance.now();
                console.log('tick', tasks.length, Math.round(t1 - t0), avgTimeInterval(t0, t1, tasks.length), deleted ? '-' + deleted : '');
            });
            this.isScheduled = true;
        }
    };
    SimpleEngine.prototype.addPostEffect = function (fn) {
        this.subscriptions.push(fn);
        //        throw new Error("Method not implemented.");
    };
    return SimpleEngine;
}());
exports.SimpleEngine = SimpleEngine;
var avgTimeInterval = function (t0, t1, total) {
    return Number((Math.round(t1 - t0) / total).toFixed(5));
};
var createSimpleEngine = function () {
    return new SimpleEngine();
};
exports.createSimpleEngine = createSimpleEngine;
