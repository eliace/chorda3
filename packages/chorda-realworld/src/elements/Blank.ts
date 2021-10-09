import { InferBlueprint } from "@chorda/core"



export const Blank = <T>(s?: string) : InferBlueprint<T> => {
    return {
        tag: false,
        text: s || '  '
    }
}
