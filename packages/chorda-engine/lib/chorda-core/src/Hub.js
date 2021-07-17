"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patch = exports.Hub = exports.State = void 0;
var value_1 = require("./value");
var mix_1 = require("./mix");
var State;
(function (State) {
    State[State["Initializing"] = 0] = "Initializing";
    State[State["Initialized"] = 1] = "Initialized";
    State[State["Destroying"] = 2] = "Destroying";
    State[State["Destroyed"] = 3] = "Destroyed";
})(State = exports.State || (exports.State = {}));
var Hub = /** @class */ (function () {
    // initialized: boolean
    // destroyed: boolean
    function Hub(options, context) {
        this.options = {};
        //        this.context = context
        this.scope = Object.assign({}, context);
        this.subscriptions = [];
        this.handlers = [];
        this.events = {};
        this.bindings = {};
        this.joints = [];
        this.state = State.Initializing;
        // добавляем патч в очередь задач
        this.scope.$engine.addTask(this.patch, options, this);
    }
    Hub.prototype.patch = function (optPatch) {
        var _this = this;
        var opts = mix_1.mix(this.options, optPatch).build(this.state == State.Initialized ? this.patchRules() : this.initRules());
        if (opts === true || opts === false) {
            throw new Error('Invalid patch option mix');
        }
        var o = this.options = opts;
        var newSubscriptions = [];
        var newHandlers = [];
        // Injectors
        if (optPatch.injectors) {
            for (var k in o.injectors) {
                var injector = o.injectors[k];
                if (injector !== undefined) {
                    var entry = injector(this.scope); //, this)
                    // if (typeof entry === 'function') {
                    //     entry = o.injectors[k](this.scope)//, this)
                    // }
                    if (this.scope[k] != entry) {
                        // TODO здесь нужно отписываться от элемента скоупа 
                        this.scope[k] = entry;
                    }
                }
            }
        }
        // Joints
        //TODO joints не должны обновляться динамически, но все равно нужно сделать обработку
        if (optPatch.joints) {
            var subscriptions = value_1.spySubscriptions(function () {
                for (var k in o.joints) {
                    for (var i in o.joints[k]) {
                        if (o.joints[k][i]) {
                            var joint = o.joints[k][i].call(_this, _this.scope[k], _this.scope);
                            _this.joints.push(joint);
                        }
                    }
                }
            });
            newSubscriptions = newSubscriptions.concat(subscriptions);
        }
        // Reactors
        if (optPatch.reactors) {
            var _loop_1 = function (k) {
                if (o.reactors[k] && !this_1.bindings[k]) {
                    this_1.bindings[k] = this_1.patchAware(o.reactors[k]);
                    var entry_1 = this_1.scope[k];
                    var binding_1 = this_1.bindings[k];
                    if (value_1.isObservable(entry_1)) {
                        var sub = entry_1.$subscribe(function (next, prev) {
                            binding_1(entry_1.$isTerminal ? next : entry_1, prev);
                        });
                        newSubscriptions.push(sub);
                    }
                    else {
                        binding_1(entry_1, undefined);
                    }
                }
            };
            var this_1 = this;
            for (var k in o.reactors) {
                _loop_1(k);
            }
        }
        // Events
        if (optPatch.events) {
            for (var i in o.events) {
                if (o.events[i] && !this.events[i]) {
                    this.events[i] = o.events[i];
                    var _loop_2 = function (k) {
                        var bus = this_2.scope[k];
                        var callback = this_2.events[i];
                        if (value_1.isEventBus(bus) && bus.$hasEvent(i)) {
                            var handler = bus.$on(i, function (evt) {
                                callback(evt, _this.scope);
                            }, this_2);
                            newHandlers.push(handler);
                        }
                    };
                    var this_2 = this;
                    for (var k in this.scope) {
                        _loop_2(k);
                    }
                }
            }
        }
        // освежаем новых подписчиков
        for (var _i = 0, newSubscriptions_1 = newSubscriptions; _i < newSubscriptions_1.length; _i++) {
            var sub = newSubscriptions_1[_i];
            sub.target.$touch(sub.subscriber);
        }
        // TODO предполагается, что повторов подписок нет
        this.subscriptions = this.subscriptions.concat(newSubscriptions);
        this.handlers = this.handlers.concat(newHandlers);
        if (this.state == State.Initializing) {
            this.state = State.Initialized;
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
                    var eff = disjoint();
                    if (eff && eff.then) {
                        promises.push(eff);
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
            sub.target.$unsubscribe(sub);
        }
        // удаляем подписки на события
        for (var _d = 0, _e = this.handlers; _d < _e.length; _d++) {
            var h = _e[_d];
            h.bus.$off(h);
        }
        this.bindings = {};
        this.events = {};
        this.subscriptions = [];
        this.handlers = [];
        if (disjointPromise) {
            this.state = State.Destroying;
            disjointPromise.then(function () {
                // завершаем удаление, только если статус на удалении
                if (_this.state == State.Destroying) {
                    _this.scope = {};
                    deferred && deferred();
                    _this.state = State.Destroyed;
                }
            }, function (err) {
                console.log('Delayed destroy fail', err);
            });
        }
        else {
            this.scope = {};
            deferred && deferred();
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
            var prevPatchingTarget = _PatchingScope;
            _PatchingScope = _this;
            callback.apply(_this, args);
            _PatchingScope = prevPatchingTarget;
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
            return;
        }
        // FIXME возможно, необходимо сначала почистить хаб
        this.patch(this.options);
    };
    return Hub;
}());
exports.Hub = Hub;
var _PatchingScope = undefined;
var patch = function (o) {
    _PatchingScope.scope.$engine.addTask(_PatchingScope.patch, o, _PatchingScope);
};
exports.patch = patch;
