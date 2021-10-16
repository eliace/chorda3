import { Value, EventBus, Subscription, ObservableValue, Handler, isEventBus, isObservable, noAutoTerminal, ValueIterator, ValueSet, autoTerminalAware, isAutoTerminal, Observable, Thenable, isCallable, spySubscriptions, isValueSet, isLastValue } from './value'
import { MixRules, mixin } from './mix'
import { ownTask, Pipe, Scheduler } from './pipe'


export type Scope = {
    [k: string]: any
}

// https://stackoverflow.com/a/56688073
export type NoInfer<T> = [T][T extends any ? 0 : never]

// Scope

export type Scoped<D> = {
    [P in keyof D]?: D[P]&Value<D[P]>
}

type EventScoped<D> = {
    [P in keyof D]?: D[P]&Value<D[P]>&EventBus<any>
}

type ObservableScoped<D> = {
    [P in keyof D]?: D[P]&ObservableValue<D[P]>&EventBus<any>&ObservableScoped<D[P]>
}

// Scope injections

type Injectors<D> = {
    [P in keyof NoInfer<D>]?: Injector<D, D[P]>
}

export type Injector<D, R=any> = (scope: Scoped<D>&{$context?: Scoped<D>}) => R


// Scope listeners

type L<T, S> = T extends (...args: any[]) => infer R ? Listener<S, R> : Listeners<T, S>// (T extends number|string|any[] ? any : Listeners<T, S>)// NestedListeners<T, D>// Listeners<T>

// type L2<T, D> = T extends (...args: any[]) => infer R ? Listener<D, R> : any

// type NestedListeners<T, S=T> = {
//     [P in keyof T]?: L2<T[P], S>
// }

//type X = ((...args: any[]) => any) | {[k: string]: Function}

type Listeners<E, S> = {
//    [P in keyof D]?: Listener<D, D[P]>
    [P in keyof E]?: L<E[P], S>// D[P] extends (...args: any[]) => infer R ? Listener<D, R> : Listeners<D[P]> //(D[P] extends object ? Listeners<D[P]> : never)//Listeners<D[P]>
} //& Keyed<any>

type MethodsAndObjectsOf<D> = {
    [P in keyof D as D[P] extends ((...args: any[]) => any) | {[k: string]: any} ? P : never]?: D[P]// extends (...args: any[]) => any ? D[P] : never
}

export type MethodsOf<D> = {
    [P in keyof D as D[P] extends ((...args: any) => any) ? P : never]?: D[P]// extends (...args: any[]) => any ? D[P] : never
}


type ObjectsOf<D> = {
    [P in keyof D as D[P] extends {[k: string]: any} ? P : never]?: D[P]// extends (...args: any[]) => any ? D[P] : never
}


/*
type d = {
    onLoad: () => void
    a: number
    b: {}
    c: DOMRect
    d: string
}

type e = {
    a: {
        aaa: () => void
    }
    x: {
        xxx: () => void
    }
    onTest: () => void
}


type Test = {}

type x = MethodsOf<d>


type l<T> = {
    [P in keyof T]?: T[P]
}

const l2: Listeners<d, e> = {
}

for (let k in l2) {
    const a = l2[k]
}
*/

type AsyncListeners<D, R> = {
    done?: Listener<D, R>
    fail?: Listener<D, any>
}

export type Listener<D, R> = (event: R, scope: EventScoped<D>) => boolean | unknown //) | AsyncListeners<D, R>

// Scope bindings

type Reactor<T> = (next: T, prev: T, helpers: ReactionHelpers) => void

type Reactors<T> = {
    [P in keyof T]?: Reactor<NoInfer<T[P]>>
}

// Scope joints

type EventActions<E> = {
    [P in keyof E]?: (event: E[P]) => void
}

export type Joint<T/*, P extends keyof T=keyof T*/> = (/*o: ObservableValue<T[P]>&EventBus<any>&T[P],*/ scope: ObservableScoped<T>) => Function|Promise<void>|void

type Joints<T> = {
    [key: string]: Joint<NoInfer<T>>
    // [P in keyof T]?: {
    //     [key: string]: Joint<T, P>
    // }
}


export interface HubOptions<D, E> {
    // инжекторы скоупа
    injections?: Injectors<D>
    // кастомизация скоупа
    joints?: Joints<D>
    // инжекторы по умолчанию
    initials?: Injectors<D>

    // изменения скоупа
    reactions?: Reactors<D>
    // слушатели скоупа
    events?: Listeners<MethodsAndObjectsOf<E>, D>
}


export type HubScope = {
    $engine: Scheduler
    $pipe: Pipe
//    afterDestroy?: () => void
}

export type HubEvents = {
    afterInit: () => Stateable
    afterDestroy: () => void
}




export enum State {
    Initializing,
    Initialized,
    Destroying,
    Destroyed
}

export interface Stateable {
    readonly state: State
}

export type Indexed<T=unknown> = T[]

export type Keyed<T=unknown> = {
    [key: string]: T
}



let _PatchingHub : Hub<unknown, any> = undefined

export const patch = (o: any) => {
    _PatchingHub.scope.$engine.publish(ownTask(_PatchingHub.patch, o, _PatchingHub))
    //_PatchingHub.scope.$pipe.push(ownTask(_PatchingHub.patch, o, _PatchingHub))
}

let _ScopeKey: string|symbol

const scopeKeyAware = (key: string|symbol, fn: Function) => {
    const prevScopeKey = _ScopeKey
    _ScopeKey = key
    fn()
    _ScopeKey = prevScopeKey
}


interface MonitoredThenable extends Thenable {
    isPending: boolean
    isDone: boolean
    isFailed: boolean
}

const createMonitoredThenable = (thenable: Thenable) : Thenable => {
    const monitored = thenable.then((v: unknown) => {
        mt.isDone = true
        mt.isPending = false
        return v
    }, (v: unknown) => {
        mt.isFailed = true
        mt.isPending = false
        return v
    })
    const mt : MonitoredThenable = {
        isPending: true,
        isFailed: false,
        isDone: false,
        then: (resolve, reject) => monitored.then(resolve, reject)
    }
    return mt
}

const isMonitoredThenable = (v: any) : v is MonitoredThenable => {
    return (v as MonitoredThenable).then != null
}

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


interface ReactionHelpers {
    readonly isLast: boolean
    readonly isFirst: boolean
}

class DefaultReactionHelpers implements ReactionHelpers {
    get isLast () {
        return isLastValue(_PatchingHub.scope[String(_ScopeKey)])
    }
    get isFirst () {
        return false
    }
}

const __helpers = new DefaultReactionHelpers()



export class Hub<D, E, S extends HubScope = HubScope, O extends HubOptions<D, E> = HubOptions<D, E>> implements Stateable {

    options: O

    scope: ObservableScoped<S&D&Keyed>
//    context: ObservableScoped<S&D&Indexed>

    subscriptions: Subscription[]
    handlers: Handler<any>[]
    joints: (MonitoredThenable|Function)[]

    // TODO по сути здесь флаги
    bindings: {[key: string]: Function}
    events: /*{[P in keyof (E&M&Keyed)]?: Function}//*/ {[key: string]: Function}

    state: State
    _local: any
//    _context: any
    // initialized: boolean
    // destroyed: boolean
//    _Injectors: Injectors<any> = null


    constructor (options: O, context: S = null, initScope: any = null) {

        this.options = {} as O

//        this.context = context
//        this.scope = Object.assign({}, context as any)

        this._local = {}
//        this._context = {...context}


        //let _InjectProp: string|symbol = null
        const _InjectProps: {[k:string]: PropState} = {}

        enum PropState {
            None,
            Injector,
            Initial,
            Default,
            Context
        }

        // injector -> initial -> default -> context

        
        this.scope = new Proxy(this._local, {
            get: (target, p) : any => {

                if (p == '$context') {
                    return context
                }


//                console.log('get', p)

                let isInjected = false

                let prop = _InjectProps[String(p)] || PropState.None
                const prevPropState = _InjectProps[String(p)]
                const prevProp = target[p]

//                if () {

                    if (/*!isInjected && this.state != State.Initializing &&*/ (p in target)) {
                        isInjected = true
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


                    if (!isInjected && prop < PropState.Injector && this.options.injections) {
                        const injector: Injector<any, any> = (this.options.injections as any)[p]
                        if (injector !== undefined) {
                            if (typeof injector === 'function') {
                                _InjectProps[String(p)] = PropState.Injector
                                scopeKeyAware(p, () => {
                                    noAutoTerminal(() => {
                                        // const entry = injector(this.scope)
                                        // if (entry !== undefined) {
                                        //     target[p] = entry
                                        // }
                                        target[p] = injector(this.scope)
                                    })    
                                })
                            }
                            else if (injector != null) {
                                console.warn('Injector must be a function', p, injector)
                                return
                            }
        
                            isInjected = true
//                            return target[p]
                        }
                    }    
//                }


                if (!isInjected && prop < PropState.Initial && initScope) {
//                    console.log('--- check initial ---', p)
                    let hasProp = false
                    if (isValueSet(initScope)) {
                        hasProp = initScope.$has(p) && initScope.$at(p).$value != null
                    }
                    else if (initScope[p] != null) {
                        hasProp = true
                    }
                    if (hasProp) {
                        _InjectProps[String(p)] = PropState.Initial
                        target[p] = initScope[p]
                        isInjected = true
                    }
                }


                if (!isInjected && prop < PropState.Default && this.options.initials) {
                    const injector: Injector<any, any> = (this.options.initials as any)[p]
                    if (injector !== undefined) {
                        if (typeof injector === 'function') {
                            _InjectProps[String(p)] = PropState.Default
                            scopeKeyAware(p, () => {
                                noAutoTerminal(() => {
                                    target[p] = injector(this.scope)
                                })    
                            })
                        }
                        else if (injector != null) {
                            console.warn('Injector must be a function', p, injector)
                            return
                        }
    
                        isInjected = true
//                        return target[p]
                    }
                }

                if (!isInjected && prop < PropState.Context) {
                    _InjectProps[String(p)] = PropState.Context
                    noAutoTerminal(() => {
                        target[p] = (context as any)[p]
                    })
                    isInjected = true
                    // if (this.state == State.Initializing) {
                    //     isInjected = false
                    //     //_InjectProps[String(p)] = PropState.None
                    // }
                }

                if (this.state == State.Initializing && (p == '$engine' || p == '$renderer' || p == '$pipe' )) {
                    const out = (target[p] && isAutoTerminal() && target[p].$isTerminal) ? target[p].$value : target[p]
                    delete target[p]
                    _InjectProps[String(p)] = PropState.None
                    isInjected = false
                    return out
                }

//                return target[p]
                return (target[p] && isAutoTerminal() && target[p].$isTerminal) ? target[p].$value : target[p]
            },
            set: (target, p, value) => {

                // if (p == 'current') {
                //     debugger
                // }

//                console.log('set scope value', p, value, p in target)

                // FIXME заменить на инжектирование
                if (!(p in target)) {
                    target[p] = this.scope[String(p)] // неявно инжектируем
                }

                // isObservable
                if (target[p] != null && (typeof (target[p] as ValueSet<any>).$at === 'function')) {
                    target[p].$value = value
                }
                else {
//                    console.error('Inject not an observable into scope', p, value)
                    target[p] = value
                }
                return true
            },
            has: (target, p) => {
                return Reflect.has(target, p) || Reflect.has(context, p) || (this.options.injections && Reflect.has(this.options.injections, p))
            },
            ownKeys: (target) : ArrayLike<string|symbol> => {
                const keys: any = {...context, ...target, ...this.options.injections}
                return Object.keys(keys)
            },
            getOwnPropertyDescriptor: (target, p) => {
                return Reflect.getOwnPropertyDescriptor(target, p) 
                    || Reflect.getOwnPropertyDescriptor(context, p)
                    || (this.options.injections && Reflect.getOwnPropertyDescriptor(this.options.injections, p))
            },
        })

        this.subscriptions = []
        this.handlers = []

        this.events = {}
        this.bindings = {}

        this.joints = []

        this.state = State.Initializing

        // добавляем патч в очередь задач
        this.scope.$engine.publish(ownTask(this.patch, options, this))
    }

    patch (optPatch: O) : void {

        if (this.state == State.Destroying || this.state == State.Destroyed) {
//            console.error('Try to patch destroyed hub')
            throw new Error('Try to patch destroyed object')
        }

        let opts = mixin(this.options, optPatch).build(this.state == State.Initialized ? this.patchRules() : this.initRules())

        if (opts === true || opts === false) {
            throw new Error('Invalid patch option mix')
        }

//        console.log(this.options, optPatch)

        const o = this.options = opts

        let newSubscriptions: Subscription[] = []
        let newHandlers: Handler<any>[] = []

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
            const subscriptions = spySubscriptions(() => {
                noAutoTerminal(() => {
                    for (let k in o.joints) {
                        let joint = o.joints[k].call(this, this.scope)
                        if (joint && (joint as Thenable).then) {
                            joint = createMonitoredThenable(joint)
                        }
                        this.joints.push(joint)
                        // for (let i in o.joints[k]) {
                        //     if (o.joints[k][i]) {
                        //         const joint = o.joints[k][i].call(this, this.scope[k], this.scope)
                        //         this.joints.push(joint)    
                        //     }
                        // }
                    }        
                })
            })
            newSubscriptions = newSubscriptions.concat(subscriptions)
        }


        // Reactors
        if (optPatch.reactions) {
            for (let k in o.reactions) {
                if (o.reactions[k] && !this.bindings[k]) {

                    this.bindings[k] = this.patchAware(o.reactions[k])//scopeKeyAware.bind(this, k, this.patchAware(o.reactions[k])) 

                    const entry = this.scope[k]
                    const binding = this.bindings[k]

                    if (isObservable(entry)) {
            
                        const sub = entry.$subscribe((next: any, prev: any) => {
                            autoTerminalAware(() => {
                                scopeKeyAware(k, () => {
                                    binding(entry.$isTerminal ? next : entry, prev, __helpers)
                                })    
                            })
                        })

                        newSubscriptions.push(sub)
                    }
                    else {
                        binding(entry, undefined)
                    }
                }
            }
        }

        // Events
        if (optPatch.events) {
            for (let i in o.events) {

                if (o.events[i] && !this.events[i]) {

                    this.events[i] = o.events[i] as any // FIXME

                    // for (let k in this.scope) {

                    //     const bus = this.scope[k]
                    //     const callback = this.events[i]
                        
                    //     if (isEventBus(bus) && bus.$hasEvent(i)) {

                    //         const handler = bus.$on(i, (evt: any) => {
                    //             noAutoTerminal(() => {
                    //                 callback(evt, this.scope)
                    //             })
                    //         }, this)

                    //         newHandlers.push(handler) // FIXME
                    //     }
                    // }

                    const events = o.events[i] as any
                    if (typeof events === 'function') {
                        if (isCallable(this.scope[i])) {

                            const bus = this.scope[i]
                            const callback = events

                            const handler = bus.$on('done', (...args: any[]) => {
                                noAutoTerminal(() => {
                                    callback.apply(null, [...args, this.scope])
                                })
                            }, this)

                            newHandlers.push(handler) // FIXME
                        }
                    }
                    else if (typeof events === 'object') {
                        const bus = this.scope[i]
                        for (let k in events) {

                            // FIXME добавить регистрацию событий

                            const callback = events[k]
                            
                            if (callback && isEventBus(bus) /*&& bus.$hasEvent(i)*/) {
    
                                const handler = bus.$on(k, (...args: any[]) => {
                                    noAutoTerminal(() => {
                                        callback.apply(null, [...args, this.scope])
                                    })
                                }, this)
    
                                newHandlers.push(handler) // FIXME
                            }    
                        }
                    }
                }
            }    
        }



        // освежаем реакции
//        noAutoTerminal(() => {
        // if (newSubscriptions.length) {
        //     console.log('new subscriptions', newSubscriptions)
        // }
            for (let sub of newSubscriptions) {
                if (sub == null) {
                    console.error('Undefined subscription')
                }
                else {
                    sub.observable.$touch(sub.subscriber)
                }
            }
//        })

        // TODO предполагается, что повторов подписок нет
        this.subscriptions = this.subscriptions.concat(newSubscriptions)

        this.handlers = this.handlers.concat(newHandlers)

        if (this.state == State.Initializing) {
            this.state = State.Initialized
            this.events.afterInit?.(this, this.scope)
        }

        // if (this.events['patch']) {
        //     this.events['patch'](this.options, this.scope)
        // }
    }

    destroy (deferred?: Function) {

        // исключаем повторное удаление
        if (this.state == State.Destroying || this.state == State.Destroyed) {
            return
        }

        // обрабатываем хуки отключения скоупа
        let disjointPromise = null
        if (this.joints.length > 0) {
            const promises: Thenable[] = []
            for (let disjoint of this.joints) {
                if (disjoint) {
                    if (isMonitoredThenable(disjoint)) {
//                        debugger
                        disjoint.isPending && promises.push(disjoint)
                    }
                    else if (typeof disjoint === 'function') {
                        const eff = disjoint()
                        if (eff && (eff as Thenable).then) {
                            promises.push(eff)
                        }    
                    }
                }
            }
            this.joints = []
            if (promises.length > 0) {
                disjointPromise = Promise.all(promises)
            }    
        }

        // удаляем подписки на изменения
        for (let sub of this.subscriptions) {
            if (sub == null) {
                console.error('Undefined subscription')
            }
            else {
                sub.observable.$unsubscribe(sub)
            }
        }

        // удаляем подписки на события
        for (let h of this.handlers) {
            h.bus.$off(h)
        }

//        this.bindings = {}
        this.events = {}
//        this.subscriptions = []
        this.handlers = []


        if (disjointPromise) {
            this.state = State.Destroying
            disjointPromise.then(() => {
                // завершаем удаление, только если статус на удалении
                if (this.state == State.Destroying) {

                    deferred && deferred()

                    this.scope = null
                    
                    this.state = State.Destroyed

                    console.log('Delayed destroy done')
                }
             }, (err) => {
                console.log('Delayed destroy fail', err)
             })
        }
        else {

            deferred && deferred()

            this.scope = null

            this.state = State.Destroyed            
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

    }

    patchAware (callback: Function) {
        return (...args: any[]) => {
            const prevPatchingTarget = _PatchingHub
            _PatchingHub = this
            callback.apply(this, args)
            _PatchingHub = prevPatchingTarget    
        }
    }

    // emit (name: string, event: any) {
    //     this.events[name](event, this.scope)
    // }

    initRules () : MixRules {
        return {}
    }

    patchRules () : MixRules {
        return {}
    }

    reinit (nextOpts?: O) {

        // TODO здесь должна происходить очистка компонента
        // предполагается, что сброс может происходить при удалении
        // приводим к такому же состоянию, что и в конструкторе, т.е. этапу инициализации

//         for (let joint of this.joints) {
//             if (joint != null) {
//                 if (isMonitoredThenable(joint)) {
//                     console.warn('Ignore async disjoint')
//                 }
//                 else if (typeof joint === 'function') {
//                     joint()
//                 }
//             }
//         }

//         // удаляем подписки на изменения
//         for (let sub of this.subscriptions) {
//             if (sub == null) {
//                 console.error('Undefined subscription')
//             }
//             else {
//                 sub.observable.$unsubscribe(sub)
//             }
//         }

//         // удаляем подписки на события
//         for (let h of this.handlers) {
//             h.bus.$off(h)
//         }

// //        this.bindings = {}
//         this.events = {}
// //        this.subscriptions = []
//         this.handlers = []
//         this.joints = []
        

        this.state = State.Initializing

        console.warn('reinitialize', nextOpts, this.options)

        if (nextOpts == null) {
            nextOpts = this.options
        }

        this.options = {} as any

        this.patch(nextOpts)


    }

}




