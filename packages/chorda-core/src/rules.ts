import { Mixin } from './mix'

const Option = (x: any, y: any) => {
    return new Mixin(x, y)
  }
  
  //const State = (x, y) => {return new State(x, y)}
  
  const OptionCollection = (x: {[key: string]: any}, y: {[key: string]: any} | boolean) => {
  
    if (y === false) {
      return false
    }
    else if (y === true) {
        return true
    }
  
    // if (x === undefined && y == undefined) {
    //   return 
    // }
  
      if (y && y.constructor != Object) {
          x && console.warn('Ignore prev options', x)
          return y
      }
      if (x && x.constructor != Object) {
          y && console.warn('Ignore new options', y)
          return x
      }
  
  //    console.log(x && x.constructor, y && y.constructor)
  
    let kv: {[key: string]: any} = undefined
    if (x != null) {
      kv = kv || {}
      for (let i in x) {
        kv[i] = new Mixin(x[i])
      }
    }
    if (y != null) {
      kv = kv || {}
//      console.log('y', y)
      for (let i in y) {
        kv[i] = kv[i] ? (kv[i] as Mixin).mix(y[i]) : new Mixin(y[i])
      }
    }
  //  console.log(kv)
    return kv
  }
  
  const OptionArray = (x: [], y: []) => {
    // TODO
  }
  
  const StringArray = (x: string[], y: string[]) => {
    let arr = []
    if (x != null) {
      arr = [].concat(x)
    }
    if (y != null) {
      arr = arr.concat(y)
    }
    return arr
  }
  
  const Overlap = (x: any, y: any) => {
    return y
  }
  
  
  const OptionCollectionOverlap = (x: any, y: any) => {

//    console.log('overlap', x, y)
  
      if (y === false) {
          return false
        }
        else if (y === true) {
            return x
        }

      if (y && y.constructor != Object) {
          x && console.warn('Ignore prev options', x)
          return y
      }
      if (x && x.constructor != Object) {
          y && console.warn('Ignore new options', y)
          return x
      }
  
//     console.log(x && x.constructor, y && y.constructor)
  
    let kv: {[key: string]: any} = {}
    if (x != null) {
      for (let i in x) {
        kv[i] = new Mixin(x[i])
      }
    }
    if (y != null) {
//      console.log('y+', y)
      for (let i in y) {
        kv[i] = new Mixin(y[i])
      }
    }
//    console.log(JSON.stringify(kv))
    return kv
  }
  
  
  
  
  export const DefaultRules = {
    Option,
    OptionCollection,
    OptionArray,
    StringArray,
    Overlap,
    OptionCollectionOverlap
  }
  