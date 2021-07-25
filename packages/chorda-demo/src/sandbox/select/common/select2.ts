import { HtmlBlueprint, Injector, iterable, Listener, mix, patch } from "@chorda/core"
import { DomEvents } from "@chorda/react"
import { OptionProps, Select, SelectProps, Option } from "./select"


type Select2Scope<D> = {
    options: D[]
    value: string
    __it: D[]
}

type Select2Props<T, I> = SelectProps<T> & {
    options$?: Injector<T>
    defaultOption?: HtmlBlueprint<Omit<T, keyof I>&I>
//    onChange?: Listener<T, any>
    value$?: Injector<T>
}



export const Select2 = <D, T=unknown>(props: Select2Props<T&Select2Scope<D>, Option2Scope<D>>) : HtmlBlueprint<T> => {
    return mix<Select2Scope<D>, DomEvents>(Select(props), {
        injectors: {
            options: props.options$,
            value: props.value$,
            __it: (scope) => iterable(scope.options),
        },
        reactors: {
            __it: (v) => patch({items: v}),
            value: (v) => patch({dom: {defaultValue: v}})
        },
        events: {
            change: (e, {value}) => {
                value.$value = (e.target as any).value
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

type Option2Props<T> = OptionProps & {
    text$?: Injector<T>
    option$?: Injector<T>
    key$?: Injector<T>
}

export const Option2 = <D, T=unknown>(props: Option2Props<T&Option2Scope<D>>) : HtmlBlueprint<T> => {
    return mix<Option2Scope<D>>(Option(props), {
        injectors: {
            text: props.text$,
            option: props.option$,
            key: props.key$,
        },
        reactors: {
            text: (v) => patch({text: v}),
            key: (v) => patch({dom: {value: v}})
        }
    })
}