

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
    
    unsubscribe (engine: Scheduler) : void

    task (fn: Function, arg?: any, target?: any) : Task

    readonly isProcessing: boolean
}



interface Engine {
    change () : void  // завешенное изменение
    effect () : void  // эффект отрисовки
    patch () : void  // патч компонента
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

    // добавляем задачу в начало конвейера
    push (task: Task) : Pipe
    // исполняем задачу в ближайший тик планировщика
    asap (task: Task) : Pipe
}


export const ownTask = (fn: Function, arg?: any, target?: any) => {
    return {fn, arg, target}
}




export const ownTaskFilter = (owner: Scheduler) => (task: Task) => {
    if (!task.engine || task.engine == owner) {
//        console.log('task', task.arg, task.target)
        // исполняем задачу
        task.fn?.call(task.target, task.arg)
        task.done = true
    }
    else {
        return true
    }
}

export const subscriptionTaskFilter = (subscriptions: Scheduler[]) => (task: Task) => {
    const engine = subscriptions.find((sub) => sub == task.engine)
    if (engine) {
        engine.publish(task)
    }
    else {
        return true
    }
}

export const unknownTaskFilter = (subscriptions: Scheduler[]) => (task: Task) => {
    subscriptions.forEach(sub => {
        sub.publish(task)
    })
}
