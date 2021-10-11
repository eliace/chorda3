export declare type Task<T = any> = {
    key?: string;
    fn: Function;
    arg?: any;
    target?: T;
    engine?: Scheduler;
    done?: boolean;
};
export interface Scheduler<T extends Task = Task> {
    publish(task: T): void;
    subscribe(engine: Scheduler): boolean;
    unsubscribe(engine: Scheduler): void;
    task(fn: Function, arg?: any, target?: any): Task;
    readonly isProcessing: boolean;
}
export interface Pipe {
    push(task: Task): Pipe;
    asap(task: Task): Pipe;
}
export declare const ownTask: (fn: Function, arg?: any, target?: any) => {
    fn: Function;
    arg: any;
    target: any;
};
export declare const ownTaskFilter: (owner: Scheduler) => (task: Task) => boolean;
export declare const subscriptionTaskFilter: (subscriptions: Scheduler[]) => (task: Task) => boolean;
export declare const unknownTaskFilter: (subscriptions: Scheduler[]) => (task: Task) => void;
