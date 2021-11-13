import { Pipe, Scheduler, Fiber } from "./utils";



class SimplePipe implements Pipe {

    head: Scheduler
    subscriptions: [Scheduler, Scheduler][]

    constructor (schedulers: Scheduler[]) {
        this.head = schedulers[0]
        this.subscriptions = []
        for (let i = 1; i < schedulers.length; i++) {
            if (schedulers[i-1].subscribe(schedulers[i])) {
                this.subscriptions.push([schedulers[i-1], schedulers[i]])
            }
        }
    }

    push(task: Fiber<any>): Pipe {
        this.head.queue(task)
        return this
    }
    
    asap(task: Fiber<any>): Pipe {
        if (task.engine && task.engine.isProcessing) {
            task.engine.queue(task)
        }
        else {
            this.head.queue(task)
        }
        return this
    }

    destroy () {
        this.subscriptions.forEach(sub => {
            sub[0].unsubscribe(sub[1])
        })
    }
}



export const pipe = (...schedulers: Scheduler[]) => {
    return new SimplePipe(schedulers)
}