import { ownTaskFilter, Scheduler, subscriptionTaskFilter, Fiber, unknownTaskFilter } from "./utils";



export class BufferedEngine<T extends Fiber = Fiber> implements Scheduler<T> {

    tasks: Fiber[]
    subscriptions: Scheduler[]
    processing: boolean

    constructor () {
        this.tasks = []
        this.subscriptions = []
        this.processing = false
    } 

    queue(task: T): void {

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

    fiber (fn: Function, arg?: any, target?: any) : Fiber {
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
