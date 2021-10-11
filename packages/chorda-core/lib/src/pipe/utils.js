"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unknownTaskFilter = exports.subscriptionTaskFilter = exports.ownTaskFilter = exports.ownTask = void 0;
var ownTask = function (fn, arg, target) {
    return { fn: fn, arg: arg, target: target };
};
exports.ownTask = ownTask;
var ownTaskFilter = function (owner) { return function (task) {
    var _a;
    if (!task.engine || task.engine == owner) {
        //        console.log('task', task.arg, task.target)
        // исполняем задачу
        (_a = task.fn) === null || _a === void 0 ? void 0 : _a.call(task.target, task.arg);
        task.done = true;
    }
    else {
        return true;
    }
}; };
exports.ownTaskFilter = ownTaskFilter;
var subscriptionTaskFilter = function (subscriptions) { return function (task) {
    var engine = subscriptions.find(function (sub) { return sub == task.engine; });
    if (engine) {
        engine.publish(task);
    }
    else {
        return true;
    }
}; };
exports.subscriptionTaskFilter = subscriptionTaskFilter;
var unknownTaskFilter = function (subscriptions) { return function (task) {
    subscriptions.forEach(function (sub) {
        sub.publish(task);
    });
}; };
exports.unknownTaskFilter = unknownTaskFilter;
//# sourceMappingURL=utils.js.map