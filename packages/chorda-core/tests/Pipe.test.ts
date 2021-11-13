import { Pipe, Scheduler, Fiber, AsyncEngine, pipe } from '../src/pipe'



// class TestPipe implements Pipe {

//     head: Scheduler
//     subscriptions: [Scheduler, Scheduler][]


//     constructor (engines: Scheduler[]) {
//         this.head = engines[0]
//         this.subscriptions = []
//         for (let i = 1; i < engines.length; i++) {
//             if (engines[i-1].subscribe(engines[i])) {
//                 this.subscriptions.push([engines[i-1], engines[i]])
//             }
//         }
//     }

//     push (task: Task): Pipe {
//         this.head.publish(task)
//         return this
//     }

//     asap (task: Task): Pipe {
//         this.head.publish(task)
//         return this        
//     }
// }

class AsyncPatchEngine extends AsyncEngine {

}


class AnimationRenderEngine extends AsyncPatchEngine {
    queue(task: Fiber): void {
        throw new Error('Method not implemented.')
    }
}



const task = (fn: Function, arg?: any, target?: any) => {
    return {fn, arg, target}
}

// const pipe = (...engines: Scheduler[]) => {
//     return new TestPipe(engines)
// }



describe ('Pipe', () => {

    it ('Should pipe engines', (done) => {

        const engine = new AsyncPatchEngine()
        const engine2 = new AsyncPatchEngine()

        engine.subscribe(engine2)

        engine.queue(engine2.fiber(() => {
            console.log('end')
            done()
        }))

        engine.queue(task(() => console.log('1')))
        engine.queue(task(() => console.log('2')))
        engine.queue(task(() => console.log('3')))

    })

    it ('Should fork pipe', () => {

        const engine = new AsyncPatchEngine()
        const engine2 = new AsyncPatchEngine()
        const engine3 = new AsyncPatchEngine()

        pipe(engine, engine2)
        pipe(engine, engine3)

        pipe(engine)
            .push(engine2.fiber(() => console.log('2')))
            .push(engine3.fiber(() => console.log('3')))
            .push(task(() => console.log('1')))

    })

    it ('Should transition task', (done) => {

        const engine = new AsyncPatchEngine()
        const engine2 = new AsyncPatchEngine()
        const engine3 = new AsyncPatchEngine()

        pipe(engine, engine2, engine3).push(engine3.fiber(() => {
            console.log('end')
            done()
        }))

        // engine.subscribe(engine2)
        // engine2.subscribe(engine3)

        // engine.publish(engine3.task(() => {
        //     console.log('end')
        //     done()
        // }))
    })



})