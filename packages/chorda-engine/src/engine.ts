import { Engine, State, Stateable } from "@chorda/core";


type Task = {
    fn: Function
    arg: any
    target: Stateable
}


export class SimpleEngine implements Engine<Stateable> {

    links: Engine<Stateable>[]
    isScheduled: boolean
    tasks: Task[]
    subscriptions: Function[]

    constructor () {
        this.links = []
        this.tasks = []
        this.isScheduled = false
        this.subscriptions = []
    }

    chain (link: Engine<any>) {
        this.links.push(link)
    }
    
    scheduleTask (fn: Function, arg: any, target: Stateable) {
        this.tasks.push({fn, arg, target})
        !this.isScheduled && this.schedule()
    }

    immediate () {

    }

    schedule(): void {
        if (!this.isScheduled) {
            setTimeout(() => {
                const t0 = performance.now()

                const tasks = this.tasks
                this.tasks = []
                this.isScheduled = false

                // TODO на этом этапе можно проводить анализ и перестроение порядка патчей

                let deleted = 0
                tasks
                    .forEach(task => {
                        // фильтруем патчи удаленных компонентов
                        if (task.target.state == State.Destroying || task.target.state == State.Destroyed) {
                            deleted++
//                            console.warn('Ignoring target in destroying or destroyed state', task.target)
                            return
                        }
                        task.fn.call(task.target, task.arg)
                    })

                // по мере исполнения пакета задач, могут накопиться другие задачи
                // если новых задач нет, переходим к следующему движку по цепочке
                if (this.tasks.length == 0) {
                    this.subscriptions.forEach(f => f())
                    this.links.forEach(link => link.schedule())
                }
                else if (!this.isScheduled) {
                    console.error('Not scheduled tasks found')
                }

                const t1 = performance.now()
                console.log('tick', tasks.length, Math.round(t1 - t0), avgTimeInterval(t0, t1, tasks.length), deleted ? '-'+deleted : '')

            })
            this.isScheduled = true
        }
    }

    addPostEffect (fn: Function) {
        this.subscriptions.push(fn)
//        throw new Error("Method not implemented.");
    }

}



const avgTimeInterval = (t0: number, t1: number, total: number) => {
    return Number((Math.round(t1 - t0)/total).toFixed(5))
}


export const createPatchEngine = () : Engine<Stateable> => {
    return new SimpleEngine()
}