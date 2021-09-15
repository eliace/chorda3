

export type Task<T=any> = {
    key?: string
    fn: Function
    arg?: any
    target?: T
    engine?: Scheduler
    done?: boolean
}


export interface Scheduler<T extends Task = Task> {

    publish (task: T) : void

    subscribe (engine: Scheduler) : boolean

    task (fn: Function, arg?: any, target?: any) : Task

}




// - вычисления
// - патчи
// - отрисовка

export interface Pipe {
    // - добавить задачу в указанный планировщик
    // - добавить в конвейер задачу для указанного планировщика
    // - добавить задачу в ближайший тик
    // - добавить задачу в очередь тиков
    // - исполнить задачу прямо сейчас в указанном планировщике или добавить в конвейер

    // добавляем задачу в указанный планировщик
    publish (task: Task) : Pipe
}