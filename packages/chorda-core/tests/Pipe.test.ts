import { Pipe, Scheduler, Task, AsyncEngine } from '../src/pipe'



class TestPipe implements Pipe {

    head: Scheduler
    subscriptions: [Scheduler, Scheduler][]


    constructor (engines: Scheduler[]) {
        this.head = engines[0]
        this.subscriptions = []
        for (let i = 1; i < engines.length; i++) {
            if (engines[i-1].subscribe(engines[i])) {
                this.subscriptions.push([engines[i-1], engines[i]])
            }
        }
    }

    publish(task: Task): Pipe {
        this.head.publish(task)
        return this
    }
}

class AsyncPatchEngine extends AsyncEngine {

}

// class AsyncPatchEngine implements Engine {

//     tasks: Task[]
//     subscriptions: Engine[]
//     key: string
//     scheduled: boolean

//     constructor () {
//         this.tasks = []
//         this.subscriptions = []
// //        this.key = name
//         this.scheduled = false
//     } 

//     publish(task: Task): void {

//         if (task.done) {
//             return
//         }
        
//         this.tasks.push(task)

//         if (!this.scheduled) {
//             this.scheduled = true
//             setTimeout(() => {
//                 console.log('tick')

//                 let tasks = this.tasks
//                 this.tasks = []

//                 // если появляются новые задачи, они попадают в следующий тик
//                 tasks = tasks.filter(task => {
//                     if (!task.engine || task.engine == this) {
//                         // исполняем задачу
//                         task.fn.call(task.target, task.arg)
//                         task.done = true
//                     }
//                     else {
//                         return true
//                     }
//                 })

//                 tasks = tasks.filter(task => {
//                     const engine = this.subscriptions.find((sub) => sub == task.engine)
//                     if (engine) {
//                         engine.publish(task)
//                     }
//                     else {
//                         return true
//                     }
//                 })

//                 tasks.forEach(task => {
//                     this.subscriptions.forEach(sub => {
//                         sub.publish(task)
//                     })
//                 })

//                 // tasks.forEach(task => {
//                 //     if (!task.engine || task.engine == this) {
//                 //         // исполняем задачу
//                 //         task.fn.call(task.target, task.arg)
//                 //     }
//                 // })

//                 // tasks.forEach(task => {
//                 //     this.subscriptions.forEach(sub => {
//                 //         if (sub == task.engine) {
//                 //             sub.publish(task)
//                 //         }
//                 //     })
//                 //     // if (this.subscriptions[task.key]) {
//                 //     //     // отправляем задачу в соответствующий канал
//                 //     //     this.subscriptions[task.key].forEach(sub => {
//                 //     //         sub.publish(task)
//                 //     //     })
//                 //     // }
//                 // })

//                 this.scheduled = false
//             })
//         }
//     }

//     subscribe(engine: Engine): boolean {
//         if (this.subscriptions.indexOf(engine) == -1) {
//             this.subscriptions.push(engine)
//             return true
//         }
//         return false
//         // if (!this.subscriptions[engine.name]) {
//         //     this.subscriptions[engine.name] = []
//         // }
//     }

//     get name () : string {
//         return this.key
//     }

//     task (fn: Function, arg?: any, target?: any) {
//         return {fn, arg, target, engine: this}
//     }
// }

class AnimationRenderEngine extends AsyncPatchEngine {
    publish(task: Task): void {
        throw new Error('Method not implemented.')
    }
}



const task = (fn: Function, arg?: any, target?: any) => {
    return {fn, arg, target}
}

const pipe = (...engines: Scheduler[]) => {
    return new TestPipe(engines)
}



describe ('Pipe', () => {

    it ('Should pipe engines', (done) => {

        const engine = new AsyncPatchEngine()
        const engine2 = new AsyncPatchEngine()

        engine.subscribe(engine2)

        engine.publish(engine2.task(() => {
            console.log('end')
            done()
        }))

        engine.publish(task(() => console.log('1')))
        engine.publish(task(() => console.log('2')))
        engine.publish(task(() => console.log('3')))

    })

    it ('Should fork pipe', () => {

        const engine = new AsyncPatchEngine()
        const engine2 = new AsyncPatchEngine()
        const engine3 = new AsyncPatchEngine()

        pipe(engine, engine2)
        pipe(engine, engine3)

        pipe(engine)
            .publish(engine2.task(() => console.log('2')))
            .publish(engine3.task(() => console.log('3')))
            .publish(task(() => console.log('1')))

    })

    it ('Should transition task', (done) => {

        const engine = new AsyncPatchEngine()
        const engine2 = new AsyncPatchEngine()
        const engine3 = new AsyncPatchEngine()

        pipe(engine, engine2, engine3).publish(engine3.task(() => {
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