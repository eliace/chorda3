import { isMixed, lastEffectiveValue, mixin, Mixed, MixRules } from './mix'
import { Hub, HubEvents, HubOptions, HubScope, Indexed, Keyed, NoInfer, State } from './Hub'
import { DefaultRules } from './rules'
import { isIterable, isValueIterator, IterableValue, Value, ValueIterator } from './value'
import { ItemOp, KVItem, reconcile } from './reconcile'


export const defaultGearFactory = <D, E>(opts: GearOptions<D, E>, context: GearScope&D, scope?: any, rules? : MixRules) : Gear<D> => {
    return new Gear(opts, context, scope)
}


//------------------------------------
// GEAR
//------------------------------------

export type GearBlueprint<D=unknown, E=unknown> = GearOptions<D, E>|string|boolean|Function|Mixed<any>//<Blueprint<D, E>>


export const defaultInitRules = {
    defaultItem: DefaultRules.Option,
    defaultComponent: DefaultRules.Option,
    components: DefaultRules.OptionCollection,
    templates: DefaultRules.OptionCollection,
}

export const defaultPatchRules = {
    defaultItem: DefaultRules.OptionCollectionOverlap,
    defaultComponent: DefaultRules.OptionCollectionOverlap,
    components: DefaultRules.OptionCollectionOverlap,
    templates: DefaultRules.OptionCollectionOverlap,
    items: DefaultRules.Overlap,
}

export function defaultGearSort (a: Gear, b: Gear) {
    const w1 = (a.options && a.options.weight) || 0
    const w2 = (b.options && b.options.weight) || 0
    if (w1 == w2) {
      const i1 = a.index || 0
      const i2 = b.index || 0
      return i1 - i2
    }
    return w1 - w2
}


type KeyedAndIndexed = {
    index: number
    key: string
}



export interface GearOptions<D, E, B extends GearBlueprint<D, E>=GearBlueprint<D, E>> extends HubOptions<D, E> {
    
    weight?: number
    name?: string

    // контейнер items
    items?: B[] | boolean
    itemFactory?: Function
    defaultItem?: B

    // контейнер components
    components?: {[key: string]: B} | boolean
    componentFactory?: Function
    defaultComponent?: B

    templates?: {[key: string]: B}

    childFilter?: (value?: KeyedAndIndexed, index?: number, array?: this[]) => boolean
    childSorter?: (a: this, b: this) => number
}

export type GearScope = HubScope & {
    $defaultFactory: Function
    // afterSyncIndexed?: () => Indexed<Gear>
    // afterSyncKeyed?: () => Keyed<Gear>
    // afterAddKeyed?: () => Gear
    // beforeRemoveKeyed?: () => string
}

export type GearEvents = HubEvents & {
    afterSyncIndexed?: () => Indexed<Gear>
    afterSyncKeyed?: () => Keyed<Gear>
    afterAddKeyed?: () => Gear
    beforeRemoveKeyed?: () => string
}


export const isGear = (obj: any) : obj is Gear => {
    return obj != null && (obj as Gear).addIndexed != null
}



export class Gear<D=unknown, E=unknown, S extends GearScope=GearScope, O extends GearOptions<D, E>=GearOptions<D, E>, B extends GearBlueprint<D, E>=GearBlueprint<D, E>> extends Hub<D, E, S, O> {

//    containers: {[k: string]: ComponentCollection<B>|ItemCollection<B>}
    index: number
    key: string
    parent: this
    components: {[k: string]: Gear<D>}
    items: Gear<D>[]
    uid: string | number | symbol

    constructor (options: O, context?: S, scope?: any) {
        super(options, context, scope)

        this.components = {}
        this.items = []
    }

    patch (optPatch: O) {
        super.patch(optPatch)

        const o = this.options

        // console.log(optPatch)
        // console.log(o)


        if (optPatch.templates != null) {
            if (o.components && o.components !== true) {
                // пересоздаем компоненты
                for (let k in optPatch.templates) {
                    // if (this.components[k]) {
                    //     this.updateComponent(k, o.components[k] as B)
                    // }
//                    console.log('template component', k, o.components[k])
                    if (o.components[k] === undefined) {
                        this.addKeyed(k, null)
                    }
                }
            }
            else if (o.components == null) {
                // создаем компоненты по умолчанию
                for (let k in optPatch.templates) {
                    this.addKeyed(k, null)
                }
            }
        }

        if (optPatch.components != null) {
            if (o.components === true) {
                for (let k in o.templates) {
                    this.addKeyed(k, null)
                }
            }
            else if (o.components === false) {
                // TODO здесь мы должны выключать все компоненты
            }
            else {
                this.syncKeyed(o.components as Keyed<Mixed<B>>)
            }
        }

        if (optPatch.items) {
            if (o.items === true) {

            }
            else if (o.items === false) {

            }
            else {
                this.syncIndexed(o.items as Mixed<B>[])
            }
        }


    }

    initRules () : MixRules {
        return defaultInitRules
    }

    patchRules () : MixRules {
        return defaultPatchRules
    }


    //-----------------------
    // Keyed
    //-----------------------

    addKeyed (key: string, blueprint: B|Mixed<B>|Gear<D>, scope?: D&GearScope) : Gear<D> {

        if (this.components[key]) {
            console.error('Component already exists', key)
        }

        // if (blueprint == null) {
        //     return
        // }
        if (isMixed(blueprint)) {
            console.error('Component should not be of mixed type')
            const last  = lastEffectiveValue(blueprint)
            if (last === false || last == null) {
                return
            }
        }
        else if (isGear(blueprint)) {
            // FIXME
            // if (blueprint.parent) {
            //     // FIXME это надо заменить на removeChild
            //     blueprint.key ? blueprint.parent.removeKeyed(blueprint.key) : blueprint.parent.removeIndexed(blueprint.index)
            // }
            blueprint.parent = this
            blueprint.key = key
            this.components[key] = blueprint
            return blueprint
        }    

        const {defaultComponent, templates, componentFactory} = this.options

        const template = templates ? templates[key] : undefined
//        const templates = this.parent.options.templates

        const compOpts = mixin(defaultComponent, template, blueprint).build(this.initRules())

        if (compOpts) {
//            console.log(scope)
            const comp = (componentFactory || this.scope.$defaultFactory)(compOpts, this.scope, scope)
            comp.key = key
            comp.parent = this

            this.components[key] = comp

            this.events.afterAddKeyed?.(comp, this.scope)

            return comp
        }
    }

    removeKeyed (key: string) {
        this.events.beforeRemoveKeyed?.(key, this.scope)
        delete this.components[key]
    }

    updateKeyed (key: string, blueprint: B) {
        this.components[key].destroy()
        this.addKeyed(key, blueprint)
    }

    syncKeyed (next: {[k: string]: Mixed<B>} | IterableValue<any>) {

//        console.log('sync-keyed', this.key, next)

        if (isIterable(next)) {

            const it = next
            const key = it.$name

            const components = {...this.components}
            const componentsToUpdate: Keyed<Gear> = {}
            const componentsToAdd: Keyed<any> = {}

            next.$each(result => {

                const k = result.$uid

                if (k in components) {
                    componentsToUpdate[k] = components[k]
                }
                else {
                    componentsToAdd[k] = result
                }

                delete components[k]

            })

            // let result = it.next()
            // while (!result.done) {

            //     const k = result.value.$uid

            //     if (k in components) {
            //         componentsToUpdate[k] = components[k]
            //     }
            //     else {
            //         componentsToAdd[k] = result.value
            //     }

            //     delete components[k]

            //     result = it.next()
            // }

            for (let k in componentsToAdd) {
                // FIXME не бьются типы скоупа и нового элемента
                this.addKeyed(k, {} as B, {[key]: componentsToAdd[k]} as any)
            }
            for (let k in components) {
                this.removeKeyed(k)
            }
            for (let k in componentsToUpdate) {
                console.warn('Component update not yet ready')
                // TODO
            }

        }
        else {

            // свойство аддитивности позволяет обновлять элементы поотдельности

            for (let k in next) {
                const nextComp = next[k].build(this.initRules())

//                console.log('Next comp', k, nextComp, next[k])

                const comp = this.components[k]

                if (nextComp === false) {
                    if (comp) {
                       if (comp.parent == this) {
                            // для собственных компонентов начинаем процедуру удаления
                            comp.destroy()
                        }
                        else {
                            // компонент-кукушку просто убираем из списка
                            this.removeKeyed(k)
                        }
                    }
                }
                else if (nextComp === true) {
                    if (!comp) {
                        this.addKeyed(k, {} as B)
                    }
                    else if (comp.state == State.Destroying) {
                        console.log('stop destroying', k)
                        comp.reset()
                    }
                    else {
                        if (comp.state == State.Destroyed) {
                            console.warn('component already destroyed', k)
                        }
                    }
                }
                else if (nextComp != null) {
                    if (!comp) {
                        this.addKeyed(k, nextComp)
                    }
                    else {
                        // FIXME здесь мы предполагаем, что в next именно options
                        comp.reset(nextComp as GearOptions<any, any>)
                    }
                }
                else {
                    // игнорируем пустые компоненты
                }
            }
        }

        this.events.afterSyncKeyed?.(this.components, this.scope)
    }

    //-----------------------
    // Indexed
    //-----------------------


    addIndexed (blueprint: B|Mixed<B>|Gear<D>, idx?: number, scope?: unknown) : Gear<D> {
        
        if (blueprint == null) {
            return
        }
        if (isMixed(blueprint)) {
//            console.error('Item should not be of mixed type')
            const last  = lastEffectiveValue(blueprint)
            if (last === false || last == null) {
                return
            }
        }
        else if (isGear(blueprint)) {
            // FIXME
            this.items.push(blueprint)
            return blueprint
        }

        const {defaultItem, itemFactory} = this.options

        //const template = templates ? templates[templateKey] : undefined

        const itemOpts = mixin(defaultItem/*, template*/, blueprint as any).build(this.initRules())

//        console.log(itemOpts)
        
        if (itemOpts) {
            let index = idx
            if (index == null) {
                index = this.items.length
            }
            else {
                for (let i = index; i < this.items.length; i++) {
                    this.items[i].index++
                }
            }

            const item: this = (itemFactory || this.scope.$defaultFactory)(itemOpts, this.scope, scope)
            item.index = index
            item.parent = this

            this.items.splice(index, 0, item)

            return item
        }
    }

    updateIndexed (idx: number, blueprint: B) {
        // TODO
    }

    removeIndexed (idx: number) {
        this.items.splice(idx, 1)
    }

    syncIndexed (next: Mixed<B>[] | IterableValue<any>) {

//        console.log('sync indexed', this.key, next)

        if (isIterable(next)) {

            const it = next
            const key = it.$name

            const prevItems: KVItem[] = []
            this.items.forEach(item => {
                prevItems.push({
                    key: String(item.uid),
                    value: item
                })
            })
            const nextItems: KVItem[] = []

            next.$each((result, key) => {
                nextItems.push({
                    key: result.$uid === undefined ? key : result.$uid,
                    value: result
                })
            })
            
            // let result = it.next()
            // while (!result.done) {
            //     nextItems.push({
            //         key: result.value.$uid,
            //         value: result.value
            //     })
            //     result = it.next()
            // }

            console.log('next items', nextItems, prevItems)
//            console.log('reconcile')

            const mergedItems: KVItem[] = reconcile(prevItems, nextItems)

            console.log('reconcile end')

//            console.log('merged items', this.key, mergedItems)

            const children: Gear<D>[] = []

            let i = 0
            mergedItems.forEach((itm) => {
                let item: Gear<D> = null
                if (itm.op == ItemOp.ADD) {
                    const v = itm.value
                    item = this.addIndexed({} as B, i, {[key]: v})
                    item.uid = itm.key// v.$uid
//                        console.log('add', i, itm.key)//v.$uid)
                }
                else if (itm.op == ItemOp.DELETE) {
                    item = itm.value as Gear<D>
                    item.parent = null
                    item.destroy()
                    item.parent = this
                    if (item.state == State.Destroyed) {
                        i--
                        item = null
                    }
//                        console.log('del', i, itm.key)
                }
                else {
                    item = itm.value as Gear<D>
                    item.index = i
//                        console.log('upd', i, itm.key, itm.value)
                }
                item && children.push(item)
                i++
            })

            this.items = children

//            console.log(this.items)

        }
        else {

//            console.log(next)

            if (!Array.isArray(next)) {
                console.error('Items must be array like value', next)
            }

            // у индексированных элементов нет свойства аддитивности, поэтому пересоздаем все элементы

            this.items.forEach(item => {
                delete item.parent
                item.destroy()
            })

            this.items = []

            for (let o of next) {
                this.addIndexed(o)
            }
        }

        this.events.afterSyncIndexed?.(this.items, this.scope)
    }



    destroy (deferred?: Function) {

        super.destroy(() => {

            if (this.parent) {
                if (this.key) {
                    this.parent.removeKeyed(this.key)
                }
                else {
                    this.parent.removeIndexed(this.index)
                }
            }
            for (let child of this.items) {
                delete child.parent
                child.destroy()
            }
            for (let k in this.components) {
                const child = this.components[k]
                delete child.parent
                child.destroy()
            }
            delete this.parent
            delete this.key
            delete this.index
            this.items = []
            this.components = {}

            deferred && deferred()
        })

    }



    get children () : this[] {
        let children = [].concat(this.items).concat(Object.values(this.components)).filter(c => c.parent == this)
        if (this.options.childFilter) {
            children = children.filter(this.options.childFilter)
        }
        return children.sort(this.options.childSorter || defaultGearSort)
    }

    visit (visitor: (node: this) => boolean|void) {
        if (visitor(this) !== false) {
            this.children.forEach(visitor)
        }
    }
}




