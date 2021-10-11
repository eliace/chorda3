import { Scheduler, Task } from "./utils";
export declare class BufferedEngine<T extends Task = Task> implements Scheduler<T> {
    tasks: Task[];
    subscriptions: Scheduler[];
    processing: boolean;
    constructor();
    publish(task: T): void;
    subscribe(engine: Scheduler): boolean;
    unsubscribe(engine: Scheduler): void;
    task(fn: Function, arg?: any, target?: any): Task;
    flush(): void;
    get isProcessing(): boolean;
}
