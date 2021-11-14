import { State, Stateable } from "./Hub"
import { AsyncEngine, ownTaskFilter, Scheduler, Fiber } from "./pipe"



export class DefaultPatcher extends AsyncEngine<Fiber<Stateable>> {

    flush (tasks: Fiber<Stateable>[]) : Fiber<Stateable>[] {
        return tasks.filter(task => {
            if (task.target && (task.target.state == State.Destroying || task.target.state == State.Destroyed)) {
                //        deleted++
                //      console.warn('Ignoring target in destroying or destroyed state', task.target)
                return false
            }

            return ownTaskFilter(this)(task)
        })
        // return tasks
        //     .filter(destroyedTaskFilter)
        //     .filter(ownTaskFilter(this))
    }


}



export const createAsyncPatcher = (name?: string) : Scheduler<Fiber<Stateable>> => {
    return new DefaultPatcher(name)
}