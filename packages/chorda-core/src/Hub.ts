import { Value, EventBus, Subscription, ObservableValue, Handler, spySubscriptions, isEventBus, isObservable, noAutoTerminal, ValueIterator, ValueSet, autoTerminalAware, isAutoTerminal, Observable } from './value'
import { Engine } from './engine'
import { MixRules, mixin } from './mix'


// Scope

export type Scoped<D> = {
    [P in keyof D]?: D[P]&Value<D[P]>
}

type EventScoped<D> = {
    [P in keyof D]?: D[P]&Value<D[P]>&EventBus<any>
}

type ObservableScoped<D> = {
    [P in keyof D]?: D[P]&ObservableValue<D[P]>&EventBus<any>
}

// Scope injectors

type Injectors<D> = {
    [P in keyof D]?: Injector<D/*, D[P]*/>
}

export type Injector<D, R=any> = (scope: Scoped<D>&{$context?: Scoped<D>}) => R


// Scope listeners

type Listeners<D, E> = {
    [P in keyof E]?: Listener<D, E[P]>
}

export type Listener<D, E> = (event: E, scope: EventScoped<D>) => boolean | void

// Scope bindings

type Reactor<T> = (next: T, prev: T) => void

type Reactors<T> = {
    [P in keyof T]?: Reactor<T[P]>
}

// Scope joints

type EventActions<E> = {
    [P in keyof E]?: (event: E[P]) => void
}

export type Joint<T, P extends keyof T=keyof T> = (o: ObservableValue<T[P]>&EventBus<any>&T[P], scope?: ObservableScoped<T>) => Function|void

type Joints<T> = {
    [P in keyof T]?: {
        [key: string]: Joint<T, P>
    }
}


export interface HubOptions<D, E> {
    // инжекторы скоупа
    injectors?: Injectors<D>
    // кастомизация скоупа
    joints?: Joints<D>
    // инжекторы по умолчанию
    initials?: Injectors<D>

    // изменения скоупа
    reactors?: Reactors<D>
    // слушатели скоупа
    events?: Listeners<D, E>
}


export type HubScope = {
    $engine: Engine<Stateable>
}

export type HubEvents = {
    afterDestroy: void
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


interface Thenable {
    then: Function
}



let _PatchingHub : Hub<unknown, any> = undefined

export const patch = (o: any) => {
    _PatchingHub.scope.$engine.scheduleTask(_PatchingHub.patch, o, _PatchingHub)
}

let _ScopeKey: string|symbol

const scopeKeyAware = (key: string|symbol, fn: Function) => {
    const prevScopeKey = _ScopeKey
    _ScopeKey = key
    fn()
    _ScopeKey = prevScopeKey
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


export class Hub<D, E, M extends HubEvents = HubEvents, S extends HubScope = HubScope, O extends HubOptions<D, E> = HubOptions<D, E>> implements Stateable {

    options: O

    scope: ObservableScoped<S&D&Keyed>
//    context: ObservableScoped<S&D&Indexed>

    subscriptions: Subscription[]
    handlers: Handler<any>[]
    joints: any[]

    // TODO по сути здесь флаги
    bindings: {[key: string]: Function}
    events: {[P in keyof (E&M&Keyed)]?: Function}// {[key: string]: Function}

    state: State
    _local: any
//    _context: any
    // initialized: boolean
    // destroyed: boolean
//    _Injectors: Injectors<any> = null


    constructor (options: O, context: S, initScope: any = null) {

        this.options = {} as O

//        this.context = context
//        this.scope = Object.assign({}, context as any)

        this._local = {...initScope}
//        this._context = {...context}


        let _InjectProp: string|symbol = null

        
        this.scope = new Proxy(this._local, {
            get: (target, p) : any => {

                if (p == '$context') {
                    return context
                }

//                console.log('get', p)

                let isInjected = false

                if (_InjectProp != p) {

                    if (p in target) {
                        isInjected = true
//                        return (target[p] && isAutoTerminal() && target[p].$isTerminal) ? target[p].$value : target[p]
                    }

                    if (!isInjected && this.options.injectors) {
                        const injector: Injector<any> = (this.options.injectors as any)[p]
                        if (injector !== undefined) {
                            if (typeof injector === 'function') {
                                const prevProp = _InjectProp
                                _InjectProp = p
                                scopeKeyAware(p, () => {
                                    noAutoTerminal(() => {
                                        // const entry = injector(this.scope)
                                        // if (entry !== undefined) {
                                        //     target[p] = entry
                                        // }
                                        target[p] = injector(this.scope)
                                    })    
                                })
                                _InjectProp = prevProp
                            }
                            else if (injector != null) {
                                console.warn('Injector must be a function', p, injector)
                                return
                            }
        
                            isInjected = true
//                            return target[p]
                        }
                    }    
                }

                if (!isInjected && this.options.initials) {
                    const injector: Injector<any> = (this.options.initials as any)[p]
                    if (injector !== undefined) {
                        if (typeof injector === 'function') {
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

                if (!isInjected) {
                    noAutoTerminal(() => {
                        target[p] = (context as any)[p]
                    })    
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
                return Reflect.has(target, p) || Reflect.has(context, p) || (this.options.injectors && Reflect.has(this.options.injectors, p))
            },
            ownKeys: (target) : ArrayLike<string|symbol> => {
                const keys: any = {...context, ...target, ...this.options.injectors}
                return Object.keys(keys)
            },
            getOwnPropertyDescriptor: (target, p) => {
                return Reflect.getOwnPropertyDescriptor(target, p) 
                    || Reflect.getOwnPropertyDescriptor(context, p)
                    || (this.options.injectors && Reflect.getOwnPropertyDescriptor(this.options.injectors, p))
            }
        })

        this.subscriptions = []
        this.handlers = []

        this.events = {}
        this.bindings = {}

        this.joints = []

        this.state = State.Initializing

        // добавляем патч в очередь задач
        this.scope.$engine.scheduleTask(this.patch, options, this)
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

        // Injectors
        if (optPatch.injectors) {
            // здесь мы должны обновлять измененные инжекторы

            // this._Injectors = o.injectors
            // for (let k in o.injectors) {
            //     this.scope[k]
            //     // const injector: Injector<any> = o.injectors[k]
            //     // if (injector !== undefined) {
            //     //     let entry = null
            //     //     if (typeof injector === 'function') {
            //     //         entry = injector(this.scope)
            //     //     }
            //     //     else if (injector != null) {
            //     //         console.warn('Injector must be a function', k, injector)
            //     //         continue
            //     //     }

            //     //     if (this.scope[k] != entry) {
            //     //         // TODO здесь нужно отписываться от элемента скоупа 
            //     //         this.scope[k] = entry
            //     //     }
            //     // }
            // }
            // this._Injectors = null
        }


        // Joints
        //TODO joints не должны обновляться динамически, но все равно нужно сделать обработку
        if (optPatch.joints) {
            const subscriptions = spySubscriptions(() => {
                noAutoTerminal(() => {
                    for (let k in o.joints) {
                        for (let i in o.joints[k]) {
                            if (o.joints[k][i]) {
                                const joint = o.joints[k][i].call(this, this.scope[k], this.scope)
                                this.joints.push(joint)    
                            }
                        }
                    }        
                })
            })
            newSubscriptions = newSubscriptions.concat(subscriptions)
        }


        // Reactors
        if (optPatch.reactors) {
            for (let k in o.reactors) {
                if (o.reactors[k] && !this.bindings[k]) {

                    this.bindings[k] = this.patchAware(o.reactors[k])//scopeKeyAware.bind(this, k, this.patchAware(o.reactors[k])) 

                    const entry = this.scope[k]
                    const binding = this.bindings[k]

                    if (isObservable(entry)) {
            
                        const sub = entry.$subscribe((next: any, prev: any) => {
                            autoTerminalAware(() => {
                                scopeKeyAware(k, () => {
                                    binding(entry.$isTerminal ? next : entry, prev)
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

                    this.events[i] = o.events[i]

                    for (let k in this.scope) {

                        const bus = this.scope[k]
                        const callback = this.events[i]
                        
                        if (isEventBus(bus) && bus.$hasEvent(i)) {

                            const handler = bus.$on(i, (evt: any) => {
                                noAutoTerminal(() => {
                                    callback(evt, this.scope)
                                })
                            }, this)

                            newHandlers.push(handler) // FIXME
                        }
                    }
                }
            }    
        }



        // освежаем реакции
//        noAutoTerminal(() => {
            for (let sub of newSubscriptions) {
                sub.observable.$touch(sub.subscriber)
            }
//        })

        // TODO предполагается, что повторов подписок нет
        this.subscriptions = this.subscriptions.concat(newSubscriptions)

        this.handlers = this.handlers.concat(newHandlers)

        if (this.state == State.Initializing) {
            this.state = State.Initialized
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
            const promises = []
            for (let disjoint of this.joints) {
                if (disjoint) {
                    const eff = disjoint()
                    if (eff && (eff as Thenable).then) {
                        promises.push(eff)
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
            sub.observable.$unsubscribe(sub)
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
                    this.scope = null

                    deferred && deferred()
    
                    this.state = State.Destroyed    
                }
             }, (err) => {
                console.log('Delayed destroy fail', err)
             })
        }
        else {
            this.scope = null

            deferred && deferred()

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

    reset (nextOpts?: O) {
        this.state = State.Initializing

        if (nextOpts != null) {
            console.warn('component update not yet ready', nextOpts, this)
            return
        }

        // FIXME возможно, необходимо сначала почистить хаб
        this.patch(this.options)
    }

}




