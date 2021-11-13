import { Blueprint, Infer, mix, observable, Scope } from "@chorda/core"
import { Field } from "chorda-bulma"
import { FieldIcons } from "../form/field/with-icon"
import { withMix, watch } from "../utils"
import { Dropdown, DropdownPropsType, DropdownScope, DropdownTrigger } from "./Dropdown"
import { MenuItem } from "./Dropdown/utils"
import { TextInput, TextInputScope } from "./TextInput"



type DropdownInputScope = {
    focused: boolean
}

type DropdownInputProps<T, E> = {
    icon?: Blueprint<T, E>
    inputAs?: Blueprint<T&TextInputScope, E>
}

export type DropdownInputPropsType<I, T, E=unknown, V=any> = DropdownPropsType<I, T, V> & DropdownInputProps<T&DropdownScope<I, V>, E>


export const DropdownInput = <T, E, I=MenuItem>(props: DropdownInputPropsType<I, T&DropdownInputScope, E>) : Infer.Blueprint<T, E> => {
    return mix<DropdownInputScope&DropdownScope<unknown>>(
        Dropdown(props),
        {
            templates: {
                trigger: withMix(false, DropdownTrigger({
                    content: Field({
                        control: TextInput({
                            value$: $ => $.$context.value,
                            onFocus: (e, {focused}) => {
                                focused.$value = true
                            },
                            onBlur: (e, {focused}) => {
                                focused.$value = false
                            },
                        }),
                    }),
                }))
            },
        },
        props && {
            templates: {
                trigger: withMix(DropdownTrigger({
                    content: Field({
                        control: TextInput({
                            as: props.inputAs
                        }),
                        as: FieldIcons({
                            rightIcon: props.icon
                        })
                    }),
                }), props.trigger)
            },
            defaults: {
                focused: () => observable(false)
            },
            joints: {
                autoActivate: ({active, items, focused}) => {

                    watch(() => {
//                        console.log(items.length, focused.$value)
                        active.$value = items.length > 1 && focused.$value
                    }, [items, focused])

                }
            }
        }
    )
}