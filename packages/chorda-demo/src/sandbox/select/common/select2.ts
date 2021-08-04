import { Blueprint, HtmlBlueprint, InferBlueprint, Injector, iterable, Listener, mix, patch, Scope } from "@chorda/core"
import { DomEvents } from "@chorda/react"
import { OptionProps, Select, SelectProps, Option } from "./select"


type Select2Scope<D> = {
    options: D[]
    value: string
    __it: D[]
}

interface Select2Props<T, I> extends Omit<SelectProps<T>, 'defaultOption'> {
    options$?: Injector<T>
    defaultOption?: Blueprint<Omit<T, keyof I>&I>
//    onChange?: Listener<T, any>
    value$?: Injector<T>
}



export const Select2 = <D, T extends Scope=unknown>(props: Select2Props<T&Select2Scope<D>, Option2Scope<D>>) : InferBlueprint<T> => {
    return mix<Select2Scope<D>, DomEvents>(Select(props as SelectProps<T>), {
        injections: {
            options: props.options$,
            value: props.value$,
            __it: (scope) => iterable(scope.options),
        },
        reactions: {
            __it: (v) => patch({items: v}),
            value: (v) => patch({dom: {defaultValue: v}})
        },
        events: {
            $dom: {
                change: (e, {value}) => {
                    value.$value = (e.target as any).value
                }    
            }
        },
        defaultItem: Option2<D, Select2Scope<D>&{__it: D}>({
            option$: (scope) => scope.__it
        })
    })
}



type Option2Scope<D> = {
    option: D
    text: string
    key: string
}

type Option2Props<T> = OptionProps<T> & {
    text$?: Injector<T>
    option$?: Injector<T>
    key$?: Injector<T>
}

export const Option2 = <D, T=unknown>(props: Option2Props<T&Option2Scope<D>>) : InferBlueprint<T> => {
    return mix<Option2Scope<D>>(Option(props), {
        injections: {
            text: props.text$,
            option: props.option$,
            key: props.key$,
        },
        reactions: {
            text: (v) => patch({text: v}),
            key: (v) => patch({dom: {value: v}})
        }
    })
}