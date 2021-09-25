import { ownTaskFilter, Scheduler, subscriptionTaskFilter, Task, unknownTaskFilter } from "./utils";



export class BufferedEngine<T extends Task = Task> implements Scheduler<T> {

    tasks: Task[]
    subscriptions: Scheduler[]
    processing: boolean

    constructor () {
        this.tasks = []
        this.subscriptions = []
        this.processing = false
    } 

    publish(task: T): void {

        if (task.done) {
            return
        }
        
        this.tasks.push(task)
    }

    subscribe(engine: Scheduler): boolean {
        if (this.subscriptions.indexOf(engine) == -1) {
            this.subscriptions.push(engine)
            return true
        }
        return false
    }

    unsubscribe(engine: Scheduler) {
        this.subscriptions = this.subscriptions.filter(sub => sub != engine)
    }

    task (fn: Function, arg?: any, target?: any) : Task {
        return {fn, arg, target, engine: this}
    }

    flush () {
        this.processing = true

        let tasks = this.tasks
        this.tasks = []

        tasks
            .filter(ownTaskFilter(this))
            .filter(subscriptionTaskFilter(this.subscriptions))
            .filter(unknownTaskFilter(this.subscriptions))

        if (this.tasks.length > 0) {
            this.flush()
        }

        this.processing = false
    }

    get isProcessing () {
        return this.processing
    }
}
