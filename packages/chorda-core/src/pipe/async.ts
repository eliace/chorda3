import { Scheduler, Task } from "./utils";


export const ownTaskFilter = (owner: Scheduler) => (task: Task) => {
    if (!task.engine || task.engine == owner) {
        // исполняем задачу
        task.fn.call(task.target, task.arg)
        task.done = true
    }
    else {
        return true
    }
}

export const subscriptionTaskFilter = (subscriptions: Scheduler[]) => (task: Task) => {
    const engine = subscriptions.find((sub) => sub == task.engine)
    if (engine) {
        engine.publish(task)
    }
    else {
        return true
    }
}

export const unknownTaskFilter = (subscriptions: Scheduler[]) => (task: Task) => {
    subscriptions.forEach(sub => {
        sub.publish(task)
    })
}


export class AsyncEngine<T extends Task = Task> implements Scheduler<T> {

    tasks: Task[]
    subscriptions: Scheduler[]
    scheduled: boolean

    constructor () {
        this.tasks = []
        this.subscriptions = []
//        this.key = name
        this.scheduled = false
    } 

    publish(task: Task): void {

        if (task.done) {
            return
        }
        
        this.tasks.push(task)

        !this.scheduled && this.schedule()
    }

    subscribe(engine: Scheduler): boolean {
        if (this.subscriptions.indexOf(engine) == -1) {
            this.subscriptions.push(engine)
            return true
        }
        return false
    }

    task (fn: Function, arg?: any, target?: any) : Task {
        return {fn, arg, target, engine: this}
    }

    schedule () {
        this.scheduled = true
        setTimeout(() => {
            console.log('tick')

            let tasks = this.tasks
            this.tasks = []

            tasks
                .filter(ownTaskFilter(this))
                .filter(subscriptionTaskFilter(this.subscriptions))
                .filter(unknownTaskFilter(this.subscriptions))

            this.scheduled = false
        })
    }


}