import { ValueKey, ValueSet } from "./node";
import { NextValue, ValueIterator } from "./utils";
export declare class ObservableValueIterator<T> implements ValueIterator<T> {
    source: ValueSet<any>;
    keys: ValueKey[];
    index: number;
    maxIndex: number;
    key: string;
    constructor(source: ValueSet<T>, key: string);
    next<K>(): NextValue<K>;
    get $name(): string;
}
