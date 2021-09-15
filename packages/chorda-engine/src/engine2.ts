import { AsyncEngine, ownTaskFilter, Scheduler, State, Stateable, subscriptionTaskFilter, Task, unknownTaskFilter } from "@chorda/core";


const destroyedTaskFilter = (task: Task<Stateable>) => {
    if (task.target.state == State.Destroying || task.target.state == State.Destroyed) {
//        deleted++
//      console.warn('Ignoring target in destroying or destroyed state', task.target)
        return
    }
    return true
}

const avgTimeInterval = (t0: number, t1: number, total: number) => {
    return Number((Math.round(t1 - t0)/total).toFixed(5))
}



export class PatchEngine extends AsyncEngine<Task<Stateable>> {

    schedule () {
        this.scheduled = true
        setTimeout(() => {
            const t0 = performance.now()

            let tasks = this.tasks
            this.tasks = []

            tasks
                .filter(destroyedTaskFilter)
                .filter(ownTaskFilter(this))
                .filter(subscriptionTaskFilter(this.subscriptions))
                .filter(unknownTaskFilter(this.subscriptions))

            this.scheduled = false

            const t1 = performance.now()
            console.log('tick', tasks.length, Math.round(t1 - t0), avgTimeInterval(t0, t1, tasks.length)/*, deleted ? '-'+deleted : ''*/)
        })
    }

}



export const createPatchScheduler = () : Scheduler<Task<Stateable>> => {
    return new PatchEngine()
}