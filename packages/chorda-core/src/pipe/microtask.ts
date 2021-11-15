import { Effect } from ".";
import { AsyncEngine } from "./async";



export class MicrotaskEngine<T extends Effect> extends AsyncEngine<T> {

    schedule () {

        if (this.scheduled) {
            return
        }

        this.scheduled = true
        queueMicrotask(() => {

            this.scheduled = false

            this.flush()

        })
    }
    
}