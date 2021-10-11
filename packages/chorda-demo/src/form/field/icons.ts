import { InferBlueprint } from "@chorda/core"
import { faCheck, faEnvelope, faExclamationTriangle, faUser } from "@fortawesome/free-solid-svg-icons"
import { Color, Field, Icon } from "chorda-bulma"
import { withBlueprint } from "../../utils"
import { FaIcon, TextInput } from "../../helpers"
import { withFieldIcons } from "./with-icon"



export default () : InferBlueprint<unknown> => {
    return {
        items: [
            Field({
                label: 'Username',
                control: TextInput({
                    placeholder: 'Text input',
                    value: 'bulma'
                }),
                help: 'This username is available',
                color: Color.Success,
                as: withFieldIcons({
                    injections: {
                        leftIcon: () => FaIcon({icon: faUser}),
                        rightIcon: () => FaIcon({icon: faCheck}),                    
                    },        
                })
            }),
            withFieldIcons(withBlueprint({
                injections: {
                    leftIcon: () => FaIcon({icon: faEnvelope}),
                    rightIcon: () => FaIcon({icon: faExclamationTriangle}),                    
                },
                as: Field({
                    label: 'Email',
                    control: TextInput({
                        placeholder: 'Email input',
                        value: 'hello@'
                    }),
                    help: 'This email is invalid',
                    color: Color.Danger
                })
            })),
        ]
    }
}