export declare enum ItemOp {
    ADD = "add",
    DELETE = "delete",
    UPDATE = "update"
}
export declare type KVItem<T = any> = {
    key: string;
    value: T;
    op?: ItemOp;
};
export declare const reconcile: (prevItems: KVItem[], nextItems: KVItem[]) => KVItem[];
