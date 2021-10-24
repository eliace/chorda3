import { faAlignCenter, faAlignLeft, faAlignRight, faBold, faItalic, faUnderline } from "@fortawesome/free-solid-svg-icons"
import { Addon, Button, Buttons, Field } from "chorda-bulma"
import { FaIcon } from "../../helpers"



export default () => {
    return Field({
        addons: {
            left: Addon({
                content: Button({
                    leftIcon: FaIcon({icon: faAlignLeft}), 
                    text: 'Left'
                }),
            }),
            center: Addon({
                content: Button({
                    leftIcon: FaIcon({icon: faAlignCenter}),
                    text: 'Center'
                }),
            }),
            right: Addon({
                content: Button({
                    leftIcon: FaIcon({icon: faAlignRight}),
                    text: 'Right'
                }),
            }),
        }
    })
}