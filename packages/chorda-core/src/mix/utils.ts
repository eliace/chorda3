import { isValueSet } from "../value"
import { isMixed } from "./Mixin"




export interface Mixed<T> {
    build: (rules: MixRules) => T|boolean
    mix: <X>(nextMix: X) => Mixed<T&X>
    readonly entries: any[]
}

export type MixRules = {
    [key: string]: Function
}



export const deepClone = (o: any) : any => {
    if (o != null) {
      if (o.constructor === Object) {
        const copy = {} as {[key: string]: any}
        for (let i in o) {
          copy[i] = deepClone(o[i])
        }
        o = copy
      }
      else if (o instanceof Array) {
        const copy = []
        for (let i = 0; i < o.length; i++) {
          copy[i] = deepClone(o[i])
        }
        o = copy
      }
    }
    return o
  //  return JSON.parse(JSON.stringify(o))
  }
  

 const buildProp = (prop: any, nextProp: any, rule?: Function) : any => {

    if (nextProp && isValueSet(nextProp)) {
        nextProp = nextProp.$value
    }

    if (rule) {
        prop = rule(prop, nextProp)
    }
    else {
      if (prop && nextProp !== undefined && (prop.constructor === Object || prop.constructor === Array)) {
        prop = buildOpts(prop, nextProp)
      }
      else if (nextProp !== undefined) {
        if (nextProp != null && (nextProp.constructor === Object || nextProp.constructor === Array)) {
          prop = deepClone(nextProp)
  //        console.log('deep', nextProp, prop)
        }
        else {
          prop = nextProp
        }
      }
    }
  
    return prop
}
  

export const buildOpts = (opts: any, nextOpts: any, rules?: MixRules) : any => {

    if (nextOpts && isValueSet(nextOpts)) {
        console.warn('Resolve observable opts', nextOpts)
        nextOpts = nextOpts.$value
    }

    if (typeof nextOpts == 'function') {
    //    console.log('resolve func mix', nextOpts, opts)
        nextOpts = nextOpts()
    }
    else if (typeof nextOpts == 'string') {
        console.warn('string opts', nextOpts)
    }
    else if (typeof nextOpts == 'number') {
        console.warn('number opts', nextOpts)
    }

    // TODO возможно, здесь нужен цикл до тех пор, пока не исчезнет примесь
    if (nextOpts && typeof (nextOpts as Mixed<any>).mix === 'function' /*isMixed(nextOpts)*/) {
      nextOpts = nextOpts.build(rules)
    }


    // если nextOpts является объектом
    if (nextOpts === undefined) {
        // 
    }
    else if (nextOpts === null) {
        opts = null
    }
    else if (nextOpts.constructor === Object) {
        for (let i in nextOpts) {
        // if (i[0] == '!') {
        //   opts[i.substr(1)] = nextOpts[i]
        // }
        // else if (i[0] == '+') {
        //   // TODO
        // }
        // else if (i[0] == '-') {
        //   // TODO
        // }
        // else {
            opts[i] = buildProp(opts[i], nextOpts[i], rules && (rules[i] || rules[i[0]]))
        // }
        }
    }
    // если nextOpts является массивом
    else if (nextOpts.constructor === Array) {
        for (let i = 0; i < nextOpts.length; i++) {
        opts[i] = buildProp(opts[i], nextOpts[i], rules && (rules[i]/* || rules[i[0]]*/))
        }
    }
    else if (nextOpts instanceof Promise) {
        return Promise.all([opts, nextOpts]).then(o => {
          return buildOpts(o[0], o[1], rules)
        })
    }
    else {//if (nextOpts !== undefined) {
        opts = nextOpts
    }

    return opts
}
