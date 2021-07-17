import { Observable, Value, Subscriber, EventBus, Subscription, PublishFunc, defaultUidFunc} from './utils'
import { EventNode } from './bus'

export type UidFunc<I=any> = (value: I) => string

export type ObservableValue<T> = Observable<T>&Value<T>

export type ValueKey = string | number | symbol

export enum UpdateDirection {
    ASC,
    DESC,
    BOTH
}

export enum HasCheck {
    PROPERTY,
    METHOD
}

export enum IsCheck {
    ARRAY,
}

export interface ValueSet<T, K extends keyof T=keyof T> extends Value<T> {
    $at <K extends keyof T=keyof T>(key: K, factory?: Function): ValueSet<T[K]>
    $has (key: ValueKey, check?: HasCheck) : boolean
    $ownKeys () : (string|symbol)[]
    $getOwnPropertyDescriptor (key: ValueKey) : object
//    $each <I=T[K]>(f: (itm: ValueSet<I>) => void) : void
    $is (check: IsCheck) : boolean
}

export interface ObservableValueSet<T> extends ObservableValue<T> {
    $at <K extends keyof T=keyof T>(key: K, factory?: Function): ObservableValueSet<T[K]>
    $has (key: ValueKey, check?: HasCheck) : boolean
    $ownKeys () : (string|symbol)[]
    $getOwnPropertyDescriptor (key: ValueKey) : object
//    $each <K extends keyof T=keyof T>(f: (itm: ObservableValueSet<T[K]>) => void) : void
    $is (check: IsCheck) : boolean
}


interface ValueNode<T> extends Value<T> {
    readonly $key: ValueKey
    readonly $source: ValueNode<any>
    $update (direction: UpdateDirection, nextValue: any, key?: ValueKey, keyInfo?: {[key: string]: any}): void
    $hasFunction (key: ValueKey) : boolean
    $destroy () : void
    $get () : T
}

export const EMPTY = Object.seal({})


type NodeUpdate = {
    node: Node<any>
    prev: any
    next: any
}

type UpdateSession = {
    nodes: Set<ValueNode<any>>
    head: ValueNode<any>
    deleted: ValueNode<any>[]
    updated: NodeUpdate[]
}

type Transaction = {
    joined: boolean
}




// Spies

let _SpyGetters : Observable<any>[] = null

let _SpySubscriptions : Subscription[] = null

export const spySubscriptions = (fn: Function) : Subscription[] => {
    const prevSub = _SpySubscriptions
    _SpySubscriptions = []
    fn()
    const result = _SpySubscriptions
    _SpySubscriptions = prevSub
    return result
}

export const spyGetters = (fn: Function) : Observable<any>[] => {
    const prevGetters = _SpyGetters
    _SpyGetters = []
    fn()
    const result = _SpyGetters
    _SpyGetters = prevGetters
    return result
}

let _Session: UpdateSession = null

export const openTransaction = () : Transaction => {
    const t = {joined: true}
    if (!_Session) {
        _Session = {
            nodes: new Set(),
            head: this,
            deleted: [],
            updated: []
        }
        t.joined = false
    }
    // else {
    //     debugger
    // }
    return t
}

export const closeTransaction = (t: Transaction) => {
    if (!t.joined) {
        if (_Session.updated.length > 0 || _Session.deleted.length > 0) {
            _update_engine.addSession(_Session)
        }
        _Session = null    
    }
}

export const transactionUpdates = (t: Transaction) : NodeUpdate[] => {
    return _Session.updated
}

// const transactionAware = (fn: Function) => {
//     if (_Session) {
//         debugger
//     }
//     _Session = {
//         nodes: new Set(),
//         head: this,
//         deleted: [],
//         updated: []
//     }
//     fn()

//     if (_Session.updated.length > 0 || _Session.deleted.length > 0) {
//         _update_engine.addSession(_Session)
//     }

//     _Session = null
// }


class UpdateEngine {

    _sessions: UpdateSession[]
    _commiting: boolean
    _commitedNodes: Set<Node<any>>
//    _commitedSubscriptions: Set<Subscription>

    constructor () {
        this._sessions = []
        this._commitedNodes = new Set<Node<unknown>>()
//        this._commitedSubscriptions = new Set<Subscription>()
    }

    addSession(session: UpdateSession) {
        this._sessions.push(session)
    }

    commit () {
        if (!this._commiting) {
//            this._commitedNodes.size == 0 && console.log('Commit start')
            this._commiting = true

            const sessions = this._sessions
            this._sessions = []

            sessions.forEach(session => {
//                console.log('session', session.updated)

                // session.deleted.forEach(del => {
                //     del.$destroy()
                // })

//                const lastUpdateMap = new Map<Subscriber<any>, NodeUpdate>()
                session.updated.forEach(upd => {
                    if (this._commitedNodes.has(upd.node)) {
//                        console.warn('Cyclic update detected', upd)
//                        return
                    }
                    upd.node._subscriptions.forEach(sub => {
                        sub.subscriber.$publish(upd.next, upd.prev, EMPTY)
                    })
                    this._commitedNodes.add(upd.node)
                })
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
            })

            this._commiting = false

            if (this._sessions.length > 0) {
                this.commit()
            }
            else {
                this._commitedNodes.clear()
//                console.log('Commit end')
            }
        }
    }


}

const _update_engine = new UpdateEngine()



export abstract class Node<T, E=any> extends EventNode<E> implements ValueNode<T>, Observable<T> {

    _memoValue: any
    _source: Node<unknown>
    _key: ValueKey
    _subscriptions: Subscription[]
    _entries: {[key: string]: Node<unknown>}
    _uidFunc: UidFunc
    _uid: string
//    _session: UpdateSession
    _initialized: boolean
    _destroyed: boolean

    constructor (initValue?: T, source?: Node<unknown>, key?: ValueKey, entryUidFunc?: UidFunc) {
        super()
        this._memoValue = initValue
        this._source = source
        this._key = key
        this._subscriptions = []
        this._entries = {}
        this._uidFunc = entryUidFunc || defaultUidFunc
//        this._session = undefined
        this._uid = undefined
        this._initialized = source == null
        this._destroyed = false
    }

    get $key () {
        return this._key
    }

    get $source () {
        return this._source
    }

    toString () {
        return String(this.$value)
    }

    toJSON () {
        return this.$value
    }

    valueOf () {
        return this.$value
    }

    get [Symbol.toStringTag] () {
        const v = Object.prototype.toString.call(this.$value)
        return v.substring(8, v.length-1)
    }

    [Symbol.toPrimitive] () {
        const v = this.$value
        if (typeof v === 'object') {
            return String(v)
        }
        return v// this.$value//[Symbol.toPrimitive]
    }

    get [Symbol.isConcatSpreadable] () {
        return Array.isArray(this.$value) //this._memoValue && this._memoValue[Symbol.isConcatSpreadable]
    }

    get $uid () {
        if (_SpyGetters) {
            _SpyGetters.push(this)
        }
        return this._uid
    }

    get $isTerminal () {
        const v = this.$value
        return (v == null || (typeof v == 'string') || (typeof v == 'number') || (typeof v == 'symbol') || (typeof v == 'boolean') || (typeof v == 'function'))// || Array.isArray(v))
    }

    get $isPrimitive () {
        const v = this.$value
        return (v == null || (typeof v == 'string') || (typeof v == 'number') || (typeof v == 'symbol') || (typeof v == 'boolean') || (typeof v == 'function'))
    }

    get $value () {
        if (_SpyGetters) {
            _SpyGetters.push(this)
        }
        if (this._destroyed) {
            console.error('Value in destroyed state', this)
            return undefined
//            debugger
        }
        if (!this._initialized) {
            this._memoValue = this.$get()
            // if (this._memoValue && typeof this._memoValue.$at === 'function') {
            //     this._memoValue = this._memoValue.$value
            // }
            this._initialized = true
        }

        if (this._memoValue && typeof (this._memoValue as ValueSet<any>).$at === 'function') {
            debugger
        }

        return this._memoValue
    }

    set $value (newValue: any) {
        // если новое значение является наблюдаемым, то берем только его значение
        // сейчас эта проверка дублирует аналогичную в publish
        if (newValue && typeof (newValue as ValueSet<any>).$at === 'function') {
            newValue = newValue.$value
        }

        if (this.$isPrimitive && newValue === this._memoValue) {
            console.log('No change detected', newValue, this._memoValue)
            return
        }

//        transactionAware(() => {
        this.$publish(newValue, this._memoValue, EMPTY)
//        })

        // // обновляем дерево значений
        // if (_Session) {
        //     debugger
        // }
        // _Session = {
        //     nodes: new Set(),
        //     head: this,
        //     deleted: [],
        //     updated: []
        // }
        // // const prevSession = _Session
        // // _Session = null
        //  // _Session = prevSession

        // _update_engine.addSession(_Session)

        // _Session = null
        
        _update_engine.commit()
        // if (newValue != null) {

        //     if ((newValue as ValueNode<any>).$at) {
        //         newValue = (newValue as Value<any>).$value
        //     }

        //     this._updateEntries(newValue)
        // }

        // this.$update(UpdateDirection.BOTH, newValue, null, EMPTY)
    }

    $hasFunction (key: ValueKey) : boolean {
        const v = this.$value
        return v != null && typeof v[key] == 'function'
    }




    // -----------------
    // Pub/Sub
    // -----------------

    $publish(next: any, prev?: any, keys?: {[key: string]: any}): void {

        if (!this._initialized) {
            console.warn('Value is not initialized', this)
            this._initialized = true // FIXME насколько это корректно?
        }


        const t = openTransaction()

//         let session = null
//         if (!_Session) {
//             _Session = {
//                 nodes: new Set(),
//                 head: this,
//                 deleted: [],
//                 updated: []
//             }
//             session = _Session
// //            console.log('Session start', this)
//         }
//         else {
//             if (this._source == null) {
// //                console.log('Root node detected', next, this)
//             }    
//         }

//         if (_Session.nodes.has(this)) {
// //            console.log('Already in session', this)
//             return
//         }



        if (next != null) {

            if (typeof (next as ValueNode<any>).$update === 'function') {
                next = (next as Value<any>).$value
            }

            this._updateEntries(next)
        }

        this.$update(UpdateDirection.BOTH, next, null, EMPTY)

        closeTransaction(t)

//         if (session) {
//             _Session = null
//             _update_engine.addSession(session)
//             // session.deferred.forEach(node => {
//             //     node._subscriptions.forEach(sub => sub.subscriber.$publish(node._memoValue, prev, EMPTY))
//             // })
// //            console.log(_Session.deleted)
// //            session.deleted.forEach(node => node.$destroy())
// //            console.log('Session end', this)
//         }
    }

    $subscribe(subscriber: Subscriber<T>|PublishFunc<T>): Subscription {

        if (this._destroyed) {
            console.error('Cannot subscribe to deleted value')
            return null
        }
        
        // проверяем, что такая подписка уже есть
        for (let sub of this._subscriptions) {
            if (sub.subscriber == subscriber || sub.subscriber.$publish == subscriber) {
                return sub
            }
        }    

        if (typeof subscriber === 'function') {
            subscriber = {
                $publish: subscriber
            }
        }

        const sub: Subscription = {
            subscriber,
            observable: this
        }

        this._subscriptions.push(sub)

        if (_SpySubscriptions) {
            _SpySubscriptions.push(sub)
        }

        return sub
    }

    $unsubscribe(subscription: Subscription|Subscriber<T>|PublishFunc<T>): void {
        // if (this._destroyed) {
        //     console.error('Cannot unsubscribe from deleted value')
        //     return 
        // }
        this._subscriptions = this._subscriptions.filter(sub => sub != subscription && sub.subscriber != subscription && sub.subscriber.$publish != subscription)
    }

    $touch(subscriber: Subscriber<T>): void {
        //this._started = true
        subscriber.$publish(this.$value, undefined, EMPTY)
    }

    $untouch () {
        // TODO проверки при отсоединении
    }


    // ----------------
    // Node
    // ----------------

    // abstract $at <I=T[K]>(key: K, factory?: Function): ValueSet<I>


    $update (direction: UpdateDirection, value: any, key?: ValueKey, keyInfo?: {[key: string]: any}) {

        // if (this._key == 'filter') {
        //     console.log('update filter', value)
        // }

//        console.log('update', this._key, this._memoValue, this._entries)

        // else {
        //     if (_Session.nodes.has(this)) {
        //         return
        //     }
        // }
//        _Session.nodes.add(this)


//        this._session = _Session

        const prev = this._memoValue

        if (direction == UpdateDirection.ASC) {
            this._memoValue[key] = value
        }
        else {
            this._memoValue = value
        }

        // уведомление дочерних элементов
        if (direction == UpdateDirection.DESC || direction == UpdateDirection.BOTH) {
            for (let i in this._entries) {
                this._entries[i].$update(UpdateDirection.DESC, this._memoValue == null ? undefined : this._memoValue[i])
            }
        }


        // уведомление родительского элемента
        if (direction == UpdateDirection.ASC || direction == UpdateDirection.BOTH) {
            if (this._source) {
                this._source.$update(UpdateDirection.ASC, this._memoValue, this._key, {[this._key]: keyInfo})
            }
        }

        if (_Session) {
            _Session.updated.push({
                node: this,
                next: this._memoValue,
                prev
            })
        }


//        console.log('notify', this._key, this._memoValue)

    }


    // ----------------
    // internal
    // ----------------

    _updateEntries (newValue: any) {

        const nextEntries: {[key: string]: any} = {}
        const prevMap: {[key: string]: any} = {}
    
        if (Array.isArray(newValue)) {

//            const uidFunc = this._uidFunc || defaultUidFunc

            for (let k in this._entries) {
                let uid = this._entries[k].$uid// (this._entries[k] as Axle<any>)._uid// uidFunc(this._entries[k].$value) //(this._entries[k] as Value<any>).$uid
                if (uid === undefined) {
                    uid = this._uidFunc(this._entries[k].$value)
                    if (uid === undefined) {
                        uid = k
                    }
                }
                prevMap[uid] = this._entries[k]
            }

//            console.log(this._key, prevMap)
    
    //            const nextMap: {[key: string]: any} = {}
            newValue.forEach((v, i) => {
                let uid = this._uidFunc(v)
                if (uid === undefined) {
                    uid = String(i)
                }
                let entry = prevMap[uid] as Node<any>
                if (entry) {
                    nextEntries[i] = entry;
                    entry._key = i;
                    entry._uid = uid;
                    entry._memoValue = v;
                    delete prevMap[uid]
                }
                else {

                }
//                nextMap[uid] = v
            })

//            console.log(this._key, nextEntries)

        }
        else if (newValue && newValue.constructor === Object) {
            Object.assign(prevMap, this._entries)
            for (let k in newValue) {
                // const v = newValue[k]
                // const uid = k//uidFunc(v)
                let entry = this._entries[k] as Node<any>// prevMap[uid]
                if (entry) {
                    nextEntries[k] = entry;
                    entry._key = k;
                    entry._uid = k
                    delete prevMap[k]
                }
                else {

                }
            }
        }

        this._entries = nextEntries

        for (let i in prevMap) {
//            if (!(i in nextEntries)) {
                // этот элемент идет на удаление
//                console.log('delete', i)
//                if (!_Sess)
                _Session.deleted.push(prevMap[i])
//                prevMap[i]._destroy()
//            }
        }
    }

    // _createEntry (value: T, key: ValueKey) : Node<T> {
    //     return null// new Node(value, this, key)
    // }

    $get () {
        if (this._initialized) {
            return this._memoValue
        }
        const v = this._source.$get() as any
        return v == null ? v : v[this._key]
//        return this._initialized ? this._memoValue : (this._source.$get() as any)[this._key]
    }

    $destroy () {

        this._destroyed = true
        // this._subscriptions.forEach(sub => {
        //     sub.subscriber.$publish(undefined, this._memoValue, EMPTY)
        // })
        this._subscriptions = null
        for (let i in this._entries) {
            this._entries[i].$destroy()
        }
        this._memoValue = undefined
//        this._entries = null
//        this._source = null

//        console.log('deleted', this._key)
        // FIXME здесь нужно каскадное обновление
//        this.$update(UpdateDirection.DESC, undefined, this._memoValue, EMPTY)
//        this._subscriptions.forEach(sub => sub.subscriber.$publish(undefined, this._memoValue, EMPTY))
    }

    // get _inTransaction () : boolean {
    //     return _update_engine._commited.has(this)
    // }

}


