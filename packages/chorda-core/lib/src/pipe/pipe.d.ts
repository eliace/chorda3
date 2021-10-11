import { Pipe, Scheduler, Task } from "./utils";
declare class SimplePipe implements Pipe {
    head: Scheduler;
    subscriptions: [Scheduler, Scheduler][];
    constructor(schedulers: Scheduler[]);
    push(task: Task<any>): Pipe;
    asap(task: Task<any>): Pipe;
    destroy(): void;
}
export declare const pipe: (...schedulers: Scheduler[]) => SimplePipe;
export {};
