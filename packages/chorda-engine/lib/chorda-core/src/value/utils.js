"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEventBus = exports.isObservable = exports.defaultUidFunc = exports.isValueIterator = void 0;
var isValueIterator = function (v) {
    return !!(v.next);
};
exports.isValueIterator = isValueIterator;
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
        console.warn('Uid function should be defined', v);
    }
    if (uid == '[object Object]') {
        console.warn('Uid should be a primitive value', uid, v);
    }
    return uid;
};
exports.defaultUidFunc = defaultUidFunc;
var isObservable = function (v) {
    return v.$subscribe != undefined;
};
exports.isObservable = isObservable;
var isEventBus = function (v) {
    return v.$hasEvent != undefined;
};
exports.isEventBus = isEventBus;
