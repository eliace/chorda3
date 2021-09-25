import { Blueprint, defaultGearFactory, Gear, GearOptions, Injector, iterable, observable, patch, Scoped } from "../src"
import { createPatchScheduler, immediateTick } from "./utils"


type TestScope = {
    data: string
    name: string
}

const createAndRun = <D, E=unknown>(o: Blueprint<D, E>) : Gear<D, E> => {
    const s = new Gear<D, E>(o as GearOptions<D, E>, {$engine: createPatchScheduler(), $defaultFactory: defaultGearFactory} as any)
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
            __it: T[]
        }

        const List = <K, T=unknown>(props: ListProps<T&ListScope<K>>) : Blueprint<T> => {
            return {
                injections: {
                    data: props.data$,
                    __it: (scope) => iterable(scope.data, '_it')
                },
                reactions: {
                    data: (v) => patch({items: v})
                },
                defaultItem: Item<number>({
                    injections: {
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
                    reactions: {
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


    it ('Nested events', () => {

        type EventScope = {
            data: {
                load: (n: number) => string
            }
            onLoad: () => void
        }

        createAndRun<{}, EventScope>({
            events: {
                onLoad: (e, scope) => {
                    
                },
                data: {
                    load: (e, scope) => {

                    }
                }
            }
        })



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
        //         injections: {
        //             items: () => observable([1, 2, 3])
        //         },
        //         bindings: {
        //             items: (v) => patch({items: stream(v, '@item')})
        //         },
        //         defaultItem: Item({
        //             injections: {
        //             }
        //         })
        //     }))
    
        // })
    

})
