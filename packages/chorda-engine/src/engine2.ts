import { AsyncEngine, ownTaskFilter, Scheduler, State, Stateable, subscriptionTaskFilter, Task, unknownTaskFilter } from "@chorda/core";


const destroyedTaskFilter = (task: Task<Stateable>) => {
    if (task.target && (task.target.state == State.Destroying || task.target.state == State.Destroyed)) {
//        deleted++
//      console.warn('Ignoring target in destroying or destroyed state', task.target)
        return false
    }
    return true
}

const avgTimeInterval = (t0: number, t1: number, total: number) => {
    return Number((Math.round(t1 - t0)/total).toFixed(5))
}



export class PatchEngine extends AsyncEngine<Task<Stateable>> {

    process (tasks: Task<Stateable>[]) : Task<Stateable>[] {
        return tasks
            .filter(destroyedTaskFilter)
            .filter(ownTaskFilter(this))
    }

    // schedule () {

    //     if (this.scheduled) {
    //         return
    //     }

    //     this.scheduled = true
    //     setTimeout(() => {
    //         const t0 = performance.now()

    //         this.scheduled = false

    //         this.processing = true

    //         let tasks = this.tasks
    //         this.tasks = []

    //         tasks
    //             .filter(destroyedTaskFilter)
    //             .filter(ownTaskFilter(this))

    //             .filter(subscriptionTaskFilter(this.subscriptions))
    //             .filter(unknownTaskFilter(this.subscriptions))

    //         this.processing = false

    //         const t1 = performance.now()
    //         console.log('tick', tasks.length, Math.round(t1 - t0), avgTimeInterval(t0, t1, tasks.length)/*, deleted ? '-'+deleted : ''*/)
    //     })
    // }

}



export const createPatchScheduler = () : Scheduler<Task<Stateable>> => {
    return new PatchEngine()
}