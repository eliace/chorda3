"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.commitEngine = exports.currentTransaction = exports.transactionUpdates = exports.closeTransaction = exports.openTransaction = void 0;
var utils_1 = require("./utils");
var _Session = null;
var openTransaction = function () {
    var t = { joined: true };
    if (!_Session) {
        _Session = {
            nodes: new Set(),
            head: _this,
            deleted: [],
            updated: []
        };
        t.joined = false;
    }
    // else {
    //     debugger
    // }
    return t;
};
exports.openTransaction = openTransaction;
var closeTransaction = function (t) {
    if (!t.joined) {
        if (_Session.updated.length > 0 || _Session.deleted.length > 0) {
            _engine.addSession(_Session);
        }
        _Session = null;
    }
};
exports.closeTransaction = closeTransaction;
var transactionUpdates = function (t) {
    return _Session.updated;
};
exports.transactionUpdates = transactionUpdates;
var currentTransaction = function () {
    return _Session;
};
exports.currentTransaction = currentTransaction;
var UpdateEngine = /** @class */ (function () {
    //    _commitedSubscriptions: Set<Subscription>
    function UpdateEngine() {
        this._sessions = [];
        this._commitedNodes = new Map();
        //        this._commitedSubscriptions = new Set<Subscription>()
    }
    UpdateEngine.prototype.addSession = function (session) {
        this._sessions.push(session);
    };
    UpdateEngine.prototype.commit = function () {
        var _this = this;
        if (!this._commiting) {
            //            console.log('commit', this._sessions)
            //            this._commitedNodes.size == 0 && console.log('Commit start')
            this._commiting = true;
            var sessions = this._sessions;
            this._sessions = [];
            sessions.forEach(function (session) {
                //                console.log('session', session.updated)
                // ?
                session.deleted.forEach(function (del) {
                    //                    if (del.$subscriptions.length == 0) {
                    del.$destroy();
                    // }
                    // console.log('del has subscriptions', del)
                });
                //                const lastUpdateMap = new Map<Subscriber<any>, NodeUpdate>()
                session.updated.forEach(function (upd) {
                    if (_this._commitedNodes.has(upd.node)) {
                        //console.warn('Cyclic update detected', upd.prev, upd.next)
                        if (upd.next === _this._commitedNodes.get(upd.node)) {
                            console.warn('Possible cyclic update', upd);
                            return;
                        }
                        //                        return
                    }
                    upd.node.$subscriptions.forEach(function (sub) {
                        //                        console.log('publish to subscriber', upd.next)
                        sub.subscriber.$publish(upd.next, upd.prev, utils_1.EMPTY);
                    });
                    _this._commitedNodes.set(upd.node, upd.next);
                });
                // lastUpdateMap.forEach((upd, sub) => {
                //     sub.$publish(upd.next, upd.prev, EMPTY)
                // })
                //                 session.updated.forEach(upd => {
                //                     if (this._commitedNodes.has(upd.node)) {
                //                         if (upd.next == 'filter: Albania') {
                //                             debugger
                //                         }
                // //                        console.log('Already commited', upd, upd.node._memoValue)
                //                         return
                //                     }
                //                     upd.node._subscriptions.forEach(sub => {
                //                         sub.subscriber.$publish(upd.next, upd.prev, EMPTY)
                //                     })
                //                 })
                //                this._commitedNodes.add(session.head as Node<any>)
            });
            this._commiting = false;
            if (this._sessions.length > 0) {
                this.commit();
                //                console.log('commit')
            }
            else {
                this._commitedNodes.clear();
                //                console.log('Commit end')
            }
        }
    };
    return UpdateEngine;
}());
var _engine = new UpdateEngine();
var commitEngine = function () {
    return _engine;
};
exports.commitEngine = commitEngine;
//# sourceMappingURL=engine.js.map