import { EventBus, Handler } from './utils'


let _SpyHandlers : Handler<any>[] = null

export const spyHandlers = (fn: Function) : Handler<any>[] => {
    const prevHandlers = _SpyHandlers
    _SpyHandlers = []
    fn()
    const result = _SpyHandlers
    _SpyHandlers = prevHandlers
    return result
}



export class EventNode<E> implements EventBus<E> {

    _global: {[key: string]: any}
    _events: {[key: string]: any}
    _handlers: Handler<any>[]

    constructor (global?: {[key: string]: any}) {
        this._global = global
        this._events = {}
        this._handlers = []
    }

    $on(name: string, callback: Function, target: any) : Handler<E> {
        const h = {name, callback, target, bus: this}
        this._handlers.push(h)

        if (_SpyHandlers) {
            _SpyHandlers.push(h)
        }

        return h
    }
    $off(ctl: any): void {
        this._handlers = this._handlers.filter(l => l != ctl && l.callback != ctl && l.target != ctl)
    }
    $emit(name: string, ...args: any[]): void {
        // TODO возможно, сообщения стоит здесь только помещать в очередь
        this._handlers.forEach(h => {
            if (h.name == name) {
                h.callback.apply(h.target, args)
            }
        })
    }
    $event (name: string) : Function {
        this._events[name] = true
        return (...args: any[]) => this.$emit.apply(this, [name, ...args])
    }
    $hasEvent (name: string) : boolean {
        return !!this._events[name] || (this._global != null && this._global[name])
    }

}

