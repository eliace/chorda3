export interface Mixed<T> {
    build: (rules: MixRules) => T | boolean;
    mix: <X>(nextMix: X) => Mixed<T & X>;
    readonly entries: any[];
}
export declare type MixRules = {
    [key: string]: Function;
};
export declare const deepClone: (o: any) => any;
export declare const buildOpts: (opts: any, nextOpts: any, rules?: MixRules) => any;
