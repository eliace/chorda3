



describe('Value', () => {

    // describe ('Iterator', () => {

    //     it ('Should iterate array', () =>{

    //         const v: number[] = observable([1, 2, 3])

    //         const it = iterator(v)

    //         const a: Value<number>[] = []

    //         let result = it.next()
    //         while(!result.done) {
    //             a.push(result.value)

    //             result = it.next()
    //         }

    //         expect(a.length).to.eq(3)
    //         expect(a.map(v => v.$uid)).to.deep.eq(['1', '2', '3'])
    //     })

    //     it ('Should iterate objects', () => {

    //         const v: {a: number, b: number, c: number} = observable({a: 1, b: 2, c: 3})

    //         const it = iterator(v)

    //         const a: Value<any>[] = []

    //         let result = it.next()
    //         while(!result.done) {
    //             a.push(result.value)
    //             result = it.next()
    //         }

    //         expect(a.length).to.eq(3)
    //         expect(a.map(v => v.$uid).sort()).to.deep.eq(['1', '2', '3'])
    //     })

    //     it ('Should ignore null source', () => {

    //         const it = iterator(null)

    //         expect(it.next().done).is.true

    //     })

    //     it ('Should use default iterator key', () => {

    //         const it = iterator([])

    //         expect(it.$name).to.eq('__it')
            
    //     })

    //     it ('Should', () => {


    //         const context : any = {
    //             a: 1,
    //             b: 2
    //         }

    //         const obj : any = {}

    //         const p = new Proxy(obj, {
    //             get: (target, p) : any => {
    //                 return (target as any)[p] || context[p]
    //             },
    //             set: (target, p, value) : boolean => {
    //                 (target as any)[p] = value
    //                 return true
    //             },
    //             ownKeys: (target) : ArrayLike<string|symbol> => {
    //                 console.log('ownKeys')
    //                 return ['a', 'b']
    //             },
    //             has: (target, p) : boolean => {
    //                 console.log('has', p)
    //                 return true
    //             },
    //             getOwnPropertyDescriptor: (target, p) => {
    //                 console.log('descriptor', p)
    //                 return Reflect.getOwnPropertyDescriptor(context, p)
    //             }
    //         })

    //         for (let k in p) {
    //             console.log('key', k)
    //         }

    //     })

    // })

})