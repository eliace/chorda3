import { ObservableValueIterator } from './iterator'
import { Node, UidFunc, ValueSet, ValueKey, ObservableValueSet, HasCheck, IsCheck, ObservableValue} from './node'
import { EventBus, Observable, ValueIterator } from './utils'


let _AutoTerminal = false

export const autoTerminalAware = (fn: Function) : any => {
    const prevAutoTermial = _AutoTerminal
    _AutoTerminal = true
    const result = fn()
    _AutoTerminal = prevAutoTermial
    return result
}

export const noAutoTerminal = (fn: Function) : any => {
    const prevAutoTermial = _AutoTerminal
    _AutoTerminal = false
    const result = fn()
    _AutoTerminal = prevAutoTermial
    return result
}

export const isAutoTerminal = () => _AutoTerminal




export class ObservableNode<T, K extends keyof T=keyof T> extends Node<T> implements ValueSet<T> {


    $at <I=T[K]>(k: ValueKey, creator?: Function): ValueSet<I> {
        let entry = this._entries[String(k)]
        if (!entry) {
            let value = this._memoValue ? this._memoValue[k] : null
            // if (value && typeof value.$at === 'function') {
            //     value = value.$value
            // }
            entry = creator ? creator(this, k) : this._createEntry(value, k);
            // FIXME
            (entry as Node<any>)._uid = this._uidFunc(value)
//            entry = proxify(entry.$value, entry)
            this._entries[String(k)] = entry
        }
        return entry as any // FIXME
    }

    $has (key: ValueKey, check?: HasCheck) : boolean {
        const v = this.$value
        if (v != null && v[key] != null) {
            if (check == HasCheck.METHOD) {
                return typeof v[key] === 'function'
            }
            return true
        }
        return false
    }

    $is (check: IsCheck) : boolean {
        if (check == IsCheck.ARRAY && Array.isArray(this._memoValue)) {
            return true
        }
        return false
    }

    $ownKeys () : (string|symbol)[] {
        const v = this.$value
        return typeof v == 'object' ? Reflect.ownKeys(v) : []
    }

    $getOwnPropertyDescriptor (name: ValueKey) : object {
        const v = this.$value
        return (typeof v == 'object') ? Reflect.getOwnPropertyDescriptor(v, name) : undefined
    }


    _createEntry (value: T, key: ValueKey) : Node<T> {
        return proxify(value, new ObservableNode(value, this, key))
    }

}






export const observable = <T>(initValue: ObservableValueSet<T>|T, uidFunc?: UidFunc) : ObservableValueSet<T>&T => {
    const value = isValueSet(initValue) ? initValue.$value : initValue
    return proxify(value, new ObservableNode(value, null, null, uidFunc))
}


export const reactive = <T>(initValue?: T, uidFunc?: UidFunc) : T => {
    const value = isValueSet(initValue) ? initValue.$value : initValue
    return proxify(value, new ObservableNode(value, null, null, uidFunc))
}


// export const iterable = <T>(initValue: ObservableValueSet<T>|T, uidFunc: UidFunc) : ObservableValueSet<T>&T => {
//     return observable(initValue, uidFunc)
// }



export const isObservable = (v: any) : v is ObservableValueSet<any> => {
    return v != null && typeof (v as Observable<any>).$subscribe === 'function'
    // if (v != null) {
    //     if (v[__isProxy]) {
    //         return '$subscribe' in v
    //     }
    //     else {
    //         return v.$subscribe != null
    //     }
    // }
    // return false
//    return v != null && (v as Observable<any>).$subscribe != undefined
}

export const isValueSet = <T=any>(v: T|ObservableValueSet<T>) : v is ObservableValueSet<T> => {
    return v != null && typeof (v as ValueSet<any>).$at === 'function'
    // if (v != null) {
    //     if (v[__isProxy]) {
    //         return '$at' in v
    //     }
    //     else {
    //         return v.$at != null
    //     }
    // }
    return false
}

export const isValueIterator = (v : any) : v is ValueIterator<any> => {
    if (v != null) {
        if (v[__isProxy]) {
            return 'next' in v
        }
        else {
            return v.next != null
        }
    }
    return false
}



// const ownProps: Set<string|number|symbol> = new Set(['$key', '$value', '$uid', '$source'])

// console.log(Object.getOwnPropertyNames(new ProxyObservableNode()))


export const __isProxy = Symbol('__isProxy')
export const __isValue = Symbol('__isValue')

export interface Proxied {
    [__isProxy]: boolean
}


export const proxify = <T>(obj: T, node: ValueSet<T>) : ValueSet<T>&T => {
    const proxy: any = new Proxy(node, {
        get (target, name) {

            // if (name == __isProxy) {
            //     return true
            // }

            if (name == '_raw') {
                debugger
            }

//            console.log(name, name in target)

            // собственные свойства
            if (name in target) {
                const v = (target as any)[name]
                if (v && typeof v === 'function') {
                    return v.bind(target)
                }
                return v
            }

//             if (target.$is(IsCheck.ARRAY)) {
// //                console.log('array', target.$value, name)
//                 return (target.$value as any)[name]
//             }

            if (target.$has(name, HasCheck.METHOD)) {
                const v = target.$value as any
                return v[name].bind(v)//proxy)
            }


            // if (!target.$has(name)) {
            //     return undefined
            // }

            const entry = (target as ValueSet<any>).$at(name)

            if (_AutoTerminal && entry.$isTerminal) {
//                console.log('terminal', name, target)
                return entry.$value
            }

//            console.log('ENTRY')

            return entry
        },
        set: (target, name, v) : boolean => {
            if (name in target) {
                (target as any)[name] = v
            }
            else {
                (target as ValueSet<any>).$at(name).$value = v
            }
            return true
        },
        ownKeys: (target) : ArrayLike<string|symbol> => {
//            console.log('KEYS')
//            const v = target.$value
            // if (v == null) {
            //     return []
            // }
            return target.$ownKeys()//.concat(Object.keys(target))
        },
        has: (target, name) : boolean => {
//            const v = target.$value
//            console.log('HAS', v, name)
            // if (v == null) {
            //     return false
            // }
            // if (typeof v === 'number') {
            //     return name in Number.prototype
            // }
            // if (typeof v === 'boolean') {
            //     return name in Boolean.prototype
            // }
            return Reflect.has(target, name) || target.$has(name)// Reflect.has(v as any, name)
            //return target.$value != null && (name in target.$value)
            //return true
        },
        getOwnPropertyDescriptor: (target, name) => {
//            console.log(name, target)
            // if (target.$value == null) {
            //     return {}
            // }
            const pd: PropertyDescriptor = Reflect.getOwnPropertyDescriptor(target, name) || target.$getOwnPropertyDescriptor(name)// Reflect.getOwnPropertyDescriptor(target.$value as any, name)
            pd.configurable = true
            return pd
        },
        apply: (target, thisArg, args) => {
            return (target as any).$call(thisArg, args)
            // const f = (target.$value as any)
            // f.$emit('before', args)

            // return (target.$value as any).apply(thisArg, args)
        }
        // getPrototypeOf: (target) : object => {
        //     console.log('get prototype of')
        //     return Reflect.getPrototypeOf(target.$value as any)
        //     // console.log('prototype of')
        //     // if (typeof target.$value === 'number') {
        //     //     return Number.prototype
        //     // }
        //     // return Object.getPrototypeOf(target.$value)
        // }
    })
    return proxy as ValueSet<T>&T
}

    
