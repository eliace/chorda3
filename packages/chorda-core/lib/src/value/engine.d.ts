import { SubscriptionProvider } from ".";
import { LifecycleProvider } from "./utils";
export declare type Transaction = {
    joined: boolean;
};
declare type NodeUpdate = {
    node: SubscriptionProvider;
    prev: any;
    next: any;
};
declare type UpdateSession = {
    nodes: Set<any>;
    head: any;
    deleted: (SubscriptionProvider & LifecycleProvider)[];
    updated: NodeUpdate[];
};
export declare const openTransaction: () => Transaction;
export declare const closeTransaction: (t: Transaction) => void;
export declare const transactionUpdates: (t: Transaction) => NodeUpdate[];
export declare const currentTransaction: () => UpdateSession;
declare class UpdateEngine {
    _sessions: UpdateSession[];
    _commiting: boolean;
    _commitedNodes: Map<unknown, any>;
    constructor();
    addSession(session: UpdateSession): void;
    commit(): void;
}
export declare const commitEngine: () => UpdateEngine;
export {};
