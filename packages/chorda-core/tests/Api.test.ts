import { Blueprint, defaultGearFactory, Gear, GearOptions, Injector, iterator, observable, patch, Scoped } from "../src"
import { createEngine, immediateTick, nextTick } from "./utils"


type TestScope = {
    data: string
    name: string
}

const createAndRun = <D>(o: Blueprint<D, unknown>) : Gear<D> => {
    const s = new Gear<D>(o as GearOptions, {$engine: createEngine(), $defaultFactory: defaultGearFactory} as any)
    immediateTick()
    return s
}


describe ('Data', () => {

    it ('List + Item', () => {

        type ListProps<T> = {
            data$: Injector<T>
            item: Blueprint<T>
        }

        type ListScope<T> = {
            data: T
        }

        const List = <K, T=unknown>(props: ListProps<T&ListScope<K>>) : Blueprint<T> => {
            return {
                injectors: {
                    data: props.data$
                },
                reactors: {
                    data: (v) => patch({items: iterator(v, '_it')})
                },
                defaultItem: Item<number>({
                    injectors: {
                        data: (s) => (s as any)._it
                    }
                })
            } as Blueprint<T&ListScope<K>>
        }

        const Item = <K, T=unknown>(props: Blueprint<Omit<T, 'data'>&{data: K}>) : Blueprint<T> => {
            return props as Blueprint<T>
        }

        const s = createAndRun<TestScope>(
            List<number>({
                data$: () => observable([1, 2, 3]),
                item: Item<number>({
                    reactors: {
                        data: (v) => patch({test: v}),
                    }
                })
            })
        )


    })

    it ('Scope narrow', () => {

        type AppScope = {
            router: {name: string}
        }

        type SelectedScope = {
            selected: string
        }

        type S = Scoped<AppScope&SelectedScope>

        const x: S = {}

//        x.router.name

    })

        // it ('Should narrown collections to items', () => {

        //     const List = <T extends {items: number[]}>(props: Blueprint<T>) : Blueprint<T> => {
        //         return props
        //     }

        //     // const ListToItem = <T>(props: Blueprint<T&{items: number[], item: number}>) : Blueprint<T> => {
        //     //     return props
        //     // }

        //     const Item = <T>(props: Blueprint<T&{item: number}>) : Blueprint<T> => {
        //         return props
        //     }

        //     const s = createAndRun(List({
        //         injectors: {
        //             items: () => observable([1, 2, 3])
        //         },
        //         bindings: {
        //             items: (v) => patch({items: stream(v, '@item')})
        //         },
        //         defaultItem: Item({
        //             injectors: {
        //             }
        //         })
        //     }))
    
        // })
    

})
