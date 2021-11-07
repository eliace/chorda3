import { Field } from "chorda-bulma"
import { FaIcon, TextInput } from "../../../helpers"
import { FieldIcons } from "../../../form/field/with-icon"
import { withMix } from "../../../utils"
import { faRocket, faSearch } from "@fortawesome/free-solid-svg-icons"
import { Infer, Injector, Listener } from "@chorda/core"



type MdnSearchSimpleProps<T> = {
    onFocus?: Listener<T, void>
    onInput?: Listener<T, InputEvent>
    value$?: Injector<T>
    placeholder?: string
}


export const MdnSearchSimple = <T>(props: MdnSearchSimpleProps<T>) : Infer.Blueprint<T> => {
    return Field({
        as: withMix(
            FieldIcons({
                rightIcon: FaIcon({icon: faRocket})
            }),
            {
                styles: {
                    display: 'inline-flex',
                    minWidth: 300,
                },
                templates: {
                    control: {
                        styles: {
                            width: '100%'
                        }
                    }
                }
            }
        ),
        control: TextInput({
            onFocus: props.onFocus,
            value$: props.value$,
            onInput: props.onInput,
            placeholder: props.placeholder,
        })
    })
}