import { Proxied, __isProxy } from '../value'
import { Mixed, MixRules, buildOpts } from './utils'



export class Mixin<T=unknown> implements Mixed<T> {

    _raw: (T|boolean)[]

    constructor(...args: any[]) {

        this._raw = []

        for (let i = 0; i < args.length; i++) {
            this.mix(args[i])  //FIXME  потенциальная потеря производительности
        }
    }

    mixins () {
        return this._raw
    }


    mix(nextOpts: any) : Mixed<T> {
        if (nextOpts != null) {
            if (typeof (nextOpts as Mixin).mixins === 'function') {
//                console.log(nextOpts.mixins())
                this._raw = this._raw.concat(nextOpts.mixins())//(nextOpts as any)._raw)
            }
            else {
                this._raw.push(nextOpts)
            }
        }
        return this
    }

    mergeBefore(prevOpts: any) : Mixed<T> {
        if (prevOpts != null) {
            if ((prevOpts as Mixed<T>).mix !== undefined) {
                debugger
                this._raw = prevOpts._raw.concat(this._raw)
            }
            else {
                this._raw.unshift(prevOpts)
            }
        }
        return this
    }

    build (rules?: MixRules) : T|boolean {

        if (this._raw.length == 0) {
            return undefined
        }

        // немножко эвристики для кейсов, когда опции отключаются последним сегментом
        if (this._raw[this._raw.length-1] === false) {
            return false
        }
        if (this._raw[0] === true && this._raw.length == 1) {
            return true
        }

        let o = {} as T
        let clear = false

        for (let i = 0; i < this._raw.length; i++) {
            if (this._raw[i] === true) {
                clear = false
        //        continue
            }
            else if (this._raw[i] === false) {
                clear = true
        //        continue
            }
            else {
                if (clear) {
                    o = {} as T
                }
                o = buildOpts(o, this._raw[i], rules)
                clear = false
            }
        }

        return clear ? {} as T : o
    }

    get entries () {
        return this._raw
    }

}



export const lastEffectiveValue = <T>(o: Mixed<T>) : T|boolean => {
    let last = undefined
    for (let value of o.entries) {
      if (value === true || value === false) {
        last = (last === !value || last == null) ? value : last
      }
      else if (value != null) {
          last = value
      }
    }
    return last
}


export const mixin = <T>(...args: T[]) : Mixed<T> => {
    return new (Function.prototype.bind.apply(Mixin, [null, ...args]))
}

export const isMixed = <T>(obj: Mixed<T>|Proxied|T) : obj is Mixed<T> => {
    if (obj) {
        if (false && (obj as any)[__isProxy]) {
            return ('mix' in obj)
        }
        else {
            return typeof (obj as Mixed<T>).mix === 'function'
        }
    }
    return false
//    return !!(obj && (obj as Mixed<T>).mix)
}
