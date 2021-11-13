

export type Fiber<T=any> = {
    key?: string
    fn: Function
    arg?: any
    target?: T
    engine?: Scheduler
    done?: boolean
}


export interface Scheduler<F extends Fiber = Fiber> {

    queue (fiber: F) : void

    subscribe (engine: Scheduler) : boolean
    
    unsubscribe (engine: Scheduler) : void

    fiber (fn: Function, arg?: any, target?: any) : Fiber

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
    push (fiber: Fiber) : Pipe
    // исполняем задачу в ближайший тик планировщика
    asap (fiber: Fiber) : Pipe
}


export const fiber = (fn: Function, arg?: any, target?: any) => {
    return {fn, arg, target}
}




export const ownTaskFilter = (owner: Scheduler) => (task: Fiber) => {
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

export const subscriptionTaskFilter = (subscriptions: Scheduler[]) => (task: Fiber) => {
    const engine = subscriptions.find((sub) => sub == task.engine)
    if (engine) {
        engine.queue(task)
    }
    else {
        return true
    }
}

export const unknownTaskFilter = (subscriptions: Scheduler[]) => (task: Fiber) => {
    subscriptions.forEach(sub => {
        sub.queue(task)
    })
}
