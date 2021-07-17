import { HtmlBlueprint } from "@chorda/core"
import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons"
import { faBold, faCheck, faItalic, faTimes, faUnderline } from "@fortawesome/free-solid-svg-icons"
import { Button, Buttons } from "chorda-bulma"
import { FaIcon, SvgIcon } from "../../helpers"



export default () : HtmlBlueprint => {
    return {
        items: [
            Buttons({
                buttons: [
                    Button({icon: SvgIcon({icon: faBold})}),
                    Button({icon: SvgIcon({icon: faItalic})}),
                    Button({icon: SvgIcon({icon: faUnderline})}),
                ]
            }),
            Buttons({
                buttons: [
                    Button({
                        text: 'GitHub', 
                        leftIcon: FaIcon({icon: faGithub})
                    }),
                    Button({
                        text: '@foo',
                        color: 'is-primary', 
                        leftIcon: FaIcon({icon: faTwitter})
                    }),
                    Button({
                        text: 'Save',
                        color: 'is-success', 
                        leftIcon: FaIcon({icon: faCheck})
                    }),
                    Button({
                        text: 'Delete',
                        css: 'is-danger is-outlined', 
                        rightIcon: FaIcon({icon: faTimes})
                    }),
                ]
            }),
        ]
    }
}