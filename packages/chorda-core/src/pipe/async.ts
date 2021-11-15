import { ownTaskFilter, Scheduler, subscriptionTaskFilter, Effect, unknownTaskFilter } from "./utils";


const avgTimeInterval = (t0: number, t1: number, total: number) => {
    return Number((Math.round(t1 - t0)/total).toFixed(5))
}

const log = (msg: string, ...data: any) => {
    console.log.apply(this, ['%c'+msg, 'color: blue', ...data])
}



export class AsyncEngine<T extends Effect = Effect> implements Scheduler<T> {

    tasks: T[]
    deferred: T[]
    subscriptions: Scheduler[]
    scheduled: boolean
    processing: boolean
    name: string

    constructor (name?: string) {
        this.tasks = []
        this.subscriptions = []
        this.deferred = []
        this.scheduled = false
        this.name = name || 'default'
    } 

    queue(task: T): void {

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

    unsubscribe(engine: Scheduler) {
        this.subscriptions = this.subscriptions.filter(sub => sub != engine)
    }

    effect (fn: Function, arg?: any, target?: any) : Effect {
        return {fn, arg, target, engine: this}
    }

    schedule () {

        if (this.scheduled) {
            return
        }

        this.scheduled = true
        setTimeout(() => {

            this.scheduled = false

            this.flush()

        })
    }

    flush () {

        const t0 = performance.now()

        this.processing = true
        //            console.log('tick')
        
        let tasks = this.tasks
        this.tasks = []

        this.deferred = this.deferred.concat(this.process(tasks))

        // отправляем чужие задачи дальше по конвейеру
        if (this.tasks.length == 0) {
            this.deferred
                .filter(subscriptionTaskFilter(this.subscriptions))
                .filter(unknownTaskFilter(this.subscriptions))
        }
        else if (!this.scheduled) {
            console.error('Non scheduled tasks detected', this.tasks)
        }

        this.processing = false
        
        const t1 = performance.now()
        log(`[${this.name}] patch end`, tasks.length, Math.round(t1 - t0), avgTimeInterval(t0, t1, tasks.length)/*, deleted ? '-'+deleted : ''*/)
    }

    process (tasks: T[]) : T[] {
        return tasks.filter(ownTaskFilter(this))
    }

    get isProcessing () {
        return this.processing
    }


}