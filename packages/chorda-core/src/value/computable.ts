import { EMPTY, UpdateDirection, ObservableValueSet, spyGetters, ValueSet, UidFunc, openTransaction, closeTransaction, transactionUpdates } from './node'
import { autoTerminalAware, proxify, ObservableNode, isValueSet } from './observable'
import { Observable, PublishFunc, Subscriber, Subscription } from './utils'


interface Computable {
    $compute () : void
}

//type ComputableValue<T> = ObservableValue<T>&Computable

type Computor<T> = () => T


class ComputableNode<T> extends ObservableNode<T> implements Computable {

    _computor: Computor<T>
    _touched: boolean
    _publishers: Subscription[]
    _sources: Set<Observable<unknown>>

    constructor (computor: Computor<T>, initValue?: T, entryUidFunc?: UidFunc) {
        super(initValue, undefined, undefined, entryUidFunc)

        this._computor = computor
        this._initialized = false // отменяем инициализацию
        this._sources = new Set()
        //this._publishers = []
        //this._touched = false
    }

    $compute () : T {



        let next: T = undefined
        // this._publishers.forEach(dep => {
        //     if ((dep.observable as any)._destroyed) {
        //         console.warn('Destroyed dependency detected', dep)
        //         this._destroyed = true
        //     }
        // })
        // if (this._destroyed) {
        //     this._publishers.forEach(dep => {

        //     })
        //     return undefined
        // }
        // this._publishers = []

//         this._sources.forEach(dep => {
//             if ((dep as any)._destroyed) {
//                 // TODO поместить в очередь на удаление
//                 this._destroyed = true
//             }
//         })
//         if (this._destroyed) {
//             this._sources.forEach(dep => {
//                 dep.$unsubscribe(this)
//             })
//             this._sources.clear()
// //            this._destroyed = false
//             return
//         }

        const getters = spyGetters(() => {
            next = autoTerminalAware(this._computor)
        })
        // getters.forEach(dep => {
        //     if ((dep as any)._destroyed) {
        //         console.warn('Destroyed dependency detected', dep)
        //         this._destroyed = true
        //     }
        // })
        // if (!this._destroyed) {
            getters.forEach(dep => {
                // автоподписка
                dep.$subscribe(this)
                this._sources.add(dep)
            })    
        // }


        if (isValueSet(next)) {
            next = next.$value
        }

        return next
    }

    // $touch(subscriber: Subscriber<T>): void {
    //     let value = undefined
    //     if (!this._touched) {
    //         value = this.$compute()
    //         this._touched = true
    //     }
    //     subscriber.$publish(value, undefined, EMPTY)       
    // }

    $publish(next: any, prev?: any, keys?: {[key: string]: any}): void {

        if (this._destroyed) {
            console.warn('Publishing to destroyed computable')
            return
        }

        let computed: any = this.$compute()

        if (computed && typeof (computed as ValueSet<any>).$at === 'function') {
            computed = computed.$value
        }

        if (this.$isPrimitive && computed === this._memoValue) {
//            console.log('No change detected', computed, this._memoValue)
            return
        }


        const t = openTransaction()
        super.$publish(computed, null, EMPTY)

        let count = 0
        transactionUpdates(t).forEach(upd => {
            count += upd.node._subscriptions.length
        })

        if (count == 0) {
//            debugger
            this._sources.forEach(dep => {
                dep.$unsubscribe(this)
            })
            this._sources.clear()
            this._initialized = false
//            this._destroyed = true

//            console.log('unsubscribed computable detected [publish]')
        }


        closeTransaction(t)
        // this._updateEntries(computed)
        // // у вычисляемых значений нет родителя/источника, поэтому обновляем поддерево только вниз
        // this.$update(UpdateDirection.DESC, computed, null, EMPTY)    
    }

    $unsubscribe(subscription: Subscription|Subscriber<T>|PublishFunc<T>): void {
        super.$unsubscribe(subscription)

        // быстрая проверка на отписку
        if (this._subscriptions.length == 0 && Object.keys(this._entries).length == 0) {
            
            this._sources.forEach(dep => {
                dep.$unsubscribe(this)
            })
            this._sources.clear()
            this._initialized = false
//            this._destroyed = true

//            console.log('unsubscribed computable detected [unsubscribe]')
        }
    }


    $get () {
//        console.log('compute')
        return this._initialized ? this._memoValue : this.$compute()
    }

}





//const _computeQue: ComputableNode<any>[] = []

export const computable = <T>(compute: Computor<T>, initValue?: T, entryUidFunc?: UidFunc) : ObservableValueSet<T>&T => {
    let c = proxify(null, new ComputableNode<T>(compute, initValue, entryUidFunc))
    // TODO переделать в compute engine?
    // if (_computeQue.length == 0) {
    //     setTimeout(() => {
    //         while(_computeQue.length) {
    //             _computeQue.shift().$publish(null)
    //         }
    //     })    
    // }
    // _computeQue.push(c)
    return c
}
