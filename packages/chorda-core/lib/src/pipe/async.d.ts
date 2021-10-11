import { Scheduler, Task } from "./utils";
export declare class AsyncEngine<T extends Task = Task> implements Scheduler<T> {
    tasks: T[];
    deferred: T[];
    subscriptions: Scheduler[];
    scheduled: boolean;
    processing: boolean;
    name: string;
    constructor(name?: string);
    publish(task: T): void;
    subscribe(engine: Scheduler): boolean;
    unsubscribe(engine: Scheduler): void;
    task(fn: Function, arg?: any, target?: any): Task;
    schedule(): void;
    process(tasks: T[]): T[];
    get isProcessing(): boolean;
}
