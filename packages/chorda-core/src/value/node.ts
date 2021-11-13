import { Observable, Value, Subscriber, EventBus, Subscription, PublishFunc, defaultUidFunc, EMPTY} from './utils'
import { closeTransaction, commitEngine, currentTransaction, openTransaction } from './engine'
import { LifecycleProvider, SubscriptionProvider } from './utils'
import { PubSub } from './pubsub'

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

export interface MethodDescriptor {
    name: string
    mutable: boolean
}

export interface ValueSet<T, K extends keyof T=keyof T> extends Value<T> {
    $at <K extends keyof T=keyof T>(key: K, factory?: Function): Value<T[K]>
    $has (key: ValueKey, check?: HasCheck) : boolean
    $ownKeys () : (string|symbol)[]
    $getOwnPropertyDescriptor (key: ValueKey) : object
//    $each <I=T[K]>(f: (itm: ValueSet<I>) => void) : void
    // $is (check: IsCheck) : boolean
    $is (ctor: Function) : boolean
//    $getMethodDescriptor (name: string) : MethodDescriptor
}

export interface ObservableValueSet<T> extends ObservableValue<T> {
    $at <K extends keyof T=keyof T>(key: K, factory?: Function): ObservableValueSet<T[K]>
    $has (key: ValueKey, check?: HasCheck) : boolean
    $ownKeys () : (string|symbol)[]
    $getOwnPropertyDescriptor (key: ValueKey) : object
//    $each <K extends keyof T=keyof T>(f: (itm: ObservableValueSet<T[K]>) => void) : void
    // $is (check: IsCheck) : boolean
    $is (ctor: Function) : boolean
//    $getMethodDescriptor (name: string) : MethodDescriptor
}


interface ValueNode<T> extends Value<T> {
    readonly $key: ValueKey
    readonly $source: ValueNode<any>&ValueSet<any>
    $update (direction: UpdateDirection, nextValue: any, key?: ValueKey, keyInfo?: {[key: string]: any}): void
    $hasFunction (key: ValueKey) : boolean
    $destroy () : void
    $get () : T
}






// Spies

let _SpyGetters : Observable<any>[] = null
let _SpySetters : Observable<any>[] = null

// let _SpySubscriptions : Subscription[] = null

// export const spySubscriptions = (fn: Function) : Subscription[] => {
//     const prevSub = _SpySubscriptions
//     _SpySubscriptions = []
//     fn()
//     const result = _SpySubscriptions
//     _SpySubscriptions = prevSub
//     return result
// }

export const spyGetters = (fn: Function) : Observable<any>[] => {
    const prevGetters = _SpyGetters
    _SpyGetters = []
    fn()
    const result = _SpyGetters
    _SpyGetters = prevGetters
    return result
}

export const spySetters = (fn: Function) : Observable<any>[] => {
    const prevSetters = _SpySetters
    _SpySetters = []
    fn()
    const result = _SpySetters
    _SpySetters = prevSetters
    return result
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


export const isLastValue = (v: any) : boolean => {
    if (typeof (v as ValueNode<unknown>).$update === 'function') {
        const node = v as ValueNode<unknown>
        const arr = node.$source.$value as any
        return node.$source.$at(arr.length-1) == node
    }
    return false
}

export const isDestroyedValue = (v: any) : boolean => {
    if (typeof (v as LifecycleProvider).$destroy === 'function') {
        return v.$isDestroyed
    }
    return false
}




export abstract class Node<T, E=any> extends PubSub<T, E> implements ValueNode<T>, LifecycleProvider {

    _memoValue: any
    _source: Node<unknown>&ValueSet<unknown>
    _key: ValueKey
    _subscriptions: Subscription[]
    _entries: {[key: string]: Node<unknown>}
    _uidFunc: UidFunc
    _uid: string
//    _session: UpdateSession
    _initialized: boolean
    _destroyed: boolean

    constructor (initValue?: T, source?: Node<unknown>&ValueSet<unknown>, key?: ValueKey, entryUidFunc?: UidFunc) {
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
        console.log('to json')
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

        if (_SpySetters) {
            _SpySetters.push(this)
        }

        if (this._destroyed) {
            console.error('Value drop destroyed state', this)
            this._destroyed = false
        }

        // FIXME в режиме auto terminal изменение значения запрещено

        // если новое значение является наблюдаемым, то берем только его значение
        // сейчас эта проверка дублирует аналогичную в publish
        if (newValue && typeof (newValue as ValueSet<any>).$at === 'function') {
            newValue = newValue.$value
        }

        if (this.$isPrimitive && newValue === this._memoValue) {
//            console.log('No change detected', newValue, this._memoValue)
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
        
        commitEngine().commit()
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

 //       console.log('publish')

        if (!this._initialized) {
            console.warn('Value is not initialized', this)
            this._initialized = true // FIXME насколько это корректно?
        }

        // if (this._destroyed) {
        //     console.warn('Value destroyed', this)
        //     return
        // }


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

//            this._updateEntries(next)
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

        if (this._destroyed) {
            console.error('Value destroyed and should not be updated', this)
            return
        }

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

            this._updateEntries(value)

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

        const t = currentTransaction()
        if (t) {
            t.updated.push({
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
        const reuseMap: {[key: string]: Node<any>} = {}
    
        if (Array.isArray(newValue)) {

            for (let k in this._entries) {
                let uid = this._entries[k].$uid
                if (uid == undefined) {
                    uid = this._uidFunc(this._entries[k].$value)
                    if (uid === undefined) {
                        uid = String(k)
                    }
                }
                reuseMap[uid] = this._entries[k]
            }

//            Object.assign(reuseMap, this._entries)

//            const uidFunc = this._uidFunc || defaultUidFunc

            // prevMap составляем только на основе индексированных значений, чтобы значения свойтв (length)
            // не перекрывали ключи
            // newValue.forEach((v, k) => {
            //     if (k in this._entries) {
            //         let uid = this._entries[k].$uid// (this._entries[k] as Axle<any>)._uid// uidFunc(this._entries[k].$value) //(this._entries[k] as Value<any>).$uid
            //         if (uid === undefined) {
            //             uid = this._uidFunc(this._entries[k].$value)
            //             if (uid === undefined) {
            //                 uid = String(k)
            //             }
            //         }
            //         reuseMap[uid] = this._entries[k]
            //     }
            // })

            // for (let k in this._entries) {
            //     let uid = this._entries[k].$uid// (this._entries[k] as Axle<any>)._uid// uidFunc(this._entries[k].$value) //(this._entries[k] as Value<any>).$uid
            //     if (uid === undefined) {
            //         uid = this._uidFunc(this._entries[k].$value)
            //         if (uid === undefined) {
            //             uid = k
            //         }
            //     }
            //     prevMap[uid] = this._entries[k]
            // }

//            console.log(this._key, Object.keys(reuseMap))
    
    //            const nextMap: {[key: string]: any} = {}
            newValue.forEach((v, i) => {
                let uid = this._uidFunc(v)
                if (uid === undefined) {
                    uid = String(i)
                }
                let entry = reuseMap[uid] as Node<any>
                if (entry) {
//                    console.log('reuse entry', [entry._key, entry._uid], [i, uid])
                    nextEntries[i] = entry;
                    entry._key = String(i);
                    entry._uid = uid;
                    entry._memoValue = v;
                    delete reuseMap[uid]
                }
                else {
                }
//                nextMap[uid] = v
            })

//            console.log('rest reuse map', this._key, reuseMap)

//            console.log(this._key, nextEntries)

        }
        else if (newValue && newValue.constructor === Object) {
            Object.assign(reuseMap, this._entries)
            for (let k in newValue) {
                // const v = newValue[k]
                // const uid = k//uidFunc(v)
                let entry = this._entries[k] as Node<any>// prevMap[uid]
                if (entry) {
                    nextEntries[k] = entry;
                    entry._key = k;
                    entry._uid = k
                    delete reuseMap[k]

                    // ?
                    if (entry._destroyed) {
                        console.log('Entry restored', entry)
                        entry._subscriptions.length > 0 && console.error('Restored entry has subscriptions', entry)
                        entry._destroyed = false
                    }
                }
                else {

                }
            }
        }
        // else {
        //     Object.assign(prevMap, this._entries)
        // }

        this._entries = nextEntries

        for (let i in reuseMap) {

            const removed = reuseMap[i]

            // замененные элементы
            if (i in nextEntries) {
                console.log('replaced', reuseMap[i])
            }
            else {
                if (i != removed._key) {
//                    console.warn('removed and changed key', i, removed._key, removed.$uid)//, removed)
                    //console.log(prevMap)
                }

                if (removed._subscriptions.length > 0) {
                    if (this._entries[String(removed._key)]) {
                        console.warn('Removed entry can not be restored', removed, this)
                        //debugger
                    }
                    else {
                        this._entries[String(removed._key)] = removed
                    }
//                    removed._destroyed = true
                    continue
                }

//                console.log('removed', removed._key, removed._memoValue)
            }

            const t = currentTransaction()
            if (t) {
                t.deleted.push(reuseMap[i])
            }


//            if (!(i in nextEntries)) {
                // этот элемент идет на удаление
//                console.log('delete', i)
//                if (!_Sess)
            
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
        if (this._destroyed) {
            return undefined
        }
        const v = this._source.$get() as any
        return v == null ? v : v[this._key]
//        return this._initialized ? this._memoValue : (this._source.$get() as any)[this._key]
    }

    $destroy () {

        console.log('destroy', this._key, this._memoValue ,this._subscriptions.length)

        this._destroyed = true

        for (let i in this._entries) {
//            console.log('destroy', i)
            this._entries[i].$destroy()
        }
        this._memoValue = undefined

        // ?
        // this._subscriptions.forEach(sub => {
        //     sub.subscriber.$publish(undefined, this._memoValue, EMPTY)
        // })

        // this._subscriptions = []
        // this._entries = null
        // this._source = null

//        console.log('deleted', this._key)
        // FIXME здесь нужно каскадное обновление
//        this.$update(UpdateDirection.DESC, undefined, this._memoValue, EMPTY)
//        this._subscriptions.forEach(sub => sub.subscriber.$publish(undefined, this._memoValue, EMPTY))
    }

    get $isDestroyed () {
        return this._destroyed
    }

    // get _inTransaction () : boolean {
    //     return _update_engine._commited.has(this)
    // }

    // get $subscriptions () {
    //     return this._subscriptions
    // }
}


