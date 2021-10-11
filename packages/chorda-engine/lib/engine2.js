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
exports.createAsyncPatcher = exports.PatchEngine = void 0;
var core_1 = require("@chorda/core");
var destroyedTaskFilter = function (task) {
    if (task.target && (task.target.state == core_1.State.Destroying || task.target.state == core_1.State.Destroyed)) {
        //        deleted++
        //      console.warn('Ignoring target in destroying or destroyed state', task.target)
        return false;
    }
    return true;
};
var avgTimeInterval = function (t0, t1, total) {
    return Number((Math.round(t1 - t0) / total).toFixed(5));
};
var PatchEngine = /** @class */ (function (_super) {
    __extends(PatchEngine, _super);
    function PatchEngine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PatchEngine.prototype.process = function (tasks) {
        var _this = this;
        return tasks.filter(function (task) {
            if (task.target && (task.target.state == core_1.State.Destroying || task.target.state == core_1.State.Destroyed)) {
                //        deleted++
                //      console.warn('Ignoring target in destroying or destroyed state', task.target)
                return false;
            }
            return core_1.ownTaskFilter(_this)(task);
        });
        // return tasks
        //     .filter(destroyedTaskFilter)
        //     .filter(ownTaskFilter(this))
    };
    return PatchEngine;
}(core_1.AsyncEngine));
exports.PatchEngine = PatchEngine;
var createAsyncPatcher = function (name) {
    return new PatchEngine(name);
};
exports.createAsyncPatcher = createAsyncPatcher;
