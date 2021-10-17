import { expect } from 'chai'
import { Hub, State, HubOptions, observable, EventBus, computable, ObservableValueIterator } from '../src'
import { createTestPatcher, immediateTick } from './utils'



type Data = {
    name?: string
    list?: number[]
}


const createHub = <D, E=unknown>(o: HubOptions<D, E>) : Hub<D, E> => {
    const s = new Hub<D, E>(o, {$patcher: createTestPatcher(), $pipe: null})
    immediateTick()
    return s
}


describe ('Hub', () => {

    describe ('Scope', () => {

        it ('Should iterate through scope entries', () => {

            const s = createHub({
                injections: {
                    a: () => 5,
                    b: () => 'hello'
                }
            })

            const result = []

            for (let k in s.scope) {
                result.push(k)
            }

            expect(result.sort()).to.deep.eq(['$engine', '$pipe', 'a', 'b'])

        })

        it ('Should set value with setter', () => {

            type Data = {
                a: number,
                b: string
            }

            const s = createHub<Data>({
                injections: {
                    a: () => 5,
                    b: () => observable('hello')
                }
            });

            const scope: Data = s.scope as Data

            scope.a = 10
            scope.b = 'bye'

            expect(s.scope.a).to.eq(10)
            expect(s.scope.b.$value).to.eq('bye')

        })
    })

    describe ('Injectors + reactions', () => {

        it ('Should be initialized with empty options', () => {

            const s = createHub({})
    
            expect(s.state).to.be.eq(State.Initialized)
        })
    
        it ('Should be initialized with injections', () => {
    
            const s = createHub({
                injections: {
                    _injector: () => 'Alice',
                    _undefined: undefined,
                    _null: null,

                }
            })
    
            expect(s.state).to.be.eq(State.Initialized)
            expect(s.scope['_injector']).to.be.eq('Alice')
        })

        
        it ('Should bind changed array', () => {
    
            type Data = {
                name: number[]
            }
    
            const s = createHub<Data>({
                injections: {
                    name: () => observable([1, 2, 3])
                },
                reactions: {
                    name: (v) => {
    //                    console.log(v)
                    }
                }
            });
    
            expect(s.scope.name.$value).to.deep.eq([1, 2, 3])
    
            s.scope.name.$value = []
    
            expect(s.scope.name.$value).to.deep.eq([])
    
        })

        it ('Should bind reactor without injector', () => {
    
            type Data = {
                name: number[]
            }
    
            const s = createHub<Data>({
                reactions: {
                    name: (v) => {}
                }
            });
        
        })    

        it ('Should inject terminal', () => {
    
            type Data = {
                address: {
                    city: {
                        postCode: number
                    }
                }
            }

            const profile: Data = observable({
                address: {
                    city: {
                        postCode: 123
                    }
                }
            })
    
            const s = createHub<{postCode: number}>({
                injections: {
                    postCode: () => profile.address.city.postCode
                }
            });

            expect(s.scope.postCode).is.exist
            expect((s.scope.postCode as any).$at).is.exist
        
        })

        it ('Should inject referenced observable and computable', (done) => {

            const profile = observable({
                address: {
                    city: {
                        postCode: 123
                    }
                }
            })

            const h = createHub({
                injections: {
                    postCode: () => profile.address.city.postCode,
                    reverted: (scope) => computable(() => {
//                        console.log(scope.postCode)
                        return (scope as any).postCode == 123
                    })
                }
            })

            // явная инициализация инжектора
            h.scope.reverted

            setTimeout(() => {

                expect(typeof h.scope.postCode.$publish).is.exist

                // console.log(h.scope.reverted)

                // //            profile.address.city.postCode = 321
                
                //             expect(h.scope.postCode).is.exist
                //console.log(h.scope.postCode)
                //             expect(h.scope.postCode).not.instanceOf(Number)

                done()
            })
        })


    })


    describe ('Events', () => {

        it ('Should subscibe and emit event', () => {

            const result: any[] = []

            const v: EventBus<any> = observable(null);

            v.$event('test')

            const hub = createHub({
                injections: {
                    data: () => v
                },
                events: {
                    data: {
                        test: () => {
                            result.push('ok')
                        }    
                    }
                }
            })

            v.$emit('test')

            expect(v.$hasEvent('test')).is.true
            expect(hub.handlers.length).is.eq(1)
            expect(result).to.deep.eq(['ok'])
        })


    })


    describe ('Joints', () => {

        it ('Should join custom subscription', () => {

            const result: string[] = []
    
            const s = createHub<{name: string}>({
                injections: {
                    name: () => observable('Alice')
                },
                joints: {
                    init: ({name}) => {
                        name.$subscribe(v => {
                            result.push(v)
                        })
                    }
                }
            })
    
            s.scope.name.$value = 'Bob'
    
            expect(result).to.deep.eq(['Alice', 'Bob'])
    
        })

        it ('Should call disjoin handler', () => {

            const result: string[] = []

            const s = createHub<{name: string}>({
                injections: {
                    name: () => observable('Alice')
                },
                joints: {
                    init: ({name}) => () => {
                        result.push('ok')
                    }
                }
            })

            s.destroy()

            expect(result).to.deep.eq(['ok'])

        })

        it ('Should defer disjoin', (done) => {

            const s = createHub<{name: string}>({
                injections: {
                    name: () => observable('Alice')
                },
                joints: {
                    init: (name) => () => {
                        return new Promise(resolve => {
                            setTimeout(() => {
                                resolve(null)
                            })
                        })
                    }
                }
            })

            s.destroy()

            expect(s.scope).not.to.deep.eq(null)

            setTimeout(() => {
                expect(s.scope).to.deep.eq(null)
                done()
            })
        })
    


    })


})