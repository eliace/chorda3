import { Proxied } from '../value';
import { Mixed, MixRules } from './utils';
export declare class Mixin<T = unknown> implements Mixed<T> {
    _raw: (T | boolean)[];
    constructor(...args: any[]);
    mixins(): (boolean | T)[];
    mix<X extends any | Mixin>(nextOpts: X): Mixed<T & X>;
    mergeBefore(prevOpts: any): Mixed<T>;
    build(rules?: MixRules): T | boolean;
    get entries(): (boolean | T)[];
}
export declare const lastEffectiveValue: <T>(o: Mixed<T>) => boolean | T;
export declare const mixin: <T>(...args: T[]) => Mixed<T>;
export declare const isMixed: <T>(obj: T | Mixed<T> | Proxied) => obj is Mixed<T>;
