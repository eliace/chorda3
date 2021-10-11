"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEventBus = exports.defaultUidFunc = exports.EMPTY = void 0;
exports.EMPTY = Object.seal({});
// let _SubscriptionSpy = []
// export const spySubscriptions = (fn: Function) : Subscription[] => {
//     // TODO
//     return []
// }
// let _AutoSubscriber : Subscriber<any> = null
// export const checkAutoSubscriber = () : Subscriber<any> => {
//     return _AutoSubscriber
// }
var defaultUidFunc = function (v) {
    if (v == null) {
        return undefined;
    }
    var uid = undefined;
    if (typeof v == 'string' || typeof v == 'number' || typeof v == 'boolean' || typeof v == 'symbol') {
        uid = String(v);
    }
    else if (v.id != null) {
        uid = String(v.id);
    }
    else {
        //        console.warn('Uid function should be defined', v)
    }
    if (uid == '[object Object]') {
        console.warn('Uid should be a primitive value', uid, v);
    }
    return uid;
};
exports.defaultUidFunc = defaultUidFunc;
var isEventBus = function (v) {
    return v != null && v.$hasEvent != undefined;
};
exports.isEventBus = isEventBus;
//# sourceMappingURL=utils.js.map