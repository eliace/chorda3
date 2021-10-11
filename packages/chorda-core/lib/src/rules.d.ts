import { Mixin } from './mix';
export declare const DefaultRules: {
    Option: (x: any, y: any) => Mixin<unknown>;
    OptionCollection: (x: {
        [key: string]: any;
    }, y: boolean | {
        [key: string]: any;
    }) => boolean | {
        [key: string]: any;
    };
    OptionArray: (x: [], y: []) => void;
    StringArray: (x: string[], y: string[]) => any[];
    Overlap: (x: any, y: any) => any;
    OptionCollectionOverlap: (x: any, y: any) => any;
};
