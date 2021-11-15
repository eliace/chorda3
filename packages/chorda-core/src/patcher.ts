import { State, Stateable } from "./Hub"
import { AsyncEngine, ownTaskFilter, Scheduler, Effect } from "./pipe"



export class DefaultPatcher extends AsyncEngine<Effect<Stateable>> {

    process (tasks: Effect<Stateable>[]) : Effect<Stateable>[] {
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



export const createAsyncPatcher = (name?: string) : Scheduler<Effect<Stateable>> => {
    return new DefaultPatcher(name)
}