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
exports.computable = void 0;
var node_1 = require("./node");
var observable_1 = require("./observable");
var ComputableNode = /** @class */ (function (_super) {
    __extends(ComputableNode, _super);
    function ComputableNode(computor, initValue) {
        var _this = _super.call(this, initValue) || this;
        _this._computor = computor;
        _this._touched = false;
        return _this;
    }
    ComputableNode.prototype.$compute = function () {
        var _this = this;
        var result = undefined;
        node_1.spyGetters(function () {
            result = observable_1.autoTerminal(_this._computor);
        }).forEach(function (dep) {
            dep.$subscribe(_this);
        });
        return result;
    };
    ComputableNode.prototype.$touch = function (subscriber) {
        if (!this._touched) {
            this._memoValue = this.$compute();
            this._touched = true;
        }
        subscriber.$publish(this._memoValue, undefined, node_1.EMPTY);
    };
    ComputableNode.prototype.$publish = function (next, prev, keys) {
        var computed = this.$compute();
        this._updateEntries(computed);
        // TODO почему DESC?
        this.$update(node_1.UpdateDirection.DESC, computed, null, node_1.EMPTY);
    };
    return ComputableNode;
}(observable_1.ProxyObservableNode));
var _computeQue = [];
var computable = function (compute, initValue) {
    var c = new ComputableNode(compute, initValue);
    setTimeout(function () {
        while (_computeQue.length) {
            _computeQue.shift().$publish(null);
        }
    });
    _computeQue.push(c);
    return observable_1.proxify(null, c);
};
exports.computable = computable;
