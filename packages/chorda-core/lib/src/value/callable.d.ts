export interface Callable {
    $call(thisArg: any, args: any[]): any;
}
export declare type CallableEvents<R> = {
    done: () => R;
    fail: () => any;
    wait: () => void;
};
export declare const callable: <T extends Function>(initValue: T) => T;
export declare const isCallable: (v: any) => v is Callable;
