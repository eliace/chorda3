import { Indexed, Keyed } from "../Hub";
import { ObservableValueSet, UidFunc, ValueKey, ValueSet } from "./node";
import { observable } from "./observable";
import { NextValue, Value, ValueIterator } from "./utils";



export class ObservableValueIterator<T> implements ValueIterator<T> {

    source: ValueSet<any>
    keys: ValueKey[]
    index: number
    maxIndex: number
    key: string
 
    constructor (source: ValueSet<T>, key: string) {
        this.source = source
        this.index = -1
        this.key = key
    }

    next <K>() : NextValue<K> {

        if (this.source == null) {
            return {done: true}
        }

        if (this.index == -1) {
            let v = this.source.$value
            if (Array.isArray(v)) {
                this.maxIndex = v.length
            }
            else if (typeof v === 'object') {
                this.keys = Object.keys(v)
            }
            else {
                console.error('Value is not iterable', v)
            }
        }

        this.index++

        const result : NextValue<K> = {
            done: false
        }

        if (this.keys) {
            if (this.index < this.keys.length) {
                result.value = this.source.$at(this.keys[this.index])
            }
            else {
                result.done = true
            }
        }
        else {
            if (this.index < this.maxIndex) {
                result.value = this.source.$at(this.index)
            }
            else {
                result.done = true
            }
        }

        return result
    }

    get $name () {
        return this.key
    }
}


// export const iterator = <T extends []|{}>(source: T, name: string = '__it') : ValueIterator<T> => {
//     return new ObservableValueIterator(source as any, String(name))
// }

// export const next = <T>(scope: any, name: string = '__it') : Value<T> => {
//     return scope[name]
// }

