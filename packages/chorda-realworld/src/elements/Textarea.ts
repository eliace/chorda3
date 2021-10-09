import { InputScope, InputProps, Input } from "./Input";
import { InferBlueprint, mix } from "@chorda/core";


type TextareaScope = InputScope

type TextareaProps<T> = InputProps<T> & {
    rows?: number
}



export const Textarea = <T>(props: TextareaProps<T>) : InferBlueprint<T> => {
    return mix<TextareaScope>(Input(props), {
        tag: 'textarea',
        dom: {
            rows: props.rows
        }
    })
}