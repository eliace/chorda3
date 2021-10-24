import { Box, Button, Field } from "chorda-bulma"
import { TextInput } from "../../helpers"

export default () => {
    return Box({
        styles: {
            width: 400
        },
        items: [
            Field({
                label: 'Email',
                control: TextInput({
                    type: 'email',
                    placeholder: 'e.g. alex@example.com'
                })
            }),
            Field({
                label: 'Password',
                control: TextInput({
                    type: 'password',
                    placeholder: '**********'
                })
            }),
            Button({
                css: 'is-primary',
                text: 'Sign in'
            })
        ]
    })
}
