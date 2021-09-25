import { Pipe, Scheduler, Task } from "./utils";



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

    push(task: Task<any>): Pipe {
        this.head.publish(task)
        return this
    }
    
    asap(task: Task<any>): Pipe {
        if (task.engine && task.engine.isProcessing) {
            task.engine.publish(task)
        }
        else {
            this.head.publish(task)
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