import { ObservableValueSet, UidFunc } from './node';
declare type Computor<T> = () => T;
export declare const computable: <T>(compute: Computor<T>, initValue?: T, entryUidFunc?: UidFunc) => ObservableValueSet<T> & T;
export {};
