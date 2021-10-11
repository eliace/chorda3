"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hub = exports.patch = exports.State = void 0;
var value_1 = require("./value");
var mix_1 = require("./mix");
var pipe_1 = require("./pipe");
var State;
(function (State) {
    State[State["Initializing"] = 0] = "Initializing";
    State[State["Initialized"] = 1] = "Initialized";
    State[State["Destroying"] = 2] = "Destroying";
    State[State["Destroyed"] = 3] = "Destroyed";
})(State = exports.State || (exports.State = {}));
var _PatchingHub = undefined;
var patch = function (o) {
    _PatchingHub.scope.$engine.publish(pipe_1.ownTask(_PatchingHub.patch, o, _PatchingHub));
    //_PatchingHub.scope.$pipe.push(ownTask(_PatchingHub.patch, o, _PatchingHub))
};
exports.patch = patch;
var _ScopeKey;
var scopeKeyAware = function (key, fn) {
    var prevScopeKey = _ScopeKey;
    _ScopeKey = key;
    fn();
    _ScopeKey = prevScopeKey;
};
var createMonitoredThenable = function (thenable) {
    var monitored = thenable.then(function (v) {
        mt.isDone = true;
        mt.isPending = false;
        return v;
    }, function (v) {
        mt.isFailed = true;
        mt.isPending = false;
        return v;
    });
    var mt = {
        isPending: true,
        isFailed: false,
        isDone: false,
        then: function (resolve, reject) { return monitored.then(resolve, reject); }
    };
    return mt;
};
var isMonitoredThenable = function (v) {
    return v.then != null;
};
// export const _iterator = <T extends []|{}>(source: T) : ValueIterator<T> => {
//     if (_ScopeKey == null) {
//         console.warn('Scope key not detected')
//     }
//     return iterator(source, String(_ScopeKey))
// }
// export const _next = <T extends {}|[], K extends keyof T=keyof T>(value: Value<T>) : T[K] => {
//     if (_ScopeKey == null) {
//         console.warn('Scope key not detected')
//     }
//     return value as any
// }
var Hub = /** @class */ (function () {
    //    _context: any
    // initialized: boolean
    // destroyed: boolean
    //    _Injectors: Injectors<any> = null
    function Hub(options, context, initScope) {
        var _this = this;
        if (context === void 0) { context = null; }
        if (initScope === void 0) { initScope = null; }
        this.options = {};
        //        this.context = context
        //        this.scope = Object.assign({}, context as any)
        this._local = {};
        //        this._context = {...context}
        //let _InjectProp: string|symbol = null
        var _InjectProps = {};
        var PropState;
        (function (PropState) {
            PropState[PropState["None"] = 0] = "None";
            PropState[PropState["Injector"] = 1] = "Injector";
            PropState[PropState["Initial"] = 2] = "Initial";
            PropState[PropState["Default"] = 3] = "Default";
            PropState[PropState["Context"] = 4] = "Context";
        })(PropState || (PropState = {}));
        // injector -> initial -> default -> context
        this.scope = new Proxy(this._local, {
            get: function (target, p) {
                if (p == '$context') {
                    return context;
                }
                //                console.log('get', p)
                var isInjected = false;
                var prop = _InjectProps[String(p)] || PropState.None;
                var prevPropState = _InjectProps[String(p)];
                var prevProp = target[p];
                //                if () {
                if ( /*!isInjected && this.state != State.Initializing &&*/(p in target)) {
                    isInjected = true;
                    //                        return (target[p] && isAutoTerminal() && target[p].$isTerminal) ? target[p].$value : target[p]
                }
                // if (this.state == State.Initializing) {
                //     isInjected = false
                //     prop = PropState.None
                //     target[p] = undefined
                // }
                // if (this.options.injections && (this.options.injections as any)['$engine']) {
                //     console.log('$engine', p, isInjected, prop)
                // }
                if (!isInjected && prop < PropState.Injector && _this.options.injections) {
                    var injector_1 = _this.options.injections[p];
                    if (injector_1 !== undefined) {
                        if (typeof injector_1 === 'function') {
                            _InjectProps[String(p)] = PropState.Injector;
                            scopeKeyAware(p, function () {
                                value_1.noAutoTerminal(function () {
                                    // const entry = injector(this.scope)
                                    // if (entry !== undefined) {
                                    //     target[p] = entry
                                    // }
                                    target[p] = injector_1(_this.scope);
                                });
                            });
                        }
                        else if (injector_1 != null) {
                            console.warn('Injector must be a function', p, injector_1);
                            return;
                        }
                        isInjected = true;
                        //                            return target[p]
                    }
                }
                //                }
                if (!isInjected && prop < PropState.Initial && initScope) {
                    //                    console.log('--- check initial ---', p)
                    var hasProp = false;
                    if (value_1.isValueSet(initScope)) {
                        hasProp = initScope.$has(p) && initScope.$at(p).$value != null;
                    }
                    else if (initScope[p] != null) {
                        hasProp = true;
                    }
                    if (hasProp) {
                        _InjectProps[String(p)] = PropState.Initial;
                        target[p] = initScope[p];
                        isInjected = true;
                    }
                }
                if (!isInjected && prop < PropState.Default && _this.options.initials) {
                    var injector_2 = _this.options.initials[p];
                    if (injector_2 !== undefined) {
                        if (typeof injector_2 === 'function') {
                            _InjectProps[String(p)] = PropState.Default;
                            scopeKeyAware(p, function () {
                                value_1.noAutoTerminal(function () {
                                    target[p] = injector_2(_this.scope);
                                });
                            });
                        }
                        else if (injector_2 != null) {
                            console.warn('Injector must be a function', p, injector_2);
                            return;
                        }
                        isInjected = true;
                        //                        return target[p]
                    }
                }
                if (!isInjected && prop < PropState.Context) {
                    _InjectProps[String(p)] = PropState.Context;
                    value_1.noAutoTerminal(function () {
                        target[p] = context[p];
                    });
                    isInjected = true;
                    // if (this.state == State.Initializing) {
                    //     isInjected = false
                    //     //_InjectProps[String(p)] = PropState.None
                    // }
                }
                if (_this.state == State.Initializing && (p == '$engine' || p == '$renderer' || p == '$pipe')) {
                    var out = (target[p] && value_1.isAutoTerminal() && target[p].$isTerminal) ? target[p].$value : target[p];
                    delete target[p];
                    _InjectProps[String(p)] = PropState.None;
                    isInjected = false;
                    return out;
                }
                //                return target[p]
                return (target[p] && value_1.isAutoTerminal() && target[p].$isTerminal) ? target[p].$value : target[p];
            },
            set: function (target, p, value) {
                // if (p == 'current') {
                //     debugger
                // }
                //                console.log('set scope value', p, value, p in target)
                // FIXME заменить на инжектирование
                if (!(p in target)) {
                    target[p] = _this.scope[String(p)]; // неявно инжектируем
                }
                // isObservable
                if (target[p] != null && (typeof target[p].$at === 'function')) {
                    target[p].$value = value;
                }
                else {
                    //                    console.error('Inject not an observable into scope', p, value)
                    target[p] = value;
                }
                return true;
            },
            has: function (target, p) {
                return Reflect.has(target, p) || Reflect.has(context, p) || (_this.options.injections && Reflect.has(_this.options.injections, p));
            },
            ownKeys: function (target) {
                var keys = __assign(__assign(__assign({}, context), target), _this.options.injections);
                return Object.keys(keys);
            },
            getOwnPropertyDescriptor: function (target, p) {
                return Reflect.getOwnPropertyDescriptor(target, p)
                    || Reflect.getOwnPropertyDescriptor(context, p)
                    || (_this.options.injections && Reflect.getOwnPropertyDescriptor(_this.options.injections, p));
            },
        });
        this.subscriptions = [];
        this.handlers = [];
        this.events = {};
        this.bindings = {};
        this.joints = [];
        this.state = State.Initializing;
        // добавляем патч в очередь задач
        this.scope.$engine.publish(pipe_1.ownTask(this.patch, options, this));
    }
    Hub.prototype.patch = function (optPatch) {
        var _this = this;
        var _a, _b;
        if (this.state == State.Destroying || this.state == State.Destroyed) {
            //            console.error('Try to patch destroyed hub')
            throw new Error('Try to patch destroyed object');
        }
        var opts = mix_1.mixin(this.options, optPatch).build(this.state == State.Initialized ? this.patchRules() : this.initRules());
        if (opts === true || opts === false) {
            throw new Error('Invalid patch option mix');
        }
        //        console.log(this.options, optPatch)
        var o = this.options = opts;
        var newSubscriptions = [];
        var newHandlers = [];
        // // Injectors
        // if (optPatch.injections) {
        //     // здесь мы должны обновлять измененные инжекторы
        //     // this._Injectors = o.injections
        //     // for (let k in o.injections) {
        //     //     this.scope[k]
        //     //     // const injector: Injector<any> = o.injections[k]
        //     //     // if (injector !== undefined) {
        //     //     //     let entry = null
        //     //     //     if (typeof injector === 'function') {
        //     //     //         entry = injector(this.scope)
        //     //     //     }
        //     //     //     else if (injector != null) {
        //     //     //         console.warn('Injector must be a function', k, injector)
        //     //     //         continue
        //     //     //     }
        //     //     //     if (this.scope[k] != entry) {
        //     //     //         // TODO здесь нужно отписываться от элемента скоупа 
        //     //     //         this.scope[k] = entry
        //     //     //     }
        //     //     // }
        //     // }
        //     // this._Injectors = null
        // }
        // Joints
        //TODO joints не должны обновляться динамически, но все равно нужно сделать обработку
        if (optPatch.joints) {
            var subscriptions = value_1.spySubscriptions(function () {
                value_1.noAutoTerminal(function () {
                    for (var k in o.joints) {
                        var joint = o.joints[k].call(_this, _this.scope);
                        if (joint && joint.then) {
                            joint = createMonitoredThenable(joint);
                        }
                        _this.joints.push(joint);
                        // for (let i in o.joints[k]) {
                        //     if (o.joints[k][i]) {
                        //         const joint = o.joints[k][i].call(this, this.scope[k], this.scope)
                        //         this.joints.push(joint)    
                        //     }
                        // }
                    }
                });
            });
            newSubscriptions = newSubscriptions.concat(subscriptions);
        }
        // Reactors
        if (optPatch.reactions) {
            var _loop_1 = function (k) {
                if (o.reactions[k] && !this_1.bindings[k]) {
                    this_1.bindings[k] = this_1.patchAware(o.reactions[k]); //scopeKeyAware.bind(this, k, this.patchAware(o.reactions[k])) 
                    var entry_1 = this_1.scope[k];
                    var binding_1 = this_1.bindings[k];
                    if (value_1.isObservable(entry_1)) {
                        var sub = entry_1.$subscribe(function (next, prev) {
                            value_1.autoTerminalAware(function () {
                                scopeKeyAware(k, function () {
                                    binding_1(entry_1.$isTerminal ? next : entry_1, prev);
                                });
                            });
                        });
                        newSubscriptions.push(sub);
                    }
                    else {
                        binding_1(entry_1, undefined);
                    }
                }
            };
            var this_1 = this;
            for (var k in o.reactions) {
                _loop_1(k);
            }
        }
        // Events
        if (optPatch.events) {
            var _loop_2 = function (i) {
                if (o.events[i] && !this_2.events[i]) {
                    this_2.events[i] = o.events[i]; // FIXME
                    var _loop_3 = function (k) {
                        var bus = this_2.scope[k];
                        var callback = this_2.events[i];
                        if (value_1.isEventBus(bus) && bus.$hasEvent(i)) {
                            var handler = bus.$on(i, function (evt) {
                                value_1.noAutoTerminal(function () {
                                    callback(evt, _this.scope);
                                });
                            }, this_2);
                            newHandlers.push(handler); // FIXME
                        }
                    };
                    for (var k in this_2.scope) {
                        _loop_3(k);
                    }
                    var events = o.events[i];
                    if (typeof events === 'function') {
                        if (value_1.isCallable(this_2.scope[i])) {
                            var bus = this_2.scope[i];
                            var callback_1 = events;
                            var handler = bus.$on('done', function () {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                value_1.noAutoTerminal(function () {
                                    callback_1.apply(null, __spreadArray(__spreadArray([], args), [_this.scope]));
                                });
                            }, this_2);
                            newHandlers.push(handler); // FIXME
                        }
                    }
                    else if (typeof events === 'object') {
                        var bus = this_2.scope[i];
                        var _loop_4 = function (k) {
                            // FIXME добавить регистрацию событий
                            var callback = events[k];
                            if (callback && value_1.isEventBus(bus) /*&& bus.$hasEvent(i)*/) {
                                var handler = bus.$on(k, function () {
                                    var args = [];
                                    for (var _i = 0; _i < arguments.length; _i++) {
                                        args[_i] = arguments[_i];
                                    }
                                    value_1.noAutoTerminal(function () {
                                        callback.apply(null, __spreadArray(__spreadArray([], args), [_this.scope]));
                                    });
                                }, this_2);
                                newHandlers.push(handler); // FIXME
                            }
                        };
                        for (var k in events) {
                            _loop_4(k);
                        }
                    }
                }
            };
            var this_2 = this;
            for (var i in o.events) {
                _loop_2(i);
            }
        }
        // освежаем реакции
        //        noAutoTerminal(() => {
        // if (newSubscriptions.length) {
        //     console.log('new subscriptions', newSubscriptions)
        // }
        for (var _i = 0, newSubscriptions_1 = newSubscriptions; _i < newSubscriptions_1.length; _i++) {
            var sub = newSubscriptions_1[_i];
            if (sub == null) {
                console.error('Undefined subscription');
            }
            else {
                sub.observable.$touch(sub.subscriber);
            }
        }
        //        })
        // TODO предполагается, что повторов подписок нет
        this.subscriptions = this.subscriptions.concat(newSubscriptions);
        this.handlers = this.handlers.concat(newHandlers);
        if (this.state == State.Initializing) {
            this.state = State.Initialized;
            (_b = (_a = this.events).afterInit) === null || _b === void 0 ? void 0 : _b.call(_a, this, this.scope);
        }
        // if (this.events['patch']) {
        //     this.events['patch'](this.options, this.scope)
        // }
    };
    Hub.prototype.destroy = function (deferred) {
        var _this = this;
        // исключаем повторное удаление
        if (this.state == State.Destroying || this.state == State.Destroyed) {
            return;
        }
        // обрабатываем хуки отключения скоупа
        var disjointPromise = null;
        if (this.joints.length > 0) {
            var promises = [];
            for (var _i = 0, _a = this.joints; _i < _a.length; _i++) {
                var disjoint = _a[_i];
                if (disjoint) {
                    if (isMonitoredThenable(disjoint)) {
                        debugger;
                        disjoint.isPending && promises.push(disjoint);
                    }
                    else if (typeof disjoint === 'function') {
                        var eff = disjoint();
                        if (eff && eff.then) {
                            promises.push(eff);
                        }
                    }
                }
            }
            this.joints = [];
            if (promises.length > 0) {
                disjointPromise = Promise.all(promises);
            }
        }
        // удаляем подписки на изменения
        for (var _b = 0, _c = this.subscriptions; _b < _c.length; _b++) {
            var sub = _c[_b];
            if (sub == null) {
                console.error('Undefined subscription');
            }
            else {
                sub.observable.$unsubscribe(sub);
            }
        }
        // удаляем подписки на события
        for (var _d = 0, _e = this.handlers; _d < _e.length; _d++) {
            var h = _e[_d];
            h.bus.$off(h);
        }
        //        this.bindings = {}
        this.events = {};
        //        this.subscriptions = []
        this.handlers = [];
        if (disjointPromise) {
            this.state = State.Destroying;
            disjointPromise.then(function () {
                // завершаем удаление, только если статус на удалении
                if (_this.state == State.Destroying) {
                    deferred && deferred();
                    _this.scope = null;
                    _this.state = State.Destroyed;
                    console.log('Delayed destroy done');
                }
            }, function (err) {
                console.log('Delayed destroy fail', err);
            });
        }
        else {
            deferred && deferred();
            this.scope = null;
            this.state = State.Destroyed;
        }
        // // отложенное удаление
        // if (promise) {
        //     this.state = State.Destroying
        //     promise.then(() => {
        //         // продолжаем удаление, если оно не отменено
        //         if (this.state == State.Destroying) {
        //             //this.state = State.Initialized // ?
        //             this.destroy()
        //             //this.scope.$engine.immediate(this) // ?
        //         }
        //      }, (err) => {
        //         console.log('Delayed destroy fail', err)
        //      })
        //     return
        // }
        // if (disjointPromise) {
        //     this.state = State.Destroying
        //     disjointPromise.then(() => {
        //         // продолжаем удаление, если оно не отменено
        //         // if (this.state == State.Destroying) {
        //         //     //this.state = State.Initialized // ?
        //         //     this.destroy()
        //         //     //this.scope.$engine.immediate(this) // ?
        //         // }
        //      }, (err) => {
        //         console.log('Delayed destroy fail', err)
        //      })            
        // }
        // else {
        //     this.state = State.Destroyed
        // }
    };
    Hub.prototype.patchAware = function (callback) {
        var _this = this;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var prevPatchingTarget = _PatchingHub;
            _PatchingHub = _this;
            callback.apply(_this, args);
            _PatchingHub = prevPatchingTarget;
        };
    };
    // emit (name: string, event: any) {
    //     this.events[name](event, this.scope)
    // }
    Hub.prototype.initRules = function () {
        return {};
    };
    Hub.prototype.patchRules = function () {
        return {};
    };
    Hub.prototype.reset = function (nextOpts) {
        this.state = State.Initializing;
        if (nextOpts != null) {
            console.warn('component update not yet ready', nextOpts, this);
            this.patch(nextOpts);
            return;
        }
        // FIXME возможно, необходимо сначала почистить хаб
        this.patch(this.options);
    };
    return Hub;
}());
exports.Hub = Hub;
//# sourceMappingURL=Hub.js.map