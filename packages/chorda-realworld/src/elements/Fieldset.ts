import { Injector, mix, patch, InferBlueprint } from "@chorda/core"



type FieldsetScope = {
    disabled: boolean
}

type FieldsetProps<T> = {
    disabled$?: Injector<T>
}

export const Fieldset = <T>(props: FieldsetProps<T&FieldsetScope>) : InferBlueprint<T> => {
    return mix<FieldsetScope>({
        tag: 'fieldset',
        reactions: {
            disabled: (v) => patch({dom: {disabled: v}})
        },
    }, props && {
        injections: {
            disabled: props.disabled$
        }
    })
}
